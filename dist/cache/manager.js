import { createGuildStatsKey, createLeaderboardKey, createUserStatsKey } from './keys';
import { LRUCache } from './lru';
export class CacheManager {
    userStatsCache;
    guildStatsCache;
    leaderboardCache;
    queryCache;
    constructor(config = {}) {
        const { userStatsSize = 1000, guildStatsSize = 100, leaderboardSize = 500, ttlMs = 300000, } = config;
        this.userStatsCache = new LRUCache(userStatsSize, ttlMs);
        this.guildStatsCache = new LRUCache(guildStatsSize, ttlMs);
        this.leaderboardCache = new LRUCache(leaderboardSize, ttlMs);
        this.queryCache = new LRUCache(2000, ttlMs);
    }
    getUserStats(guildId, userId, days) {
        return this.userStatsCache.get(createUserStatsKey(guildId, userId, days));
    }
    setUserStats(guildId, userId, days, stats) {
        this.userStatsCache.set(createUserStatsKey(guildId, userId, days), stats);
    }
    getGuildStats(guildId, days) {
        return this.guildStatsCache.get(createGuildStatsKey(guildId, days));
    }
    setGuildStats(guildId, days, stats) {
        this.guildStatsCache.set(createGuildStatsKey(guildId, days), stats);
    }
    getLeaderboard(guildId, type, limit, days) {
        return this.leaderboardCache.get(createLeaderboardKey(guildId, type, limit, days));
    }
    setLeaderboard(guildId, type, limit, days, data) {
        this.leaderboardCache.set(createLeaderboardKey(guildId, type, limit, days), data);
    }
    getQuery(key) {
        return this.queryCache.get(key);
    }
    setQuery(key, data) {
        this.queryCache.set(key, data);
    }
    invalidateUser(guildId, userId) {
        const prefix = `${guildId}:${userId}:`;
        for (const key of this.userStatsCache.keys()) {
            if (key.startsWith(prefix))
                this.userStatsCache.delete(key);
        }
    }
    invalidateGuild(guildId) {
        const prefix = `${guildId}:`;
        for (const key of this.userStatsCache.keys()) {
            if (key.startsWith(prefix))
                this.userStatsCache.delete(key);
        }
        for (const key of this.guildStatsCache.keys()) {
            if (key.startsWith(prefix))
                this.guildStatsCache.delete(key);
        }
        for (const key of this.leaderboardCache.keys()) {
            if (key.startsWith(prefix))
                this.leaderboardCache.delete(key);
        }
    }
    clear() {
        this.userStatsCache.clear();
        this.guildStatsCache.clear();
        this.leaderboardCache.clear();
        this.queryCache.clear();
    }
    getStats() {
        return {
            userStats: this.userStatsCache.size,
            guildStats: this.guildStatsCache.size,
            leaderboards: this.leaderboardCache.size,
            queries: this.queryCache.size,
        };
    }
}
