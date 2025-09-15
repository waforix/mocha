import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import type { SqliteConfig } from '../types';
import { initializeSqliteDatabase } from './init';
import * as schema from './schema/index';

const connections = new Map<string, ReturnType<typeof drizzle>>();

export function getSqliteDb(config: SqliteConfig) {
  if (!connections.has(config.path)) {
    initializeSqliteDatabase(config.path);

    const sqlite = new Database(config.path);
    sqlite.exec('PRAGMA journal_mode = WAL');
    sqlite.exec('PRAGMA synchronous = NORMAL');
    sqlite.exec('PRAGMA cache_size = 10000');
    sqlite.exec('PRAGMA temp_store = MEMORY');

    const db = drizzle(sqlite, { schema });
    connections.set(config.path, db);
  }

  const connection = connections.get(config.path);
  if (!connection) {
    throw new Error(`SQLite connection not found for path: ${config.path}`);
  }
  return connection;
}

export function closeSqliteConnections() {
  connections.clear();
}
