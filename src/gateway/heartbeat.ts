import { WebSocket } from 'ws';
import { HEARTBEAT } from '../lib/constants';
import { OPCODES } from './constants';

export class Heartbeat {
  private interval?: NodeJS.Timeout;
  private lastAck = true;
  private lastSent = 0;
  private missedAcks = 0;
  private readonly maxMissedAcks = HEARTBEAT.MAX_MISSED_ACKS;

  constructor(
    private ws: WebSocket,
    private intervalMs: number,
    private sequence: () => number | null,
    private onTimeout?: () => void
  ) {}

  start() {
    if (this.interval) {
      this.stop();
    }

    this.lastAck = true;
    this.missedAcks = 0;

    this.interval = setInterval(() => {
      this.sendHeartbeat();
    }, this.intervalMs);

    this.sendHeartbeat();
  }

  private sendHeartbeat() {
    if (this.ws.readyState !== WebSocket.OPEN) {
      this.stop();
      return;
    }

    if (!this.lastAck) {
      this.missedAcks++;

      if (this.missedAcks >= this.maxMissedAcks) {
        this.ws.close(HEARTBEAT.TIMEOUT_CODE, 'Heartbeat timeout - too many missed ACKs');
        this.onTimeout?.();
        return;
      }
    }

    try {
      this.lastAck = false;
      this.lastSent = Date.now();

      this.ws.send(
        JSON.stringify({
          op: OPCODES.HEARTBEAT,
          d: this.sequence(),
        })
      );
    } catch (_error) {
      this.stop();
      this.onTimeout?.();
    }
  }

  ack() {
    this.lastAck = true;
    this.missedAcks = 0;
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  getStats() {
    return {
      lastSent: this.lastSent,
      lastAck: this.lastAck,
      missedAcks: this.missedAcks,
      intervalMs: this.intervalMs,
    };
  }
}
