import { CloseCode } from '../enums/gateway';

export const GATEWAY_URL = 'wss://gateway.discord.gg/?v=10&encoding=json';

export const FATAL_CLOSE_CODES = [
  CloseCode.AUTHENTICATION_FAILED,
  CloseCode.INVALID_SHARD,
  CloseCode.SHARDING_REQUIRED,
  CloseCode.INVALID_API_VERSION,
  CloseCode.INVALID_INTENTS,
  CloseCode.DISALLOWED_INTENTS,
];

export const RESUMABLE_CLOSE_CODES = [
  CloseCode.UNKNOWN_ERROR,
  CloseCode.UNKNOWN_OPCODE,
  CloseCode.DECODE_ERROR,
  CloseCode.NOT_AUTHENTICATED,
  CloseCode.ALREADY_AUTHENTICATED,
  CloseCode.INVALID_SEQUENCE,
  CloseCode.RATE_LIMITED,
  CloseCode.SESSION_TIMED_OUT,
];

export const CLOSE_CODE_MESSAGES: Record<CloseCode, string> = {
  [CloseCode.UNKNOWN_ERROR]: 'Unknown error occurred.',
  [CloseCode.UNKNOWN_OPCODE]: 'Unknown opcode sent.',
  [CloseCode.DECODE_ERROR]: 'Invalid payload sent.',
  [CloseCode.NOT_AUTHENTICATED]: 'Not authenticated.',
  [CloseCode.AUTHENTICATION_FAILED]: 'Authentication failed. Invalid token.',
  [CloseCode.ALREADY_AUTHENTICATED]: 'Already authenticated.',
  [CloseCode.INVALID_SEQUENCE]: 'Invalid sequence number sent.',
  [CloseCode.RATE_LIMITED]: 'Rate limit exceeded.',
  [CloseCode.SESSION_TIMED_OUT]: 'Session timed out.',
  [CloseCode.INVALID_SHARD]: 'Invalid shard.',
  [CloseCode.SHARDING_REQUIRED]: 'You are required to enable sharding for your application.',
  [CloseCode.INVALID_API_VERSION]: 'Invalid API version.',
  [CloseCode.INVALID_INTENTS]: 'Invalid intents.',
  [CloseCode.DISALLOWED_INTENTS]: 'You do not have permission to use these intents.',
};
