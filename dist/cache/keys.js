export const createUserStatsKey = (guildId, userId, days) => `${guildId}:${userId}:${days}`;
export const createGuildStatsKey = (guildId, days) => `${guildId}:${days}`;
export const createLeaderboardKey = (guildId, type, limit, days) => `${guildId}:${type}:${limit}:${days}`;
export const createHeatmapKey = (guildId, userId, days) => `heatmap:${guildId}:${userId || 'all'}:${days}`;
