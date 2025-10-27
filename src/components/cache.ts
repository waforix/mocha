import { CacheEvictionError, CacheSerializationError } from '../errors/cache';
import type { CacheConfig } from '../validation';
import { BaseComponent } from './base';

/**
 * LRU Cache implementation
 * @category Components
 */
export class CacheComponent extends BaseComponent {
  private cache: Map<string, { value: unknown; timestamp: number }> = new Map();
  private config: CacheConfig;
  private cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Create a new cache component
   * @param config - Cache configuration
   */
  constructor(config: CacheConfig) {
    super();
    this.config = config;
  }

  /**
   * Initialize the cache component
   */
  async initialize(): Promise<void> {
    // Start cleanup interval
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.config.ttlMs);

    await super.initialize();
  }

  /**
   * Destroy the cache component
   */
  async destroy(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
    await super.destroy();
  }

  /**
   * Get a value from cache
   * @param key - Cache key
   * @returns Cached value or undefined
   */
  get<T = unknown>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // Check if expired
    if (Date.now() - entry.timestamp > this.config.ttlMs) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  /**
   * Set a value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @throws CacheSerializationError if value cannot be serialized
   */
  set(key: string, value: unknown): void {
    try {
      // Verify value is serializable
      JSON.stringify(value);

      // Evict if cache is full and key doesn't already exist
      if (!this.cache.has(key) && this.cache.size >= this.config.userStatsSize) {
        this.evict();
      }

      this.cache.set(key, {
        value,
        timestamp: Date.now(),
      });

      this.emit('set', { key, size: this.cache.size });
    } catch (error) {
      throw new CacheSerializationError(
        `Failed to serialize value for key: ${key}`,
        { key },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Delete a value from cache
   * @param key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
    this.emit('delete', { key, size: this.cache.size });
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.emit('clear');
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if key exists
   * @param key - Cache key
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Evict oldest entry (LRU)
   * @throws CacheEvictionError if eviction fails
   */
  private evict(): void {
    try {
      let oldestKey: string | null = null;
      let oldestTime = Number.MAX_SAFE_INTEGER;

      for (const [key, entry] of this.cache.entries()) {
        if (entry.timestamp < oldestTime) {
          oldestTime = entry.timestamp;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.emit('evict', { key: oldestKey, size: this.cache.size });
      }
    } catch (error) {
      throw new CacheEvictionError(
        'Failed to evict cache entry',
        {},
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttlMs) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.emit('cleanup', { cleaned, size: this.cache.size });
    }
  }
}
