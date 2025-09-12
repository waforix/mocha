import { EventEmitter } from 'node:events';
import type { CacheConfig } from '../cache/index';
import type { GatewayOptions } from '../gateway/index';
export interface StatsClientOptions extends GatewayOptions {
    dbPath?: string;
    cache?: CacheConfig;
}
export declare class StatsClient extends EventEmitter {
    private gateway;
    private dispatcher;
    private aggregator;
    private cache;
    private db;
    constructor(options: StatsClientOptions);
    private setupEventHandlers;
    connect(): Promise<void>;
    disconnect(): void;
    getUserStats(guildId: string, userId: string, days?: number): Promise<import("..").UserStats>;
    getGuildStats(guildId: string, days?: number): Promise<import("..").GuildStats>;
    getLeaderboard(guildId: string, type: 'messages' | 'voice', limit?: number, days?: number): Promise<unknown[]>;
    getActivityHeatmap(guildId: string, userId?: string, days?: number): Promise<{}>;
    getCacheStats(): import("../cache/types").CacheStats;
    clearCache(): void;
    getDatabase(): import("drizzle-orm/bun-sqlite").BunSQLiteDatabase<Record<string, unknown>>;
}
