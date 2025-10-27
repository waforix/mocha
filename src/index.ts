// Core client

// Legacy exports for backward compatibility
export type { Metrics } from './analytics/index';
export * from './autocomplete/index';
export * from './builders/index';
export type { IComponent } from './components';
// Components
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
export type { ExportData, ExportOptions } from './export/index';
export * from './lib/commands';
export type { ClientOptions } from './lib/index';
export { Client, Client as StatsClient } from './lib/index';
export type { NotificationEvent, NotificationRule } from './notifications/index';
export type { RateLimitConfig } from './ratelimit/index';
export type { GuildStats, UserStats } from './stats/index';
export type {
  CacheConfig,
  ClientConfig,
  DatabaseConfig,
  GatewayConfig,
} from './validation';
// Validation
export { safeParse, validate } from './validation';
