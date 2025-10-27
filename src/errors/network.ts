import { LibraryError } from './base';

/**
 * Error thrown when network operations fail
 * @category Errors
 */
export class NetworkError extends LibraryError {
  /**
   * HTTP status code if applicable
   */
  public readonly statusCode?: number;

  /**
   * Create a new NetworkError
   * @param message - Error message
   * @param statusCode - HTTP status code
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(
    message: string,
    statusCode?: number,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'NETWORK_ERROR', { ...context, statusCode }, cause);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Error thrown when gateway connection fails
 * @category Errors
 */
export class GatewayConnectionError extends LibraryError {
  /**
   * Create a new GatewayConnectionError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'GATEWAY_CONNECTION_ERROR', { ...context, type: 'gateway' }, cause);
    Object.setPrototypeOf(this, GatewayConnectionError.prototype);
  }
}

/**
 * Error thrown when rate limit is exceeded
 * @category Errors
 */
export class RateLimitError extends LibraryError {
  /**
   * Time in milliseconds until rate limit resets
   */
  public readonly retryAfter: number;

  /**
   * Create a new RateLimitError
   * @param message - Error message
   * @param retryAfter - Milliseconds until retry
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(
    message: string,
    retryAfter: number,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'RATE_LIMIT_ERROR', { ...context, type: 'rate_limit', retryAfter }, cause);
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Error thrown when request timeout occurs
 * @category Errors
 */
export class TimeoutError extends LibraryError {
  /**
   * Create a new TimeoutError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'TIMEOUT_ERROR', { ...context, type: 'timeout' }, cause);
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
