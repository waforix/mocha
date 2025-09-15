export const createUserStatsKey = (guildId: string, userId: string, days: number): string =>
  `${guildId}:${userId}:${days}`;

export const createGuildStatsKey = (guildId: string, days: number): string => `${guildId}:${days}`;

export const createLeaderboardKey = (
  guildId: string,
  type: string,
  limit: number,
  days: number
): string => `${guildId}:${type}:${limit}:${days}`;

export const createHeatmapKey = (
  guildId: string,
  userId: string | undefined,
  days: number
): string => `heatmap:${guildId}:${userId || 'all'}:${days}`;
