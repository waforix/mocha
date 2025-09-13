export interface RateLimitConfig {
  requests: number;
  window: number;
  burst?: number;
}

export class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private capacity: number,
    private refillRate: number,
    private refillInterval: number
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  consume(tokens = 1): boolean {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }

  getTokens(): number {
    this.refill();
    return this.tokens;
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;

    if (timePassed >= this.refillInterval) {
      const tokensToAdd = Math.floor(timePassed / this.refillInterval) * this.refillRate;
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }
}

export class SlidingWindow {
  private requests: number[] = [];

  constructor(
    private limit: number,
    private window: number
  ) {}

  isAllowed(): boolean {
    const now = Date.now();
    const cutoff = now - this.window;

    this.requests = this.requests.filter((time) => time > cutoff);

    if (this.requests.length < this.limit) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  getCount(): number {
    const now = Date.now();
    const cutoff = now - this.window;
    this.requests = this.requests.filter((time) => time > cutoff);
    return this.requests.length;
  }

  reset(): void {
    this.requests = [];
  }
}
