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
export class DatabaseConnectionError extends DatabaseError {
  /**
   * Create a new DatabaseConnectionError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, { ...context, type: 'connection' }, cause);
    this.code = 'DATABASE_CONNECTION_ERROR';
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}

/**
 * Error thrown when database query fails
 * @category Errors
 */
export class DatabaseQueryError extends DatabaseError {
  /**
   * Create a new DatabaseQueryError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, { ...context, type: 'query' }, cause);
    this.code = 'DATABASE_QUERY_ERROR';
    Object.setPrototypeOf(this, DatabaseQueryError.prototype);
  }
}

/**
 * Error thrown when database migration fails
 * @category Errors
 */
export class DatabaseMigrationError extends DatabaseError {
  /**
   * Create a new DatabaseMigrationError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, { ...context, type: 'migration' }, cause);
    this.code = 'DATABASE_MIGRATION_ERROR';
    Object.setPrototypeOf(this, DatabaseMigrationError.prototype);
  }
}
