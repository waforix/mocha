import { OPCODES } from './constants';
export class Heartbeat {
    ws;
    intervalMs;
    sequence;
    interval;
    lastAck = true;
    constructor(ws, intervalMs, sequence) {
        this.ws = ws;
        this.intervalMs = intervalMs;
        this.sequence = sequence;
    }
    start() {
        this.interval = setInterval(() => {
            if (!this.lastAck) {
                this.ws.close(4000, 'Heartbeat timeout');
                return;
            }
            this.lastAck = false;
            this.ws.send(JSON.stringify({
                op: OPCODES.HEARTBEAT,
                d: this.sequence(),
            }));
        }, this.intervalMs);
    }
    ack() {
        this.lastAck = true;
    }
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
}
