import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export type DatabaseType = 'sqlite' | 'postgres';

export interface SqliteConfig {
  type: 'sqlite';
  path: string;
}

export interface PostgresConfig {
  type: 'postgres';
  connectionString: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
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

// biome-ignore lint/suspicious/noExplicitAny: Required for Drizzle database type compatibility
export type SqliteInstance = BetterSQLite3Database<any>;
export type PostgresInstance = PostgresJsDatabase<Record<string, unknown>>;

export interface DatabaseConnection {
  db: SqliteInstance | PostgresInstance;
  close: () => void;
  type: DatabaseType;
}

export type DatabaseInstance = DatabaseConnection;
