/**
 * Error handling module
 * @category Errors
 */

export { LibraryError } from './base';
export {
  CacheError,
  CacheEvictionError,
  CacheSerializationError,
} from './cache';
export {
  DatabaseConnectionError,
  DatabaseError,
  DatabaseMigrationError,
  DatabaseQueryError,
} from './database';
export {
  GatewayConnectionError,
  NetworkError,
  RateLimitError,
  TimeoutError,
} from './network';
export {
  ConfigurationError,
  InvalidInputError,
  ValidationError,
} from './validation';
