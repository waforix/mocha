import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../generated/sqlite/schema';
import type { DatabaseConfig, DatabaseInstance } from '../types';

export async function getSqliteDb(config: DatabaseConfig): Promise<DatabaseInstance> {
  if (config.type !== 'sqlite') {
    throw new Error('Invalid config type for SQLite connection');
  }

  const sqlite = new Database(config.path);
  const db = drizzle(sqlite, { schema });

  return {
    db,
    close: () => sqlite.close(),
    type: 'sqlite'
  };
}
