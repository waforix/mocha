import { getPostgresDb } from './postgres/connection';
import { setSchemaType } from './schema/index';
import { getSqliteDb } from './sqlite/connection';
import type { DatabaseConfig, DatabaseInstance } from './types';

export async function createDatabaseConnection(config: DatabaseConfig): Promise<DatabaseInstance> {
  if (config.type === 'sqlite') {
    setSchemaType('sqlite');
    return await getSqliteDb(config);
  }

  if (config.type === 'postgres') {
    setSchemaType('postgres');
    return await getPostgresDb(config);
  }

  const _exhaustiveCheck: never = config;
  throw new Error(`Unsupported database type: ${_exhaustiveCheck}`);
}
