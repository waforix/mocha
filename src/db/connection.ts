import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema/index';

let db: ReturnType<typeof drizzle>;

export const getDb = (path = './data/stats.db') => {
  if (!db) {
    const sqlite = new Database(path);
    sqlite.exec('PRAGMA journal_mode = WAL');
    sqlite.exec('PRAGMA synchronous = NORMAL');
    sqlite.exec('PRAGMA cache_size = 10000');
    sqlite.exec('PRAGMA temp_store = MEMORY');
    db = drizzle(sqlite, { schema });
  }
  return db;
};

export { schema };
