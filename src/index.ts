export type { Metrics } from './analytics/index';
export * from './builders/index';
export type { CacheConfig } from './cache/index';
export type { ExportData, ExportOptions } from './export/index';
export { INTENTS } from './gateway/constants';
export * from './lib/commands';
export type { StatsClientOptions } from './lib/index';
import { StatsClient } from './lib/index';
export type { NotificationEvent, NotificationRule } from './notifications/index';
export type { RateLimitConfig } from './ratelimit/index';
export type { GuildStats, UserStats } from './stats/index';

const client = new StatsClient({});

await client.connect();

export { StatsClient };
