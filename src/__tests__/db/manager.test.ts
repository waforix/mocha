import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { DatabaseManager } from '../../db/manager';
import type { DatabaseConfig } from '../../db/types';

describe('DatabaseManager', () => {
  let manager: DatabaseManager;
  const testConfig: DatabaseConfig = {
    type: 'sqlite',
    path: ':memory:',
  };

  beforeEach(() => {
    manager = new DatabaseManager();
  });

  afterEach(async () => {
    await manager.close();
  });

  describe('initialization', () => {
    it('initializes database connection', async () => {
      const instance = await manager.initialize(testConfig);

      expect(instance).toBeDefined();
      expect(instance.type).toBe('sqlite');
      expect(instance.db).toBeDefined();
    });

    it('returns same instance on multiple initializations with same config', async () => {
      const instance1 = await manager.initialize(testConfig);
      const instance2 = await manager.initialize(testConfig);

      expect(instance1).toBe(instance2);
    });

    it('creates new instance with different config', async () => {
      const instance1 = await manager.initialize(testConfig);
      const newConfig: DatabaseConfig = {
        type: 'sqlite',
        path: ':memory:',
      };
      const instance2 = await manager.initialize(newConfig);

      expect(instance1).not.toBe(instance2);
    });
  });

  describe('getInstance', () => {
    it('returns initialized instance', async () => {
      const initialized = await manager.initialize(testConfig);
      const retrieved = manager.getInstance();

      expect(retrieved).toBe(initialized);
    });

    it('throws error when not initialized', () => {
      expect(() => manager.getInstance()).toThrow(
        'Database not initialized. Call initialize() first.'
      );
    });
  });

  describe('close', () => {
    it('closes database connection', async () => {
      await manager.initialize(testConfig);
      await manager.close();

      expect(() => manager.getInstance()).toThrow(
        'Database not initialized. Call initialize() first.'
      );
    });

    it('handles multiple close calls gracefully', async () => {
      await manager.initialize(testConfig);
      await manager.close();
      await manager.close();

      expect(() => manager.getInstance()).toThrow(
        'Database not initialized. Call initialize() first.'
      );
    });

    it('handles close without initialization', async () => {
      await expect(manager.close()).resolves.not.toThrow();
    });
  });

  describe('config comparison', () => {
    it('detects same SQLite config', async () => {
      const config1: DatabaseConfig = { type: 'sqlite', path: './test.db' };
      const config2: DatabaseConfig = { type: 'sqlite', path: './test.db' };

      const instance1 = await manager.initialize(config1);
      const instance2 = await manager.initialize(config2);

      expect(instance1).toBe(instance2);
    });

    it('detects different SQLite paths', async () => {
      const config1: DatabaseConfig = { type: 'sqlite', path: './test1.db' };
      await manager.initialize(config1);

      const config2: DatabaseConfig = { type: 'sqlite', path: './test2.db' };
      const instance2 = await manager.initialize(config2);

      expect(instance2.type).toBe('sqlite');
    });
  });
});
