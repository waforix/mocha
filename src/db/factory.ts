import { getPostgresDb } from './postgres/connection';
import { getSqliteDb } from './sqlite/connection';
import type { DatabaseConfig, DatabaseInstance } from './types';

export async function createDatabaseConnection(config: DatabaseConfig): Promise<DatabaseInstance> {
  if (config.type === 'sqlite') {
    return await getSqliteDb(config);
  }

  if (config.type === 'postgres') {
    return await getPostgresDb(config);
  }

  const _exhaustiveCheck: never = config;
  throw new Error(`Unsupported database type: ${_exhaustiveCheck}`);
}
