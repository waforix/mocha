import { z } from 'zod';

/**
 * Validation schemas for library configuration and inputs
 * @category Validation
 */

/**
 * SQLite database configuration schema
 */
export const SQLiteDatabaseConfigSchema = z.object({
  type: z.literal('sqlite'),
  path: z.string().min(1, 'Database path is required'),
  options: z.object({
    timeout: z.number().positive().optional(),
    verbose: z.function().optional(),
    pragma: z.record(z.union([z.string(), z.number()])).optional(),
  }).optional(),
});

/**
 * PostgreSQL database configuration schema
 */
export const PostgresDatabaseConfigSchema = z.object({
  type: z.literal('postgres'),
  host: z.string().min(1, 'Host is required'),
  port: z.number().int().min(1).max(65535).default(5432),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  ssl: z.boolean().default(false),
  options: z.record(z.unknown()).optional(),
});

/**
 * MySQL database configuration schema
 */
export const MySQLDatabaseConfigSchema = z.object({
  type: z.literal('mysql'),
  host: z.string().min(1, 'Host is required'),
  port: z.number().int().min(1).max(65535).default(3306),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  ssl: z.boolean().default(false),
  options: z.record(z.unknown()).optional(),
});

/**
 * Union of all database configuration schemas
 */
export const DatabaseConfigSchema = z.union([
  SQLiteDatabaseConfigSchema,
  PostgresDatabaseConfigSchema,
  MySQLDatabaseConfigSchema,
]);

/**
 * Cache configuration schema
 */
export const CacheConfigSchema = z.object({
  userStatsSize: z.number().int().positive().default(1000),
  guildStatsSize: z.number().int().positive().default(100),
  leaderboardSize: z.number().int().positive().default(500),
  querySize: z.number().int().positive().default(2000),
  ttlMs: z.number().int().positive().default(300000),
  strategy: z.enum(['lru', 'lfu', 'fifo']).default('lru'),
});

/**
 * Gateway configuration schema
 */
export const GatewayConfigSchema = z.object({
  token: z.string().min(1, 'Discord token is required'),
  intents: z.number().int().nonnegative(),
  maxReconnects: z.number().int().nonnegative().default(5),
  connectionTimeout: z.number().int().positive().default(30000),
  rateLimitConfig: z.object({
    maxRequests: z.number().int().positive().default(120),
    windowMs: z.number().int().positive().default(60000),
  }).optional(),
});

/**
 * Client configuration schema
 */
export const ClientConfigSchema = z.object({
  database: DatabaseConfigSchema,
  cache: CacheConfigSchema.optional(),
  gateway: GatewayConfigSchema.optional(),
  enableMetrics: z.boolean().default(true),
  enableNotifications: z.boolean().default(false),
  enableRateLimit: z.boolean().default(false),
  debug: z.boolean().default(false),
});

/**
 * Type inference from schemas
 */
export type SQLiteDatabaseConfig = z.infer<typeof SQLiteDatabaseConfigSchema>;
export type PostgresDatabaseConfig = z.infer<typeof PostgresDatabaseConfigSchema>;
export type MySQLDatabaseConfig = z.infer<typeof MySQLDatabaseConfigSchema>;
export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
export type CacheConfig = z.infer<typeof CacheConfigSchema>;
export type GatewayConfig = z.infer<typeof GatewayConfigSchema>;
export type ClientConfig = z.infer<typeof ClientConfigSchema>;

