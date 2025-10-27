/**
 * Error handling module
 * @category Errors
 */

export { LibraryError } from './base';
export {
  DatabaseError,
  DatabaseConnectionError,
  DatabaseQueryError,
  DatabaseMigrationError,
} from './database';
export {
  CacheError,
  CacheEvictionError,
  CacheSerializationError,
} from './cache';
export {
  ValidationError,
  ConfigurationError,
  InvalidInputError,
} from './validation';
export {
  NetworkError,
  GatewayConnectionError,
  RateLimitError,
  TimeoutError,
} from './network';

