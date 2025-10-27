import { PrismaClient } from '@prisma/client';
import { DatabaseConnectionError } from '../errors/network';

/**
 * Database client wrapper for Prisma
 * @category Database
 */
export class DatabaseClient {
  private static instance: PrismaClient | null = null;
  private static isConnecting = false;

  /**
   * Get or create the Prisma client instance
   * @returns Prisma client instance
   * @throws DatabaseConnectionError if connection fails
   */
  static async getInstance(): Promise<PrismaClient> {
    if (DatabaseClient.instance) {
      return DatabaseClient.instance;
    }

    if (DatabaseClient.isConnecting) {
      // Wait for connection to complete
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (DatabaseClient.instance) {
            clearInterval(checkInterval);
            resolve(DatabaseClient.instance);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new DatabaseConnectionError('Database connection timeout'));
        }, 30000);
      });
    }

    DatabaseClient.isConnecting = true;

    try {
      DatabaseClient.instance = new PrismaClient();
      await DatabaseClient.instance.$connect();
      DatabaseClient.isConnecting = false;
      return DatabaseClient.instance;
    } catch (error) {
      DatabaseClient.isConnecting = false;
      throw new DatabaseConnectionError(
        'Failed to connect to database',
        { error: String(error) },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Disconnect from the database
   */
  static async disconnect(): Promise<void> {
    if (DatabaseClient.instance) {
      await DatabaseClient.instance.$disconnect();
      DatabaseClient.instance = null;
    }
  }

  /**
   * Check if database is connected
   */
  static isConnected(): boolean {
    return DatabaseClient.instance !== null;
  }

  /**
   * Reset the instance (for testing)
   */
  static reset(): void {
    DatabaseClient.instance = null;
    DatabaseClient.isConnecting = false;
  }
}
