import { EventEmitter } from 'node:events';
import { WebSocket } from 'ws';
import { TIMEOUTS } from '../lib/constants';
import type { APIGatewayPayload } from '../types/index';
import { calculateBackoff } from '../utils/backoff';
import { ConnectionHealthMonitor, ConnectionManager } from './connection';
import { GATEWAY_URL, INTENTS, OPCODES } from './constants';
import { CLOSE_CODES, getCloseCodeMessage, isFatalCloseCode, isResumableCloseCode } from './errors';
import { Heartbeat } from './heartbeat';
import { GatewayRateLimiter, type RateLimitConfig } from './ratelimit';

export interface GatewayOptions {
  token: string;
  intents?: number;
  maxReconnects?: number;
  connectionTimeout?: number;
  rateLimitConfig?: Partial<RateLimitConfig>;
}

export interface PresenceActivity {
  name: string;
  type: number; // 0=Playing, 1=Streaming, 2=Listening, 3=Watching, 5=Competing
  url?: string;
}

export interface PresenceData {
  status?: 'online' | 'idle' | 'dnd' | 'invisible';
  activities?: PresenceActivity[];
  since?: number | null;
  afk?: boolean;
}

export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  FAILED = 'failed',
}

export class GatewayClient extends EventEmitter {
  private ws?: WebSocket;
  private heartbeat?: Heartbeat;
  private sequence: number | null = null;
  private sessionId?: string;
  private resumeUrl?: string;
  private reconnectAttempts = 0;
  private connectionState = ConnectionState.DISCONNECTED;
  private connectionTimeout?: NodeJS.Timeout;
  private connectionManager = new ConnectionManager();
  private healthMonitor = new ConnectionHealthMonitor();
  private rateLimiter: GatewayRateLimiter;

  constructor(private options: GatewayOptions) {
    super();
    this.validateToken(options.token);
    this.options.intents ??=
      INTENTS.GUILDS |
      INTENTS.GUILD_MEMBERS |
      INTENTS.GUILD_MESSAGES |
      INTENTS.GUILD_VOICE_STATES |
      INTENTS.MESSAGE_CONTENT;
    this.options.maxReconnects ??= 5;
    this.options.connectionTimeout ??= TIMEOUTS.CONNECTION;
    this.rateLimiter = new GatewayRateLimiter(this.options.rateLimitConfig);
  }

  private validateToken(token: string) {
    if (!token || typeof token !== 'string') {
      throw new Error('Discord token is required and must be a string');
    }

    if (token === 'your_discord_token_here' || token === 'YOUR_BOT_TOKEN') {
      throw new Error('Please provide a valid Discord bot token');
    }

    const tokenRegex = /^[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27,}$/;
    if (!tokenRegex.test(token)) {
      throw new Error(
        'Invalid Discord token format. Expected format: MTxxxxx.xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxx'
      );
    }
  }

  connect() {
    if (
      this.connectionState === ConnectionState.CONNECTING ||
      this.connectionState === ConnectionState.CONNECTED
    ) {
      return;
    }

    this.connectionState = ConnectionState.CONNECTING;
    this.emit('stateChange', this.connectionState);

    const url = this.resumeUrl || GATEWAY_URL;
    this.ws = new WebSocket(url);

    this.connectionTimeout = setTimeout(() => {
      if (this.connectionState === ConnectionState.CONNECTING) {
        this.ws?.close(1000, 'Connection timeout');
        this.handleConnectionFailure();
      }
    }, this.options.connectionTimeout);

    this.ws.on('open', () => this.onOpen());
    this.ws.on('message', (data: unknown) => this.onMessage(data));
    this.ws.on('close', (code: number, reason: Buffer) => this.onClose(code, reason));
    this.ws.on('error', (error: Error) => this.onError(error));
  }

  private onOpen() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = undefined;
    }

    this.connectionState = ConnectionState.CONNECTED;
    this.connectionManager.onConnected();
    this.emit('stateChange', this.connectionState);
    this.emit('connected');
  }

  private onError(error: Error) {
    this.connectionManager.onError();
    this.emit('error', error);
    this.handleConnectionFailure();
  }

  private handleConnectionFailure() {
    this.connectionState = ConnectionState.FAILED;
    this.emit('stateChange', this.connectionState);

    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = undefined;
    }
  }

  private onMessage(data: unknown) {
    try {
      console.log(data as { toString(): string });
      const rawData = data as { toString(): string };
      const payload: APIGatewayPayload = JSON.parse(rawData.toString());
      if (!this.isValidPayload(payload)) {
        this.emit('error', new Error('Invalid payload received from gateway'));
        return;
      }

      if (payload.s !== null && payload.s !== undefined) {
        this.sequence = payload.s;
      }

      switch (payload.op) {
        case OPCODES.HELLO:
          this.handleHello(payload.d as { heartbeat_interval: number });
          break;
        case OPCODES.HEARTBEAT_ACK:
          this.heartbeat?.ack();
          break;
        case OPCODES.RECONNECT:
          this.handleReconnect();
          break;
        case OPCODES.INVALID_SESSION:
          this.handleInvalidSession(payload.d as boolean);
          break;
        case OPCODES.DISPATCH:
          this.handleDispatch(payload);
          break;
        case OPCODES.HEARTBEAT:
          this.sendHeartbeat();
          break;
        default:
          this.emit('error', new Error(`Unknown opcode received: ${payload.op}`));
      }
    } catch (error) {
      this.emit('error', new Error(`Failed to parse gateway message: ${error}`));
    }
  }

  private isValidPayload(payload: unknown): payload is APIGatewayPayload {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      'op' in payload &&
      typeof (payload as { op: unknown }).op === 'number'
    );
  }

  private handleHello(data: { heartbeat_interval: number }) {
    if (!data.heartbeat_interval || typeof data.heartbeat_interval !== 'number') {
      this.emit('error', new Error('Invalid heartbeat interval in HELLO payload'));
      return;
    }

    this.startHeartbeat(data.heartbeat_interval);
    this.identify();
  }

  private handleReconnect() {
    this.connectionState = ConnectionState.RECONNECTING;
    this.emit('stateChange', this.connectionState);
    this.reconnect();
  }

  private handleInvalidSession(canResume: boolean) {
    if (!canResume) {
      this.sessionId = undefined;
      this.resumeUrl = undefined;
      this.sequence = null;
    }

    setTimeout(() => this.identify(), Math.random() * 5000 + 1000);
  }

  private sendHeartbeat() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(
      JSON.stringify({
        op: OPCODES.HEARTBEAT,
        d: this.sequence,
      })
    );
  }

  private onClose(code: number, reason: unknown) {
    this.heartbeat?.stop();
    this.connectionState = ConnectionState.DISCONNECTED;
    this.connectionManager.onDisconnected();
    this.emit('stateChange', this.connectionState);

    const reasonStr = reason ? reason.toString() : '';
    const message = getCloseCodeMessage(code);

    this.emit('disconnected', { code, reason: reasonStr, message });

    if (isFatalCloseCode(code)) {
      this.connectionState = ConnectionState.FAILED;
      this.emit('stateChange', this.connectionState);
      this.emit('error', new Error(`Fatal gateway error (${code}): ${message} - ${reasonStr}`));
      return;
    }

    if (code === CLOSE_CODES.RATE_LIMITED) {
      setTimeout(() => this.reconnect(), TIMEOUTS.RATE_LIMIT_DELAY);
      return;
    }

    if (code === CLOSE_CODES.SESSION_TIMED_OUT || !isResumableCloseCode(code)) {
      this.sessionId = undefined;
      this.resumeUrl = undefined;
      this.sequence = null;
    }

    this.reconnect();
  }

  private startHeartbeat(interval: number) {
    this.heartbeat?.stop();
    this.heartbeat = new Heartbeat(
      this.ws as WebSocket,
      interval,
      () => this.sequence,
      () => this.handleHeartbeatTimeout()
    );
    this.heartbeat.start();
  }

  private handleHeartbeatTimeout() {
    this.emit('heartbeatTimeout');
    this.reconnect();
  }

  private identify() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.emit('error', new Error('Cannot identify: WebSocket not open'));
      return;
    }

    if (!this.options.token) {
      this.emit('error', new Error('Cannot identify: No token provided'));
      return;
    }

    if (!this.rateLimiter.canIdentify()) {
      this.emit('error', new Error('Cannot identify: Rate limited'));
      return;
    }

    // Re-validate token format before sending
    try {
      this.validateToken(this.options.token);
    } catch (error) {
      this.emit('error', error);
      return;
    }

    try {
      const payload =
        this.sessionId && this.resumeUrl
          ? {
              op: OPCODES.RESUME,
              d: {
                token: this.options.token,
                session_id: this.sessionId,
                seq: this.sequence,
              },
            }
          : {
              op: OPCODES.IDENTIFY,
              d: {
                token: this.options.token,
                intents: this.options.intents,
                properties: {
                  os: process.platform || 'linux',
                  browser: 'discord-stats-lib',
                  device: 'discord-stats-lib',
                },
                compress: false,
                large_threshold: 50,
              },
            };

      this.ws.send(JSON.stringify(payload));

      if (!this.sessionId) {
        this.rateLimiter.recordIdentify();
      }

      if (this.sessionId) {
        this.emit('resuming');
      } else {
        this.emit('identifying');
      }
    } catch (error) {
      this.emit('error', new Error(`Failed to send identify payload: ${error}`));
    }
  }

  private handleDispatch(payload: APIGatewayPayload) {
    if (!payload.t) {
      this.emit('error', new Error('Dispatch event missing event type'));
      return;
    }

    try {
      switch (payload.t) {
        case 'READY':
          this.handleReady(payload.d as Record<string, unknown>);
          break;
        case 'RESUMED':
          this.handleResumed();
          break;
        default:
          break;
      }

      this.emit('dispatch', payload.t, payload.d);
    } catch (error) {
      this.emit('error', new Error(`Failed to handle dispatch event ${payload.t}: ${error}`));
    }
  }

  private handleReady(data: Record<string, unknown>) {
    if (!data.session_id || typeof data.session_id !== 'string') {
      this.emit('error', new Error('READY event missing session_id'));
      return;
    }

    this.sessionId = data.session_id;
    this.resumeUrl = data.resume_gateway_url as string;
    this.reconnectAttempts = 0;

    this.emit('ready', data);
  }

  private handleResumed() {
    this.reconnectAttempts = 0;
    this.emit('resumed');
  }

  private reconnect() {
    if (this.connectionState === ConnectionState.FAILED) {
      return;
    }

    if (this.reconnectAttempts >= (this.options.maxReconnects || 5)) {
      this.connectionState = ConnectionState.FAILED;
      this.emit('stateChange', this.connectionState);
      this.emit('error', new Error('Max reconnect attempts reached'));
      return;
    }

    this.reconnectAttempts++;
    this.connectionState = ConnectionState.RECONNECTING;
    this.connectionManager.onReconnecting();
    this.emit('stateChange', this.connectionState);

    const delay = calculateBackoff(this.reconnectAttempts);
    this.emit('reconnecting', { attempt: this.reconnectAttempts, delay });

    setTimeout(() => {
      if (this.connectionState === ConnectionState.RECONNECTING) {
        this.connect();
      }
    }, delay);
  }

  disconnect() {
    this.connectionState = ConnectionState.DISCONNECTED;
    this.emit('stateChange', this.connectionState);

    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = undefined;
    }

    this.heartbeat?.stop();
    this.rateLimiter.destroy();
    this.ws?.close(1000, 'Client disconnect');
    this.ws = undefined;
  }

  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  isConnected(): boolean {
    return (
      this.connectionState === ConnectionState.CONNECTED && this.ws?.readyState === WebSocket.OPEN
    );
  }

  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      sequence: this.sequence,
      resumeUrl: this.resumeUrl,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  getConnectionStats() {
    return this.connectionManager.getStats();
  }

  getConnectionHealth() {
    const stats = this.connectionManager.getStats();
    return this.healthMonitor.checkHealth(stats, this.connectionState);
  }

  resetConnectionStats() {
    this.connectionManager.reset();
  }

  getRateLimitStatus() {
    return this.rateLimiter.getStatus();
  }

  resetRateLimits() {
    this.rateLimiter.reset();
  }

  updatePresence(presence: PresenceData): void {
    if (!this.isConnected()) {
      throw new Error('Cannot update presence: not connected to gateway');
    }

    if (!this.rateLimiter.canUpdatePresence()) {
      throw new Error('Rate limited: cannot update presence at this time');
    }

    const payload = {
      op: OPCODES.PRESENCE_UPDATE,
      d: {
        since: presence.since || null,
        activities: presence.activities || [],
        status: presence.status || 'online',
        afk: presence.afk || false,
      },
    };

    try {
      this.ws?.send(JSON.stringify(payload));
      this.rateLimiter.recordPresenceUpdate();
    } catch (error) {
      throw new Error(`Failed to send presence update: ${error}`);
    }
  }

  setStatus(status: 'online' | 'idle' | 'dnd' | 'invisible'): void {
    this.updatePresence({ status });
  }

  setActivity(name: string, type: number = 0, url?: string): void {
    this.updatePresence({
      activities: [{ name, type, url }],
    });
  }

  clearActivity(): void {
    this.updatePresence({
      activities: [],
    });
  }
}
