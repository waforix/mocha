import type { getDb } from '../db/index';
export interface UserStats {
    userId: string;
    username?: string;
    messageCount: number;
    voiceTime: number;
    voiceSessions: number;
    attachments: number;
    embeds: number;
    rank?: number;
}
export interface GuildStats {
    guildId: string;
    totalMessages: number;
    totalVoiceTime: number;
    activeUsers: number;
    topChannels: Array<{
        channelId: string;
        name?: string;
        messageCount: number;
        uniqueUsers: number;
    }>;
    memberGrowth: {
        joins: Array<{
            date: string;
            joins: number;
        }>;
        leaves: Array<{
            date: string;
            leaves: number;
        }>;
    };
}
export declare class StatsAggregator {
    private queries;
    constructor(db: ReturnType<typeof getDb>);
    getUserStats(guildId: string, userId: string, days?: number): Promise<UserStats>;
    getGuildStats(guildId: string, days?: number): Promise<GuildStats>;
    getLeaderboard(guildId: string, type: 'messages' | 'voice', limit?: number, days?: number): Promise<{
        rank: number;
        userId: string;
        username: string;
        value: number;
    }[]>;
    getActivityHeatmap(guildId: string, userId?: string, days?: number): Promise<{
        hour: number;
        count: number;
    }[]>;
}
