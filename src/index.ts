// Core client
export { Client } from './client';
export type { ClientConfig } from './validation';

// Components
export { BaseComponent, CacheComponent, StatsComponent, GatewayComponent } from './components';
export type { IComponent } from './components';

// Database
export { DatabaseClient, GuildRepository, UserRepository } from './database';
export {
  MessageEventRepository,
  VoiceEventRepository,
  MemberEventRepository,
  PresenceEventRepository,
  ReactionEventRepository,
} from './database';

// Validation
export { Validator } from './validation';
export type {
  ClientConfig,
  CacheConfig,
  GatewayConfig,
  DatabaseConfig,
} from './validation';

// Errors
export {
  LibraryError,
  DatabaseError,
  DatabaseConnectionError,
  DatabaseQueryError,
  DatabaseMigrationError,
  CacheError,
  CacheEvictionError,
  CacheSerializationError,
  ValidationError,
  ConfigurationError,
  InvalidInputError,
  NetworkError,
  GatewayConnectionError,
  RateLimitError,
  TimeoutError,
} from './errors';

// Legacy exports for backward compatibility
export type { Metrics } from './analytics/index';
export * from './builders/index';
export type { ExportData, ExportOptions } from './export/index';
export { INTENTS } from './gateway/constants';
export * from './lib/commands';
export type { StatsClientOptions } from './lib/index';
export { StatsClient } from './lib/index';
export type { NotificationEvent, NotificationRule } from './notifications/index';
export type { RateLimitConfig } from './ratelimit/index';
export type { GuildStats, UserStats } from './stats/index';
