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
    if (this.instance) {
      return this.instance;
    }

    if (this.isConnecting) {
      // Wait for connection to complete
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (this.instance) {
            clearInterval(checkInterval);
            resolve(this.instance);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new DatabaseConnectionError('Database connection timeout'));
        }, 30000);
      });
    }

    this.isConnecting = true;

    try {
      this.instance = new PrismaClient();
      await this.instance.$connect();
      this.isConnecting = false;
      return this.instance;
    } catch (error) {
      this.isConnecting = false;
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
    if (this.instance) {
      await this.instance.$disconnect();
      this.instance = null;
    }
  }

  /**
   * Check if database is connected
   */
  static isConnected(): boolean {
    return this.instance !== null;
  }

  /**
   * Reset the instance (for testing)
   */
  static reset(): void {
    this.instance = null;
    this.isConnecting = false;
  }
}

