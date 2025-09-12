import type { GuildStats, UserStats } from '../stats/index';
import type { CacheConfig, CacheStats } from './types';
export declare class CacheManager {
    private userStatsCache;
    private guildStatsCache;
    private leaderboardCache;
    private queryCache;
    constructor(config?: CacheConfig);
    getUserStats(guildId: string, userId: string, days: number): UserStats | undefined;
    setUserStats(guildId: string, userId: string, days: number, stats: UserStats): void;
    getGuildStats(guildId: string, days: number): GuildStats | undefined;
    setGuildStats(guildId: string, days: number, stats: GuildStats): void;
    getLeaderboard(guildId: string, type: string, limit: number, days: number): unknown[] | undefined;
    setLeaderboard(guildId: string, type: string, limit: number, days: number, data: unknown[]): void;
    getQuery<T>(key: string): T | undefined;
    setQuery<T>(key: string, data: T): void;
    invalidateUser(guildId: string, userId: string): void;
    invalidateGuild(guildId: string): void;
    clear(): void;
    getStats(): CacheStats;
}
