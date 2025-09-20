import { afterEach, beforeEach } from 'bun:test';
import { DatabaseManager } from '../../db/manager';
import type { DatabaseConfig } from '../../db/types';

export const testDbConfig: DatabaseConfig = {
  type: 'sqlite',
  path: ':memory:',
};

export class TestDatabaseManager {
  private manager = new DatabaseManager();

  async setup() {
    return await this.manager.initialize(testDbConfig);
  }

  async cleanup() {
    await this.manager.close();
  }

  getInstance() {
    return this.manager.getInstance();
  }
}

export const setupTestDb = () => {
  const dbManager = new TestDatabaseManager();

  beforeEach(async () => {
    await dbManager.setup();
  });

  afterEach(async () => {
    await dbManager.cleanup();
  });

  return dbManager;
};
