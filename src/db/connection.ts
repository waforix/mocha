import { createDatabaseConnection, type DatabaseInstance } from './factory';
import * as schema from './schema/index';
import type { DatabaseConfig } from './types';

let db: DatabaseInstance;

export const getDb = async (
  config: DatabaseConfig = { type: 'sqlite', path: './data/stats.db' }
): Promise<DatabaseInstance> => {
  if (!db) {
    db = await createDatabaseConnection(config);
  }
  return db;
};

export const getDbSync = (): DatabaseInstance => {
  if (!db) {
    throw new Error('Database not initialized. Call getDb() first.');
  }
  return db;
};

export { schema };
