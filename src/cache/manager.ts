import { CACHE_DEFAULTS } from '../lib/constants';
import type { GuildStats, UserStats } from '../stats/index';
import { createGuildStatsKey, createLeaderboardKey, createUserStatsKey } from './keys';
import { LRUCache } from './lru';
import type { CacheConfig, CacheStats } from './types';

export class CacheManager {
  private userStatsCache: LRUCache<UserStats>;
  private guildStatsCache: LRUCache<GuildStats>;
  private leaderboardCache: LRUCache<unknown[]>;
  private queryCache: LRUCache<unknown>;

  constructor(config: CacheConfig = {}) {
    const {
      userStatsSize = CACHE_DEFAULTS.USER_STATS_SIZE,
      guildStatsSize = CACHE_DEFAULTS.GUILD_STATS_SIZE,
      leaderboardSize = CACHE_DEFAULTS.LEADERBOARD_SIZE,
      ttlMs = CACHE_DEFAULTS.TTL_MS,
    } = config;

    this.userStatsCache = new LRUCache(userStatsSize, ttlMs);
    this.guildStatsCache = new LRUCache(guildStatsSize, ttlMs);
    this.leaderboardCache = new LRUCache(leaderboardSize, ttlMs);
    this.queryCache = new LRUCache(CACHE_DEFAULTS.QUERY_SIZE, ttlMs);
  }

  getUserStats(guildId: string, userId: string, days: number): UserStats | undefined {
    return this.userStatsCache.get(createUserStatsKey(guildId, userId, days));
  }

  setUserStats(guildId: string, userId: string, days: number, stats: UserStats): void {
    this.userStatsCache.set(createUserStatsKey(guildId, userId, days), stats);
  }

  getGuildStats(guildId: string, days: number): GuildStats | undefined {
    return this.guildStatsCache.get(createGuildStatsKey(guildId, days));
  }

  setGuildStats(guildId: string, days: number, stats: GuildStats): void {
    this.guildStatsCache.set(createGuildStatsKey(guildId, days), stats);
  }

  getLeaderboard(
    guildId: string,
    type: string,
    limit: number,
    days: number
  ): unknown[] | undefined {
    return this.leaderboardCache.get(createLeaderboardKey(guildId, type, limit, days));
  }

  setLeaderboard(
    guildId: string,
    type: string,
    limit: number,
    days: number,
    data: unknown[]
  ): void {
    this.leaderboardCache.set(createLeaderboardKey(guildId, type, limit, days), data);
  }

  getQuery<T>(key: string): T | undefined {
    return this.queryCache.get(key) as T | undefined;
  }

  setQuery<T>(key: string, data: T): void {
    this.queryCache.set(key, data);
  }

  invalidateUser(guildId: string, userId: string): void {
    const prefix = `${guildId}:${userId}:`;

    for (const key of this.userStatsCache.keys()) {
      if (key.startsWith(prefix)) this.userStatsCache.delete(key);
    }
  }

  invalidateGuild(guildId: string): void {
    const prefix = `${guildId}:`;

    for (const key of this.userStatsCache.keys()) {
      if (key.startsWith(prefix)) this.userStatsCache.delete(key);
    }

    for (const key of this.guildStatsCache.keys()) {
      if (key.startsWith(prefix)) this.guildStatsCache.delete(key);
    }

    for (const key of this.leaderboardCache.keys()) {
      if (key.startsWith(prefix)) this.leaderboardCache.delete(key);
    }
  }

  clear(): void {
    this.userStatsCache.clear();
    this.guildStatsCache.clear();
    this.leaderboardCache.clear();
    this.queryCache.clear();
  }

  getStats(): CacheStats {
    return {
      userStats: this.userStatsCache.size,
      guildStats: this.guildStatsCache.size,
      leaderboards: this.leaderboardCache.size,
      queries: this.queryCache.size,
    };
  }
}
