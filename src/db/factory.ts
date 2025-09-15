import { getPostgresDb } from './postgres/connection';
import { initializePostgresDatabase } from './postgres/init';
import { getSqliteDb } from './sqlite/connection';
import type { DatabaseConfig } from './types';

export type DatabaseInstance = ReturnType<typeof getSqliteDb> | ReturnType<typeof getPostgresDb>;

export async function createDatabaseConnection(config: DatabaseConfig): Promise<DatabaseInstance> {
  if (config.type === 'sqlite') {
    return getSqliteDb(config);
  }

  if (config.type === 'postgres') {
    await initializePostgresDatabase(config);
    return getPostgresDb(config);
  }

  const _exhaustiveCheck: never = config;
  throw new Error(`Unsupported database type: ${_exhaustiveCheck}`);
}
