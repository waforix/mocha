import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../generated/postgres/schema';
import type { DatabaseConfig, DatabaseInstance } from '../types';

export async function getPostgresDb(config: DatabaseConfig): Promise<DatabaseInstance> {
  if (config.type !== 'postgres') {
    throw new Error('Invalid config type for PostgreSQL connection');
  }

  const client = postgres(config.connectionString);
  const db = drizzle(client, { schema });

  return {
    db,
    close: () => client.end(),
    type: 'postgres',
  };
}
