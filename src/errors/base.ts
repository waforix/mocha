/**
 * Base error class for all library errors
 * @category Errors
 */
export class LibraryError extends Error {
  /**
   * Unique error code for categorization
   */
  public readonly code: string;

  /**
   * Additional context about the error
   */
  public readonly context?: Record<string, unknown>;

  /**
   * Original error that caused this error
   */
  public readonly cause?: Error;

  /**
   * Timestamp when the error occurred
   */
  public readonly timestamp: Date;

  /**
   * Create a new LibraryError
   * @param message - Human-readable error message
   * @param code - Unique error code
   * @param context - Additional context information
   * @param cause - Original error that caused this
   */
  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    this.cause = cause;
    this.timestamp = new Date();

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, LibraryError.prototype);
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
      cause: this.cause ? {
        name: this.cause.name,
        message: this.cause.message,
        stack: this.cause.stack,
      } : undefined,
    };
  }
}

