import { EventEmitter } from 'node:events';
import { WebSocket } from 'ws';
import { CloseCode, ConnectionState, Events, OpCode, WebSocketEvent } from '../enums/gateway';
import type { PresenceUpdate } from '../types/event';
import { Connection } from './connection';
import { CLOSE_CODE_MESSAGES, FATAL_CLOSE_CODES, RESUMABLE_CLOSE_CODES } from './constants';
import { GatewayQueue } from './gatewayQueue';
import { Heartbeat } from './heartbeat';
import { RateLimiter } from './rateLimiter';
import type { Payload } from './types/payload';

const GATEWAY_ADDRESS = 'wss://gateway.discord.gg/?v=10&encoding=json';
const BACKOFF_BASE_DELAY = 1_000;
const BACKOFF_MAX_DELAY = 60_000;
const BACKOFF_MULTIPLIER = 2;
const RATE_LIMIT_DELAY = 60_000;

export interface GatewayOptions {
  token: string;
  intents: number;
  maxReconnects?: number;
  timeout?: number;
}

export class GatewayClient extends EventEmitter {
  private connection: Connection;
  private connectionTimeout?: NodeJS.Timeout;
  private heartbeat?: Heartbeat;
  private intents: number;
  private maxReconnects: number;
  private queue: GatewayQueue;
  private rateLimiter: RateLimiter;
  private reconnectAttempts: number;
  private resumeUrl?: string;
  private sessionId?: string;
  private sequence: number | null;
  private state: ConnectionState;
  private timeout: number;
  private token: string;
  private webSocket: WebSocket;

  public constructor(options: GatewayOptions) {
    super();
    this.connection = new Connection();
    this.intents = options.intents;
    this.maxReconnects = options.maxReconnects ?? 5;
    this.rateLimiter = new RateLimiter();
    this.webSocket = new WebSocket(GATEWAY_ADDRESS);
    this.queue = new GatewayQueue(this.rateLimiter, this.webSocket);
    this.reconnectAttempts = 0;
    this.sequence = null;
    this.state = ConnectionState.DISCONNECTED;
    this.timeout = options.timeout ?? 30_000;
    this.token = options.token;
    this.validateToken();
  }

  public connect(): void {
    if (this.state === ConnectionState.CONNECTING || this.state === ConnectionState.CONNECTED) {
      return;
    }

    this.setState(ConnectionState.CONNECTING);
    this.webSocket = new WebSocket(GATEWAY_ADDRESS);
    this.connectionTimeout = setTimeout(() => {
      if (this.state === ConnectionState.CONNECTING) {
        this.webSocket.close(1000, 'Connection timeout.');
        this.onFailed();
      }
    }, this.timeout);

    this.webSocket.on(WebSocketEvent.OPEN, () => this.onOpen());
    this.webSocket.on(WebSocketEvent.MESSAGE, (data: unknown) => this.onMessage(data));
    this.webSocket.on(WebSocketEvent.CLOSE, (code: number, reason: Buffer) =>
      this.onClose(code, reason)
    );
    this.webSocket.on(WebSocketEvent.ERROR, (error: Error) => this.onError(error));
  }

  public disconnect(): void {
    this.setState(ConnectionState.DISCONNECTED);
    this.connection.onDisconnect();
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = undefined;
    }
    this.heartbeat?.stop();
    this.rateLimiter.reset();
    this.webSocket.close(1000, 'Client disconnected.');
  }

  private identify(): void {
    if (this.webSocket.readyState !== WebSocket.OPEN) {
      this.emit('error', new Error('Cannot identify: WebSocket not open.'));
      return;
    }
    if (this.rateLimiter.isRateLimited(OpCode.IDENTIFY)) {
      this.emit('error', new Error('Cannot identify: Rate limited.'));
      this.webSocket.close(1000, 'Rate limited on identify.');
      return;
    }
    const payload =
      this.sessionId && this.resumeUrl
        ? {
            op: OpCode.RESUME,
            d: {
              token: this.token,
              sessionId: this.sessionId,
              seq: this.sequence,
            },
          }
        : {
            op: OpCode.IDENTIFY,
            d: {
              token: this.token,
              intents: this.intents,
              properties: {
                os: process.platform ?? 'linux',
                browser: 'mocha',
                device: 'mocha',
              },
              compress: false,
              large_threshold: 50,
            },
          };
    try {
      this.webSocket.send(JSON.stringify(payload));
      if (this.sessionId) {
        this.emit('resuming');
      } else {
        this.rateLimiter.handleOp(OpCode.IDENTIFY);
        this.emit('identifying');
      }
    } catch (error) {
      this.emit('error', new Error(`Failed to send identify payload: ${error}`));
    }
  }

  private handleAck(_payload: Payload): void {
    this.heartbeat?.ack();
  }

  private handleDispatch(payload: Payload): void {
    if (!payload.t) {
      this.emit('error', new Error('Dispatch event missing event type.'));
      return;
    }
    try {
      if (payload.t === Events.READY) {
        this.handleReady(payload);
      } else if (payload.t === Events.RESUMED) {
        this.handleResumed(payload);
      } else {
        this.emit('dispatch', payload.t, payload.d);
      }
    } catch (error) {
      this.emit('error', new Error(`Failed to handle dispatch event ${payload.t}: ${error}`));
    }
  }

  private handleHeartbeat(_payload: Payload): void {
    this.sendHeartbeat();
  }

  private handleHello(payload: Payload): void {
    if (!(payload.d.heartbeat_interval && typeof payload.d.heartbeat_interval === 'number')) {
      this.emit('error', new Error('Invalid hello payload: missing heartbeat.'));
      return;
    }
    this.startHeartbeat(payload.d.heartbeat_interval as number);
    this.identify();
  }

  private handleInvalidSession(payload: Payload): void {
    const canResume: boolean = payload.d;
    if (!canResume) {
      this.sessionId = undefined;
      this.resumeUrl = undefined;
      this.sequence = null;
    }
    setTimeout(() => this.identify(), Math.random() * 1_000 + 5_000);
  }

  private handleReconnect(_payload: Payload): void {
    this.reconnect();
  }

  private handleResumed(_payload: Payload): void {
    this.reconnectAttempts = 0;
    this.emit('resumed');
  }

  private handleReady(payload: Payload): void {
    const data: Record<string, unknown> = payload.d;
    if (!(data.session_id && typeof data.session_id === 'string')) {
      this.emit('error', new Error('READY event missing session_id.'));
      return;
    }
    this.sessionId = data.session_id;
    this.resumeUrl = data.resume_gateway_url as string;
    this.reconnectAttempts = 0;
    this.emit('ready', data);
  }

  private onClose(code: CloseCode, reason: Buffer): void {
    this.heartbeat?.stop();
    this.setState(ConnectionState.DISCONNECTED);
    const message = CLOSE_CODE_MESSAGES[code];
    this.emit('disconnected', { code, reason: reason.toString(), message });
    if (code in FATAL_CLOSE_CODES) {
      this.setState(ConnectionState.FAILED);
      this.emit(
        'error',
        new Error(`Fatal gateway error (${code}): ${message} - ${reason.toString()}`)
      );
      return;
    }
    if (code === CloseCode.RATE_LIMITED) {
      setTimeout(() => this.reconnect(), RATE_LIMIT_DELAY);
      return;
    }
    if (!(code in RESUMABLE_CLOSE_CODES)) {
      this.sessionId = undefined;
      this.resumeUrl = undefined;
      this.sequence = null;
    }
    this.reconnect();
  }

  private onError(error: Error): void {
    this.emit('error', error);
    this.setState(ConnectionState.FAILED);
    this.resetTimeout();
  }

  private onFailed(): void {
    this.setState(ConnectionState.FAILED);
    this.resetTimeout();
  }

  private onHeartbeatTimeout() {
    this.emit('heartbeatTimeout');
    this.reconnect();
  }

  private onMessage(data: unknown): void {
    try {
      const rawData = data as { toString(): string };
      const payload: Payload = JSON.parse(rawData.toString());
      if (payload.s && typeof payload.s === 'number') {
        this.sequence = payload.s;
      }
      switch (payload.op) {
        case OpCode.DISPATCH:
          this.handleDispatch(payload);
          break;
        case OpCode.HEARTBEAT:
          this.handleHeartbeat(payload);
          break;
        case OpCode.HEARTBEAT_ACK:
          this.handleAck(payload);
          break;
        case OpCode.HELLO:
          this.handleHello(payload);
          break;
        case OpCode.INVALID_SESSION:
          this.handleInvalidSession(payload);
          break;
        case OpCode.RECONNECT:
          this.handleReconnect(payload);
          break;
        default:
          this.emit('error', new Error(`Unknown op code received: ${payload.op}.`));
      }
    } catch (error) {
      this.emit('error', new Error(`Failed to parse gateway payload: ${error}`));
    }
  }

  private onOpen(): void {
    this.resetTimeout();
    this.connection.onConnect();
    this.setState(ConnectionState.CONNECTED);
  }

  private reconnect(): void {
    if (this.state === ConnectionState.FAILED) {
      return;
    }
    if (this.reconnectAttempts >= this.maxReconnects) {
      this.setState(ConnectionState.FAILED);
      this.emit('error', new Error('Max reconnect attempts reached.'));
      return;
    }
    this.reconnectAttempts++;
    this.setState(ConnectionState.RECONNECTING);
    this.connection.onReconnect();
    const delay = this.getReconnectDelay(this.reconnectAttempts);
    this.emit('reconnecting', { attempt: this.reconnectAttempts, delay });

    setTimeout(() => {
      if (this.state === ConnectionState.RECONNECTING) {
        this.connect();
      }
    }, delay);
  }

  private resetTimeout(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = undefined;
    }
  }

  private send(payload: Payload): void {
    if (payload.t && typeof payload.t === 'string') {
      if (this.rateLimiter.isRequestLimited(payload.t)) {
        this.queue.enqueue(payload, 0);
        return;
      }
      this.webSocket.send(JSON.stringify(payload));
    } else {
      this.emit('error', new Error('Invalid payload: missing event name.'));
    }
  }

  private setState(state: ConnectionState): void {
    this.state = state;
    this.emit('stateChange', this.state);
  }

  private validateToken(): void {
    if (!/^[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27,}$/.test(this.token)) {
      this.emit('error', new Error('Invalid token.'));
      throw new Error(
        'Invalid token format. Please enter a token in the following format: ' +
          'MTxxxxx.xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxx'
      );
    }
  }

  private getReconnectDelay(attempt: number): number {
    return Math.min(BACKOFF_BASE_DELAY * BACKOFF_MULTIPLIER ** attempt, BACKOFF_MAX_DELAY);
  }

  private sendHeartbeat(): void {
    if (this.webSocket.readyState !== WebSocket.OPEN) {
      return;
    }
    this.webSocket.send(
      JSON.stringify({
        op: OpCode.HEARTBEAT,
        d: this.sequence,
      })
    );
  }

  private startHeartbeat(interval: number): void {
    this.heartbeat?.stop();
    this.heartbeat = new Heartbeat(
      this.webSocket,
      interval,
      () => this.sequence,
      () => this.onHeartbeatTimeout
    );
    this.heartbeat.start();
  }

  public updatePresence(presence: PresenceUpdate) {
    if (!(this.state === ConnectionState.CONNECTED)) {
      const errorMessage = 'Cannot update presence: not connected to the gateway.';
      this.emit('error', new Error(errorMessage));
      throw new Error(errorMessage);
    }
    if (this.rateLimiter.isRateLimited(OpCode.PRESENCE_UPDATE)) {
      const errorMessage = 'Rate limited: cannot update presence at this time.';
      this.emit('error', errorMessage);
      throw new Error(errorMessage);
    }
    const payload = {
      op: OpCode.PRESENCE_UPDATE,
      d: {
        since: presence.since || null,
        activities: presence.activities,
        status: presence.status,
        afk: presence.afk,
      },
    };
    try {
      if (this.rateLimiter.isRateLimited(OpCode.PRESENCE_UPDATE)) {
        this.queue.enqueue(payload, 0);
        return;
      }
      this.webSocket.send(JSON.stringify(payload));
      this.rateLimiter.handleOp(OpCode.PRESENCE_UPDATE);
    } catch (error) {
      throw new Error(`Failed to update presence: ${error}`);
    }
  }
}
