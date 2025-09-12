import { EventEmitter } from 'node:events';
export interface GatewayOptions {
    token: string;
    intents?: number;
    maxReconnects?: number;
}
export declare class GatewayClient extends EventEmitter {
    private options;
    private ws?;
    private heartbeat?;
    private sequence;
    private sessionId?;
    private resumeUrl?;
    private reconnectAttempts;
    constructor(options: GatewayOptions);
    connect(): void;
    private onOpen;
    private onMessage;
    private onClose;
    private startHeartbeat;
    private identify;
    private handleDispatch;
    private reconnect;
    disconnect(): void;
}
