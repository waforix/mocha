import type { Database } from 'bun:sqlite';
import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export type DatabaseType = 'sqlite' | 'postgres';

export interface SqliteConfig {
  type: 'sqlite';
  path: string;
}

export interface PostgresConfig {
  type: 'postgres';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  maxConnections?: number;
  idleTimeoutMs?: number;
  connectionTimeoutMs?: number;
}

export type DatabaseConfig = SqliteConfig | PostgresConfig;

export interface DatabaseOptions {
  config: DatabaseConfig;
  enableWal?: boolean;
  enableOptimizations?: boolean;
}

export type SqliteInstance = BunSQLiteDatabase<Record<string, unknown>> & { $client: Database };
export type PostgresInstance = PostgresJsDatabase<Record<string, unknown>>;
export type DatabaseInstance = SqliteInstance | PostgresInstance;
