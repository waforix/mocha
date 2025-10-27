import { LibraryError } from './base';

/**
 * Error thrown when cache operations fail
 * @category Errors
 */
export class CacheError extends LibraryError {
  /**
   * Create a new CacheError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'CACHE_ERROR', context, cause);
    Object.setPrototypeOf(this, CacheError.prototype);
  }
}

/**
 * Error thrown when cache eviction fails
 * @category Errors
 */
export class CacheEvictionError extends LibraryError {
  /**
   * Create a new CacheEvictionError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'CACHE_EVICTION_ERROR', { ...context, type: 'eviction' }, cause);
    Object.setPrototypeOf(this, CacheEvictionError.prototype);
  }
}

/**
 * Error thrown when cache serialization fails
 * @category Errors
 */
export class CacheSerializationError extends LibraryError {
  /**
   * Create a new CacheSerializationError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'CACHE_SERIALIZATION_ERROR', { ...context, type: 'serialization' }, cause);
    Object.setPrototypeOf(this, CacheSerializationError.prototype);
  }
}
