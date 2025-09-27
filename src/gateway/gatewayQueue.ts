import { EventEmitter } from 'node:events';
import type { WebSocket } from 'ws';
import type { RateLimiter } from './rateLimiter';
import type { Payload } from './types/payload';

type Queued<T> = {
  data: T;
  priority: number;
  timestamp: number;
};

export class GatewayQueue extends EventEmitter {
  private maxQueueSize: number;
  private processing: boolean;
  private rateLimiter: RateLimiter;
  private queue: Queued<Payload>[];
  private webSocket: WebSocket;

  public constructor(rateLimiter: RateLimiter, webSocket: WebSocket) {
    super();
    this.maxQueueSize = 1_000;
    this.processing = false;
    this.rateLimiter = rateLimiter;
    this.queue = [];
    this.webSocket = webSocket;
  }

  public async enqueue(payload: Payload, priority: number): Promise<boolean> {
    if (this.queue.length >= this.maxQueueSize) {
      return false;
    }
    this.queue.push({
      data: payload,
      priority: priority,
      timestamp: Date.now(),
    });
    this.queue.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);
    if (!this.processing) {
      this.processQueue();
    }
    return true;
  }

  private async processQueue(): Promise<void> {
    this.processing = true;
    while (this.queue.length > 0) {
      while (this.rateLimiter.isRateLimited(this.queue[0].data.op)) {
        await new Promise((resolve) => setTimeout(resolve, 60_000));
      }
      const queued = this.queue.shift();
      if (queued) {
        this.sendMessage(queued.data);
        this.rateLimiter.handleOp(queued.data.op);
      }
    }
    this.processing = false;
  }

  private sendMessage(message: Payload): void {
    if (!this.webSocket.OPEN) {
      this.emit('error', new Error('Unable to send message. The websocket is closed.'));
      return;
    }
    this.webSocket.send(JSON.stringify(message));
  }
}
