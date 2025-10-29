import { createDatabaseConnection } from './factory';
import type { DatabaseConfig, DatabaseInstance } from './types';

let db: DatabaseInstance;

/**
 * Gets or creates a database connection
 */
export const getDb = async (
  config: DatabaseConfig = { type: 'sqlite', path: './data/stats.db' }
): Promise<DatabaseInstance> => {
  if (!db) {
    db = await createDatabaseConnection(config);
  }
  return db;
};

/**
 * Gets the existing database connection (must be initialized first)
 */
export const getDbSync = (): DatabaseInstance => {
  if (!db) {
    throw new Error('Database not initialized. Call getDb() first.');
  }
  return db;
};
