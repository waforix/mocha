import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { LRUCache } from '../../cache/lru';

describe('LRUCache', () => {
  let cache: LRUCache<string>;

  beforeEach(() => {
    cache = new LRUCache<string>(3, 1000);
  });

  afterEach(() => {
    cache.destroy();
  });

  describe('basic operations', () => {
    it('stores and retrieves values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('returns undefined for missing keys', () => {
      expect(cache.get('missing')).toBeUndefined();
    });

    it('updates existing keys', () => {
      cache.set('key1', 'value1');
      cache.set('key1', 'value2');
      expect(cache.get('key1')).toBe('value2');
    });
  });

  describe('LRU eviction', () => {
    it('evicts least recently used items when full', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4');

      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });

    it('updates access order on get', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      cache.get('key1');
      cache.set('key4', 'value4');

      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBeUndefined();
    });
  });

  describe('TTL expiration', () => {
    it('expires items after TTL', async () => {
      const shortCache = new LRUCache<string>(3, 100);
      shortCache.set('key1', 'value1');

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(shortCache.get('key1')).toBeUndefined();
      shortCache.destroy();
    });

    it('does not expire items within TTL', async () => {
      cache.set('key1', 'value1');

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(cache.get('key1')).toBe('value1');
    });
  });

  describe('utility methods', () => {
    it('reports correct size', () => {
      expect(cache.size).toBe(0);
      cache.set('key1', 'value1');
      expect(cache.size).toBe(1);
      cache.set('key2', 'value2');
      expect(cache.size).toBe(2);
    });

    it('returns all keys', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      const keys = cache.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys.length).toBe(2);
    });

    it('clears all items', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      cache.clear();

      expect(cache.size).toBe(0);
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBeUndefined();
    });
  });

  describe('cleanup', () => {
    it('cleans up expired items automatically', async () => {
      const shortCache = new LRUCache<string>(3, 100);
      shortCache.set('key1', 'value1');
      shortCache.set('key2', 'value2');

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(shortCache.size).toBe(0);
      shortCache.destroy();
    });

    it('destroys properly', () => {
      cache.set('key1', 'value1');
      cache.destroy();

      expect(cache.size).toBe(0);
      expect(cache.get('key1')).toBeUndefined();
    });
  });
});
