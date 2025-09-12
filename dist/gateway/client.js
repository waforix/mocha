import { EventEmitter } from 'node:events';
import { WebSocket } from 'ws';
import { calculateBackoff } from '../utils/backoff';
import { GATEWAY_URL, INTENTS, OPCODES } from './constants';
import { isFatalCloseCode } from './errors';
import { Heartbeat } from './heartbeat';
export class GatewayClient extends EventEmitter {
    options;
    ws;
    heartbeat;
    sequence = null;
    sessionId;
    resumeUrl;
    reconnectAttempts = 0;
    constructor(options) {
        super();
        this.options = options;
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
    onOpen() {
        this.emit('connected');
    }
    onMessage(data) {
        const payload = JSON.parse(data.toString());
        if (payload.s)
            this.sequence = payload.s;
        switch (payload.op) {
            case OPCODES.HELLO:
                this.startHeartbeat(payload.d.heartbeat_interval);
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
    onClose(code, reason) {
        this.heartbeat?.stop();
        if (isFatalCloseCode(code)) {
            this.emit('error', new Error(`Fatal gateway error: ${code} ${reason.toString()}`));
            return;
        }
        this.reconnect();
    }
    startHeartbeat(interval) {
        this.heartbeat?.stop();
        this.heartbeat = new Heartbeat(this.ws, interval, () => this.sequence);
        this.heartbeat.start();
    }
    identify() {
        if (!this.ws)
            return;
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
    handleDispatch(payload) {
        if (payload.t === 'READY') {
            const readyData = payload.d;
            this.sessionId = readyData.session_id;
            this.resumeUrl = readyData.resume_gateway_url;
            this.reconnectAttempts = 0;
        }
        this.emit('dispatch', payload.t, payload.d);
    }
    reconnect() {
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
