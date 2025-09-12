export interface CacheConfig {
    userStatsSize?: number;
    guildStatsSize?: number;
    leaderboardSize?: number;
    ttlMs?: number;
}
export interface CacheStats {
    userStats: number;
    guildStats: number;
    leaderboards: number;
    queries: number;
}
