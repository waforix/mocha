import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { PostgresConfig } from '../types';
import { initializePostgresDatabase } from './init';
import * as schema from './schema/index';

const connections = new Map<string, ReturnType<typeof drizzle>>();

function createConnectionKey(config: PostgresConfig): string {
  return `${config.host}:${config.port}:${config.database}:${config.username}`;
}

function createPostgresClient(config: PostgresConfig) {
  const connectionString = `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;

  return postgres(connectionString, {
    max: config.maxConnections || 20,
    idle_timeout: config.idleTimeoutMs || 30000,
    connect_timeout: config.connectionTimeoutMs || 10000,
    ssl: config.ssl ? 'require' : false,
    prepare: false,
    onnotice: () => {},
  });
}

export async function getPostgresDb(config: PostgresConfig) {
  const key = createConnectionKey(config);

  if (!connections.has(key)) {
    await initializePostgresDatabase(config);

    const client = createPostgresClient(config);
    const db = drizzle(client, { schema });
    connections.set(key, db);
  }

  const connection = connections.get(key);
  if (!connection) {
    throw new Error(`PostgreSQL connection not found for key: ${key}`);
  }
  return connection;
}

export function closePostgresConnections() {
  connections.clear();
}
