import { PrismaClient } from '@prisma/client';
import type { DatabaseConfig, DatabaseInstance } from './types';

/**
 * Creates a database connection using Prisma Client
 */
export async function createDatabaseConnection(config: DatabaseConfig): Promise<DatabaseInstance> {
  let datasourceUrl: string;

  if (config.type === 'sqlite') {
    datasourceUrl = `file:${config.path}`;
  } else if (config.type === 'postgres') {
    if (config.connectionString) {
      datasourceUrl = config.connectionString;
    } else {
      const host = config.host || 'localhost';
      const port = config.port || 5432;
      const database = config.database || 'waforix';
      const username = config.username || 'postgres';
      const password = config.password || '';
      const ssl = config.ssl ? '?sslmode=require' : '';
      datasourceUrl = `postgresql://${username}:${password}@${host}:${port}/${database}${ssl}`;
    }
  } else if (config.type === 'mysql') {
    if (config.connectionString) {
      datasourceUrl = config.connectionString;
    } else {
      const host = config.host || 'localhost';
      const port = config.port || 3306;
      const database = config.database || 'waforix';
      const username = config.username || 'root';
      const password = config.password || 'password';
      datasourceUrl = `mysql://${username}:${password}@${host}:${port}/${database}`;
    }
  } else {
    const _exhaustiveCheck: never = config;
    throw new Error(`Unsupported database type: ${_exhaustiveCheck}`);
  }

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
