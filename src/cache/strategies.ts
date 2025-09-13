export interface CacheStrategy {
  shouldCache(key: string, data: unknown): boolean;
  getTTL(key: string, data: unknown): number;
  getPriority(key: string, data: unknown): number;
}

export class AdaptiveCacheStrategy implements CacheStrategy {
  private accessCounts = new Map<string, number>();
  private lastAccess = new Map<string, number>();

  shouldCache(key: string, data: unknown): boolean {
    const accessCount = this.accessCounts.get(key) || 0;
    const dataSize = this.estimateSize(data);

    // Cache frequently accessed or small data
    return accessCount > 1 || dataSize < 1000;
  }

  getTTL(key: string, _data: unknown): number {
    const accessCount = this.accessCounts.get(key) || 0;
    const baseTime = 300000; // 5 minutes

    // More frequently accessed data gets longer TTL
    return Math.min(baseTime * (1 + accessCount * 0.5), 3600000); // Max 1 hour
  }

  getPriority(key: string, _data: unknown): number {
    const accessCount = this.accessCounts.get(key) || 0;
    const recency = Date.now() - (this.lastAccess.get(key) || 0);

    // Higher priority for frequently accessed, recently used data
    return accessCount * 10 - recency / 60000; // Decay over minutes
  }

  recordAccess(key: string): void {
    this.accessCounts.set(key, (this.accessCounts.get(key) || 0) + 1);
    this.lastAccess.set(key, Date.now());
  }

  private estimateSize(data: unknown): number {
    return JSON.stringify(data).length * 2; // Rough estimate
  }
}

export class TimeBasedCacheStrategy implements CacheStrategy {
  shouldCache(_key: string, _data: unknown): boolean {
    const hour = new Date().getHours();

    // Cache more aggressively during peak hours (9 AM - 9 PM)
    return hour >= 9 && hour <= 21;
  }

  getTTL(_key: string, _data: unknown): number {
    const hour = new Date().getHours();

    // Longer TTL during peak hours
    if (hour >= 9 && hour <= 21) {
      return 600000; // 10 minutes
    }
    return 300000; // 5 minutes
  }

  getPriority(_key: string, _data: unknown): number {
    const hour = new Date().getHours();

    // Higher priority during peak hours
    return hour >= 9 && hour <= 21 ? 10 : 5;
  }
}

export class SizeBasedCacheStrategy implements CacheStrategy {
  private maxSize: number;

  constructor(maxSize = 10000) {
    this.maxSize = maxSize;
  }

  shouldCache(_key: string, data: unknown): boolean {
    const size = this.estimateSize(data);
    return size <= this.maxSize;
  }

  getTTL(_key: string, data: unknown): number {
    const size = this.estimateSize(data);
    const baseTime = 300000;

    const sizeRatio = Math.min(size / this.maxSize, 1);
    return Math.max(baseTime * (2 - sizeRatio), 60000);
  }

  getPriority(_key: string, data: unknown): number {
    const size = this.estimateSize(data);

    return Math.max(100 - size / 100, 1);
  }

  private estimateSize(data: unknown): number {
    return JSON.stringify(data).length * 2;
  }
}
