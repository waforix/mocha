import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../generated/postgres/schema';
import type { DatabaseConfig, DatabaseInstance } from '../types';

export async function getPostgresDb(config: DatabaseConfig): Promise<DatabaseInstance> {
  if (config.type !== 'postgres') {
    throw new Error('Invalid config type for PostgreSQL connection');
  }

  // Build connection string from individual parameters if not provided
  let connectionString = config.connectionString;

  if (!connectionString && config.host && config.database && config.username) {
    const protocol = 'postgres://';
    const auth = `${config.username}${config.password ? `:${config.password}` : ''}`;
    const hostPort = `${config.host}${config.port ? `:${config.port}` : ''}`;
    const dbName = config.database;
    const sslParam = config.ssl ? '?sslmode=require' : '';

    connectionString = `${protocol}${auth}@${hostPort}/${dbName}${sslParam}`;
  }

  if (!connectionString) {
    throw new Error(
      'PostgreSQL connection requires either a connectionString or host, database, and username parameters'
    );
  }

  const client = postgres(connectionString, {
    max: config.maxConnections,
    idle_timeout: config.idleTimeoutMs ? config.idleTimeoutMs / 1000 : undefined,
    connect_timeout: config.connectionTimeoutMs ? config.connectionTimeoutMs / 1000 : undefined,
  });
  const db = drizzle(client, { schema });

  return {
    db,
    close: () => client.end(),
    type: 'postgres',
  };
}
