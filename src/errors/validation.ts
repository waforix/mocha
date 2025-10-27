import { LibraryError } from './base';

/**
 * Error thrown when validation fails
 * @category Errors
 */
export class ValidationError extends LibraryError {
  /**
   * Validation errors from Zod or other validators
   */
  public readonly errors: Record<string, string[]>;

  /**
   * Create a new ValidationError
   * @param message - Error message
   * @param errors - Validation errors
   * @param context - Additional context
   */
  constructor(
    message: string,
    errors: Record<string, string[]>,
    context?: Record<string, unknown>
  ) {
    super(message, 'VALIDATION_ERROR', { ...context, errors }, undefined);
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error thrown when configuration is invalid
 * @category Errors
 */
export class ConfigurationError extends LibraryError {
  /**
   * Create a new ConfigurationError
   * @param message - Error message
   * @param context - Additional context
   * @param cause - Original error
   */
  constructor(
    message: string,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'CONFIGURATION_ERROR', context, cause);
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

/**
 * Error thrown when input is invalid
 * @category Errors
 */
export class InvalidInputError extends ValidationError {
  /**
   * Create a new InvalidInputError
   * @param message - Error message
   * @param errors - Validation errors
   * @param context - Additional context
   */
  constructor(
    message: string,
    errors: Record<string, string[]>,
    context?: Record<string, unknown>
  ) {
    super(message, errors, { ...context, type: 'input' });
    this.code = 'INVALID_INPUT_ERROR';
    Object.setPrototypeOf(this, InvalidInputError.prototype);
  }
}

