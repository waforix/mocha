import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CacheComponent } from '../../../src/components/cache';
import { createTestCache, wait } from '../../utils/test-helpers';

describe('CacheComponent', () => {
  let cache: CacheComponent;

  beforeEach(async () => {
    cache = createTestCache({ ttlMs: 100 });
    await cache.initialize();
  });

  afterEach(async () => {
    await cache.destroy();
  });

  describe('initialization', () => {
    it('should initialize successfully', () => {
      expect(cache.isInitialized()).toBe(true);
    });

    it('should emit initialized event', async () => {
      const newCache = createTestCache();
      let emitted = false;
      newCache.on('initialized', () => {
        emitted = true;
      });
      await newCache.initialize();
      expect(emitted).toBe(true);
      await newCache.destroy();
    });
  });

  describe('set and get', () => {
    it('should set and get a value', () => {
      cache.set('key1', { data: 'value1' });
      const result = cache.get('key1');
      expect(result).toEqual({ data: 'value1' });
    });

    it('should return undefined for non-existent key', () => {
      const result = cache.get('non-existent');
      expect(result).toBeUndefined();
    });

    it('should return undefined for expired value', async () => {
      cache.set('key1', { data: 'value1' });
      await wait(150);
      const result = cache.get('key1');
      expect(result).toBeUndefined();
    });

    it('should support generic types', () => {
      interface TestData {
        id: number;
        name: string;
      }
      const data: TestData = { id: 1, name: 'test' };
      cache.set('typed', data);
      const result = cache.get<TestData>('typed');
      expect(result).toEqual(data);
    });
  });

  describe('delete', () => {
    it('should delete a value', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      cache.delete('key1');
      expect(cache.has('key1')).toBe(false);
    });

    it('should emit delete event', async () => {
      cache.set('key1', 'value1');
      let emitted = false;
      cache.on('delete', () => {
        emitted = true;
      });
      cache.delete('key1');
      expect(emitted).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all values', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      expect(cache.size()).toBe(2);
      cache.clear();
      expect(cache.size()).toBe(0);
    });

    it('should emit clear event', async () => {
      cache.set('key1', 'value1');
      let emitted = false;
      cache.on('clear', () => {
        emitted = true;
      });
      cache.clear();
      expect(emitted).toBe(true);
    });
  });

  describe('size and keys', () => {
    it('should return correct size', () => {
      expect(cache.size()).toBe(0);
      cache.set('key1', 'value1');
      expect(cache.size()).toBe(1);
      cache.set('key2', 'value2');
      expect(cache.size()).toBe(2);
    });

    it('should return all keys', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      const keys = cache.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys.length).toBe(2);
    });
  });

  describe('has', () => {
    it('should check if key exists', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
    });
  });

  describe('eviction', () => {
    it('should evict oldest entry when cache is full', () => {
      const smallCache = createTestCache({ userStatsSize: 2, ttlMs: 10000 });
      smallCache.set('key1', 'value1');
      smallCache.set('key2', 'value2');
      expect(smallCache.size()).toBe(2);

      // Adding a third entry should evict the oldest
      smallCache.set('key3', 'value3');
      expect(smallCache.size()).toBe(2);
      expect(smallCache.has('key1')).toBe(false);
      expect(smallCache.has('key2')).toBe(true);
      expect(smallCache.has('key3')).toBe(true);
    });

    it('should emit evict event', async () => {
      const smallCache = createTestCache({ userStatsSize: 1, ttlMs: 10000 });
      smallCache.set('key1', 'value1');
      let emitted = false;
      smallCache.on('evict', () => {
        emitted = true;
      });
      smallCache.set('key2', 'value2');
      expect(emitted).toBe(true);
    });
  });

  describe('serialization', () => {
    it('should throw error for non-serializable values', () => {
      const circular: any = { a: 1 };
      circular.self = circular;
      expect(() => {
        cache.set('circular', circular);
      }).toThrow();
    });
  });
});

