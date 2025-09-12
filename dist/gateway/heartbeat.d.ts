import type { WebSocket } from 'ws';
export declare class Heartbeat {
    private ws;
    private intervalMs;
    private sequence;
    private interval?;
    private lastAck;
    constructor(ws: WebSocket, intervalMs: number, sequence: () => number | null);
    start(): void;
    ack(): void;
    stop(): void;
}
