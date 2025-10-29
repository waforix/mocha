/**
 * Prisma configuration for multi-database support
 */
export interface PrismaConfig {
  provider: 'sqlite' | 'postgresql' | 'mysql';
  url?: string;
  directUrl?: string;
  shadowDatabaseUrl?: string;
}

/**
 * Get Prisma configuration based on environment
 */
export function getPrismaConfig(): PrismaConfig {
  const dbType = (process.env.DB_TYPE as 'sqlite' | 'postgresql' | 'mysql') || 'sqlite';

  switch (dbType) {
    case 'sqlite':
      return {
        provider: 'sqlite',
        url: process.env.DATABASE_URL || 'file:./data/stats.db',
      };

    case 'postgresql':
      return {
        provider: 'postgresql',
        url:
          process.env.DATABASE_URL ||
          `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'waforix'}${process.env.DB_SSL === 'true' ? '?sslmode=require' : ''}`,
      };

    case 'mysql':
      return {
        provider: 'mysql',
        url:
          process.env.DATABASE_URL ||
          `mysql://${process.env.MYSQL_USER || 'root'}:${process.env.MYSQL_PASSWORD || 'password'}@${process.env.MYSQL_HOST || 'localhost'}:${process.env.MYSQL_PORT || 3306}/${process.env.MYSQL_DB || 'waforix'}`,
      };

    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
}

export const prismaConfig = getPrismaConfig();

