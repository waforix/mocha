import { CacheComponent } from '../../src/components/cache';
import { GatewayComponent } from '../../src/components/gateway';
import type { CacheConfig, GatewayConfig } from '../../src/validation';

/**
 * Test utilities and helpers
 */

/**
 * Create a test cache component
 */
export function createTestCache(config?: Partial<CacheConfig>): CacheComponent {
  const defaultConfig: CacheConfig = {
    userStatsSize: 100,
    guildStatsSize: 10,
    leaderboardSize: 50,
    querySize: 200,
    ttlMs: 5000,
    strategy: 'lru',
    ...config,
  };
  return new CacheComponent(defaultConfig);
}

/**
 * Create a test gateway component
 */
export function createTestGateway(config?: Partial<GatewayConfig>): GatewayComponent {
  const defaultConfig: GatewayConfig = {
    token: 'test-token-123',
    intents: 0,
    maxReconnects: 3,
    connectionTimeout: 5000,
    ...config,
  };
  return new GatewayComponent(defaultConfig);
}

/**
 * Wait for a specific amount of time
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a mock Discord ID
 */
export function createMockDiscordId(): string {
  return Math.floor(Math.random() * 10000000000000000).toString().padStart(17, '0');
}

/**
 * Create a mock guild ID
 */
export function createMockGuildId(): string {
  return createMockDiscordId();
}

/**
 * Create a mock user ID
 */
export function createMockUserId(): string {
  return createMockDiscordId();
}

/**
 * Create a mock channel ID
 */
export function createMockChannelId(): string {
  return createMockDiscordId();
}

/**
 * Create a mock message ID
 */
export function createMockMessageId(): string {
  return createMockDiscordId();
}

