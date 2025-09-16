export const CLOSE_CODES = {
  UNKNOWN_ERROR: 4000,
  UNKNOWN_OPCODE: 4001,
  DECODE_ERROR: 4002,
  NOT_AUTHENTICATED: 4003,
  AUTHENTICATION_FAILED: 4004,
  ALREADY_AUTHENTICATED: 4005,
  INVALID_SEQUENCE: 4007,
  RATE_LIMITED: 4008,
  SESSION_TIMED_OUT: 4009,
  INVALID_SHARD: 4010,
  SHARDING_REQUIRED: 4011,
  INVALID_API_VERSION: 4012,
  INVALID_INTENTS: 4013,
  DISALLOWED_INTENTS: 4014,
} as const;

export const FATAL_CLOSE_CODES = new Set([
  CLOSE_CODES.AUTHENTICATION_FAILED,
  CLOSE_CODES.INVALID_SHARD,
  CLOSE_CODES.SHARDING_REQUIRED,
  CLOSE_CODES.INVALID_API_VERSION,
  CLOSE_CODES.INVALID_INTENTS,
  CLOSE_CODES.DISALLOWED_INTENTS,
]);

export const RESUMABLE_CLOSE_CODES = new Set([
  CLOSE_CODES.UNKNOWN_ERROR,
  CLOSE_CODES.UNKNOWN_OPCODE,
  CLOSE_CODES.DECODE_ERROR,
  CLOSE_CODES.NOT_AUTHENTICATED,
  CLOSE_CODES.ALREADY_AUTHENTICATED,
  CLOSE_CODES.INVALID_SEQUENCE,
  CLOSE_CODES.RATE_LIMITED,
  CLOSE_CODES.SESSION_TIMED_OUT,
]);

export const isFatalCloseCode = (code: number): boolean => {
  // biome-ignore lint/suspicious/noExplicitAny: Discord close codes are dynamic
  return FATAL_CLOSE_CODES.has(code as any);
};
export const isResumableCloseCode = (code: number): boolean => {
  // biome-ignore lint/suspicious/noExplicitAny: Discord close codes are dynamic
  return RESUMABLE_CLOSE_CODES.has(code as any);
};

export const getCloseCodeMessage = (code: number): string => {
  switch (code) {
    case CLOSE_CODES.UNKNOWN_ERROR:
      return 'Unknown error occurred';
    case CLOSE_CODES.UNKNOWN_OPCODE:
      return 'Unknown opcode sent';
    case CLOSE_CODES.DECODE_ERROR:
      return 'Invalid payload sent';
    case CLOSE_CODES.NOT_AUTHENTICATED:
      return 'Payload sent before authentication';
    case CLOSE_CODES.AUTHENTICATION_FAILED:
      return 'Invalid token provided';
    case CLOSE_CODES.ALREADY_AUTHENTICATED:
      return 'Already authenticated';
    case CLOSE_CODES.INVALID_SEQUENCE:
      return 'Invalid sequence number';
    case CLOSE_CODES.RATE_LIMITED:
      return 'Rate limited';
    case CLOSE_CODES.SESSION_TIMED_OUT:
      return 'Session timed out';
    case CLOSE_CODES.INVALID_SHARD:
      return 'Invalid shard provided';
    case CLOSE_CODES.SHARDING_REQUIRED:
      return 'Sharding is required for this bot';
    case CLOSE_CODES.INVALID_API_VERSION:
      return 'Invalid API version';
    case CLOSE_CODES.INVALID_INTENTS:
      return 'Invalid intents provided';
    case CLOSE_CODES.DISALLOWED_INTENTS:
      return 'Disallowed intents provided';
    default:
      return `Unknown close code: ${code}`;
  }
};
