// Core client

// Components
export type { IComponent } from './components';
export { BaseComponent, CacheComponent, GatewayComponent, StatsComponent } from './components';
// Database
export {
  countGuilds,
  countMessageEventsByGuild,
  countUsers,
  createMemberEvent,
  createMessageEvent,
  createPresenceEvent,
  createReactionEvent,
  createVoiceEvent,
  deleteGuild,
  deleteUser,
  disconnect,
  findAllGuilds,
  findAllUsers,
  findGuildById,
  findMessageEventsByGuildAndDateRange,
  findUserById,
  findUsersByUsername,
  findVoiceEventsByGuildAndDateRange,
  getInstance,
  isConnected,
  reset,
  upsertGuild,
  upsertUser,
} from './database';
// Errors
export {
  CacheError,
  CacheEvictionError,
  CacheSerializationError,
  ConfigurationError,
  DatabaseConnectionError,
  DatabaseError,
  DatabaseMigrationError,
  DatabaseQueryError,
  GatewayConnectionError,
  InvalidInputError,
  LibraryError,
  NetworkError,
  RateLimitError,
  TimeoutError,
  ValidationError,
} from './errors';
export * from './lib/commands';
export type { ClientOptions } from './lib/index';
export { Client, Client as StatsClient } from './lib/index';
export type {
  CacheConfig,
  ClientConfig,
  DatabaseConfig,
  GatewayConfig,
} from './validation';
// Validation
export { safeParse, validate } from './validation';
