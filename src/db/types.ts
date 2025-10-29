import type { PrismaClient } from '@prisma/client';

export type DatabaseType = 'sqlite' | 'postgres' | 'mysql';

export interface SqliteConfig {
  type: 'sqlite';
  path: string;
}

export interface PostgresConfig {
  type: 'postgres';
  connectionString?: string;
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

export interface MysqlConfig {
  type: 'mysql';
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
}

export type DatabaseConfig = SqliteConfig | PostgresConfig | MysqlConfig;

export interface DatabaseOptions {
  config: DatabaseConfig;
  enableWal?: boolean;
  enableOptimizations?: boolean;
}

export interface DatabaseConnection {
  db: PrismaClient;
  close: () => Promise<void>;
  type: DatabaseType;
}

export type DatabaseInstance = DatabaseConnection;
