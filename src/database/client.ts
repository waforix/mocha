import { PrismaClient } from '@prisma/client';
import { DatabaseConnectionError } from '../errors/network';

let instance: PrismaClient | null = null;
let isConnecting = false;

/**
 * Get or create the Prisma client instance
 * @returns Prisma client instance
 * @throws DatabaseConnectionError if connection fails
 * @category Database
 */
export async function getInstance(): Promise<PrismaClient> {
  if (instance) {
    return instance;
  }

  if (isConnecting) {
    // Wait for connection to complete
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (instance) {
          clearInterval(checkInterval);
          resolve(instance);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new DatabaseConnectionError('Database connection timeout'));
      }, 30000);
    });
  }

  isConnecting = true;

  try {
    instance = new PrismaClient();
    await instance.$connect();
    isConnecting = false;
    return instance;
  } catch (error) {
    isConnecting = false;
    throw new DatabaseConnectionError(
      'Failed to connect to database',
      { error: String(error) },
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Disconnect from the database
 * @category Database
 */
export async function disconnect(): Promise<void> {
  if (instance) {
    await instance.$disconnect();
    instance = null;
  }
}

/**
 * Check if database is connected
 * @returns True if connected, false otherwise
 * @category Database
 */
export function isConnected(): boolean {
  return instance !== null;
}

/**
 * Reset the instance (for testing)
 * @category Database
 */
export function reset(): void {
  instance = null;
  isConnecting = false;
}
