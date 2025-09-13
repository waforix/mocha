import { type RateLimitConfig, SlidingWindow, TokenBucket } from './bucket';

export class RateLimitManager {
  private buckets = new Map<string, TokenBucket>();
  private windows = new Map<string, SlidingWindow>();
  private configs = new Map<string, RateLimitConfig>();

  setLimit(key: string, config: RateLimitConfig): void {
    this.configs.set(key, config);

    if (config.burst) {
      this.buckets.set(key, new TokenBucket(config.burst, config.requests, config.window));
    } else {
      this.windows.set(key, new SlidingWindow(config.requests, config.window));
    }
  }

  isAllowed(key: string, tokens = 1): boolean {
    const bucket = this.buckets.get(key);
    if (bucket) {
      return bucket.consume(tokens);
    }

    const window = this.windows.get(key);
    if (window) {
      return window.isAllowed();
    }

    return true;
  }

  getRemaining(key: string): number {
    const config = this.configs.get(key);
    if (!config) return Infinity;

    const bucket = this.buckets.get(key);
    if (bucket) {
      return bucket.getTokens();
    }

    const window = this.windows.get(key);
    if (window) {
      return Math.max(0, config.requests - window.getCount());
    }

    return config.requests;
  }

  reset(key: string): void {
    const bucket = this.buckets.get(key);
    if (bucket) {
      this.buckets.delete(key);
    }

    const window = this.windows.get(key);
    if (window) {
      window.reset();
    }
  }

  cleanup(): void {
    const _now = Date.now();

    for (const [key, _config] of this.configs.entries()) {
      const window = this.windows.get(key);
      if (window && window.getCount() === 0) {
        this.windows.delete(key);
        this.configs.delete(key);
      }
    }
  }
}
