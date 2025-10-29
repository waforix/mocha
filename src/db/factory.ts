import { PrismaClient } from '@prisma/client';
import type { DatabaseConfig, DatabaseInstance, MysqlConfig, PostgresConfig } from './types';

/**
 * Build PostgreSQL connection URL
 */
function buildPostgresUrl(config: PostgresConfig): string {
  if (config.connectionString) {
    return config.connectionString;
  }
  const host = config.host || 'localhost';
  const port = config.port || 5432;
  const database = config.database || 'waforix';
  const username = config.username || 'postgres';
  const password = config.password || '';
  const ssl = config.ssl ? '?sslmode=require' : '';
  return `postgresql://${username}:${password}@${host}:${port}/${database}${ssl}`;
}

/**
 * Build MySQL connection URL
 */
function buildMysqlUrl(config: MysqlConfig): string {
  if (config.connectionString) {
    return config.connectionString;
  }
  const host = config.host || 'localhost';
  const port = config.port || 3306;
  const database = config.database || 'waforix';
  const username = config.username || 'root';
  const password = config.password || 'password';
  return `mysql://${username}:${password}@${host}:${port}/${database}`;
}

/**
 * Build datasource URL from config
 */
function buildDatasourceUrl(config: DatabaseConfig): string {
  if (config.type === 'sqlite') {
    return `file:${config.path}`;
  }
  if (config.type === 'postgres') {
    return buildPostgresUrl(config);
  }
  if (config.type === 'mysql') {
    return buildMysqlUrl(config);
  }
  const _exhaustiveCheck: never = config;
  throw new Error(`Unsupported database type: ${_exhaustiveCheck}`);
}

/**
 * Creates a database connection using Prisma Client
 */
export async function createDatabaseConnection(config: DatabaseConfig): Promise<DatabaseInstance> {
  const datasourceUrl = buildDatasourceUrl(config);

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: datasourceUrl,
      },
    },
  });

  await prisma.$connect();

  return {
    db: prisma,
    close: async () => {
      await prisma.$disconnect();
    },
    type: config.type,
  };
}
