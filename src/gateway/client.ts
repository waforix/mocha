import { EventEmitter } from 'node:events';
import { WebSocket } from 'ws';
import type { APIGatewayPayload } from '../types/index';
import { calculateBackoff } from '../utils/backoff';
import { GATEWAY_URL, INTENTS, OPCODES } from './constants';
import { isFatalCloseCode } from './errors';
import { Heartbeat } from './heartbeat';

export interface GatewayOptions {
  token: string;
  intents?: number;
  maxReconnects?: number;
}

export class GatewayClient extends EventEmitter {
  private ws?: WebSocket;
  private heartbeat?: Heartbeat;
  private sequence: number | null = null;
  private sessionId?: string;
  private resumeUrl?: string;
  private reconnectAttempts = 0;

  constructor(private options: GatewayOptions) {
    super();
    this.options.intents ??=
      INTENTS.GUILDS | INTENTS.GUILD_MEMBERS | INTENTS.GUILD_MESSAGES | INTENTS.GUILD_VOICE_STATES;
    this.options.maxReconnects ??= 5;
  }

  connect() {
    const url = this.resumeUrl || GATEWAY_URL;
    this.ws = new WebSocket(url);

    this.ws.on('open', () => this.onOpen());
    this.ws.on('message', (data) => this.onMessage(data));
    this.ws.on('close', (code, reason) => this.onClose(code, reason));
    this.ws.on('error', (error) => this.emit('error', error));
  }

  private onOpen() {
    this.emit('connected');
  }

  private onMessage(data: unknown) {
    const payload: APIGatewayPayload = JSON.parse((data as Buffer).toString());

    if (payload.s) this.sequence = payload.s;

    switch (payload.op) {
      case OPCODES.HELLO:
        this.startHeartbeat((payload.d as Record<string, unknown>).heartbeat_interval as number);
        this.identify();
        break;
      case OPCODES.HEARTBEAT_ACK:
        this.heartbeat?.ack();
        break;
      case OPCODES.RECONNECT:
        this.reconnect();
        break;
      case OPCODES.INVALID_SESSION:
        this.sessionId = undefined;
        this.resumeUrl = undefined;
        setTimeout(() => this.identify(), 5000);
        break;
      case OPCODES.DISPATCH:
        this.handleDispatch(payload);
        break;
    }
  }

  private onClose(code: number, reason: Buffer) {
    this.heartbeat?.stop();

    if (isFatalCloseCode(code)) {
      this.emit('error', new Error(`Fatal gateway error: ${code} ${reason.toString()}`));
      return;
    }

    this.reconnect();
  }

  private startHeartbeat(interval: number) {
    this.heartbeat?.stop();
    this.heartbeat = new Heartbeat(this.ws as WebSocket, interval, () => this.sequence);
    this.heartbeat.start();
  }

  private identify() {
    if (!this.ws) return;

    const payload = this.sessionId
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
              os: 'linux',
              browser: 'discord-stats-lib',
              device: 'discord-stats-lib',
            },
          },
        };

    this.ws.send(JSON.stringify(payload));
  }

  private handleDispatch(payload: APIGatewayPayload) {
    if (payload.t === 'READY') {
      const readyData = payload.d as Record<string, unknown>;
      this.sessionId = readyData.session_id as string;
      this.resumeUrl = readyData.resume_gateway_url as string;
      this.reconnectAttempts = 0;
    }

    this.emit('dispatch', payload.t, payload.d);
  }

  private reconnect() {
    if (this.reconnectAttempts >= (this.options.maxReconnects || 5)) {
      this.emit('error', new Error('Max reconnect attempts reached'));
      return;
    }

    this.reconnectAttempts++;
    const delay = calculateBackoff(this.reconnectAttempts);

    setTimeout(() => this.connect(), delay);
  }

  disconnect() {
    this.heartbeat?.stop();
    this.ws?.close(1000);
  }
}
