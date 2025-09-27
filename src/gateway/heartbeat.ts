import { WebSocket } from 'ws';
import { OpCode, WebSocketCloseCode } from '../enums/gateway';

const MAX_MISSED_ACKS = 3;

export class Heartbeat {
  private interval?: NodeJS.Timeout;
  private intervalMs: number;
  private lastAck: boolean;
  private lastSent: number;
  private missed: number;
  private sequence: () => number | null;
  private timeout: () => void;
  private webSocket: WebSocket;

  public constructor(
    webSocket: WebSocket,
    intervalMs: number,
    sequence: () => number | null,
    timeout: () => void
  ) {
    this.lastAck = false;
    this.lastSent = 0;
    this.intervalMs = intervalMs;
    this.missed = 0;
    this.sequence = sequence;
    this.timeout = timeout;
    this.webSocket = webSocket;
  }

  public sendHeartbeat() {
    if (this.webSocket.readyState !== WebSocket.OPEN) {
      this.stop();
      return;
    }
    if (!this.lastAck) {
      this.missed++;
      if (this.missed >= MAX_MISSED_ACKS) {
        this.webSocket.close(
          WebSocketCloseCode.TIMEOUT,
          'Heartbeat timed out: too many missed ACKs.'
        );
        this.timeout();
        return;
      }
    }
    try {
      this.lastAck = false;
      this.lastSent = Date.now();
      this.webSocket.send(
        JSON.stringify({
          op: OpCode.HEARTBEAT,
          d: this.sequence(),
        })
      );
    } catch (error) {
      console.log(`Error: ${error}`);
      this.stop();
      this.timeout();
    }
  }

  public start(): void {
    if (this.interval) {
      this.stop();
    }
    this.lastAck = true;
    this.missed = 0;
    this.interval = setInterval(() => {
      this.sendHeartbeat();
    }, this.intervalMs);
    this.sendHeartbeat();
  }

  public ack(): void {
    this.lastAck = true;
    this.missed = 0;
  }

  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  public getStats() {
    return {
      intervalMs: this.intervalMs,
      lastAck: this.lastAck,
      lastSent: this.lastSent,
      missed: this.missed,
    };
  }
}
