import { CACHE_DEFAULTS } from '../lib/constants';
import { LRUCache } from './lru';
import type { CacheConfig, CacheStats } from './types';

/**
 * Cache manager for storing and retrieving cached data
 * Uses LRU (Least Recently Used) eviction strategy
 */
export class CacheManager {
  private queryCache: LRUCache<unknown>;

  constructor(config: CacheConfig = {}) {
    const { ttlMs = CACHE_DEFAULTS.TTL_MS } = config;
    this.queryCache = new LRUCache(CACHE_DEFAULTS.QUERY_SIZE, ttlMs);
  }

  /**
   * Get a cached value by key
   */
  getQuery<T>(key: string): T | undefined {
    return this.queryCache.get(key) as T | undefined;
  }

  /**
   * Set a cached value by key
   */
  setQuery<T>(key: string, data: T): void {
    this.queryCache.set(key, data);
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.queryCache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return {
      queries: this.queryCache.size,
    };
  }
}
