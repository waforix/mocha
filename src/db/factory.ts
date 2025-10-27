import { setSchemaType } from './schema/index';
import type { DatabaseConfig, DatabaseInstance } from './types';

/**
 * Create a database connection based on configuration
 * Currently uses Prisma for database access
 */
export async function createDatabaseConnection(config: DatabaseConfig): Promise<DatabaseInstance> {
  setSchemaType(config.type);

  // Database connection is now handled by Prisma
  // This function is kept for backward compatibility
  throw new Error('Database connection requires Prisma setup');
}
