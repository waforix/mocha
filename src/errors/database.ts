import { LibraryError } from './base';

/**
 * Error thrown when database operations fail
 * @category Errors
 */
export class DatabaseError extends LibraryError {
  /**
   * Create a new DatabaseError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'DATABASE_ERROR', context, cause);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Error thrown when database connection fails
 * @category Errors
 */
export class DatabaseConnectionError extends LibraryError {
  /**
   * Create a new DatabaseConnectionError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'DATABASE_CONNECTION_ERROR', { ...context, type: 'connection' }, cause);
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}

/**
 * Error thrown when database query fails
 * @category Errors
 */
export class DatabaseQueryError extends LibraryError {
  /**
   * Create a new DatabaseQueryError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'DATABASE_QUERY_ERROR', { ...context, type: 'query' }, cause);
    Object.setPrototypeOf(this, DatabaseQueryError.prototype);
  }
}

/**
 * Error thrown when database migration fails
 * @category Errors
 */
export class DatabaseMigrationError extends LibraryError {
  /**
   * Create a new DatabaseMigrationError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'DATABASE_MIGRATION_ERROR', { ...context, type: 'migration' }, cause);
    Object.setPrototypeOf(this, DatabaseMigrationError.prototype);
  }
}
