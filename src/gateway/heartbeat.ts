import type { WebSocket } from 'ws';
import { OPCODES } from './constants';

export class Heartbeat {
  private interval?: NodeJS.Timeout;
  private lastAck = true;

  constructor(
    private ws: WebSocket,
    private intervalMs: number,
    private sequence: () => number | null
  ) {}

  start() {
    this.interval = setInterval(() => {
      if (!this.lastAck) {
        this.ws.close(4000, 'Heartbeat timeout');
        return;
      }

      this.lastAck = false;
      this.ws.send(
        JSON.stringify({
          op: OPCODES.HEARTBEAT,
          d: this.sequence(),
        })
      );
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
