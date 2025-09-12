export declare const createUserStatsKey: (guildId: string, userId: string, days: number) => string;
export declare const createGuildStatsKey: (guildId: string, days: number) => string;
export declare const createLeaderboardKey: (guildId: string, type: string, limit: number, days: number) => string;
export declare const createHeatmapKey: (guildId: string, userId: string | undefined, days: number) => string;
