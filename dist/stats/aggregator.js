import { StatsQueries } from './queries';
export class StatsAggregator {
    queries;
    constructor(db) {
        this.queries = new StatsQueries(db);
    }
    async getUserStats(guildId, userId, days = 30) {
        const [messageStats, voiceStats] = await Promise.all([
            this.queries.getMessageStats(guildId, userId, days),
            this.queries.getVoiceStats(guildId, userId, days),
        ]);
        const messageData = messageStats[0] || { count: 0, attachments: 0, embeds: 0 };
        return {
            userId,
            messageCount: Number(messageData.count) || 0,
            voiceTime: Number(voiceStats?.totalTime) || 0,
            voiceSessions: Number(voiceStats?.sessions) || 0,
            attachments: Number(messageData.attachments) || 0,
            embeds: Number(messageData.embeds) || 0,
        };
    }
    async getGuildStats(guildId, days = 30) {
        const [messageStats, voiceStats, channelStats, memberGrowth] = await Promise.all([
            this.queries.getMessageStats(guildId, undefined, days),
            this.queries.getVoiceStats(guildId, undefined, days),
            this.queries.getChannelStats(guildId, days),
            this.queries.getMemberGrowth(guildId, days),
        ]);
        const messageData = messageStats[0] || { count: 0, attachments: 0, embeds: 0 };
        return {
            guildId,
            totalMessages: Number(messageData.count) || 0,
            totalVoiceTime: Number(voiceStats?.totalTime) || 0,
            activeUsers: channelStats.reduce((acc, ch) => acc + ch.uniqueUsers, 0),
            topChannels: channelStats.map((ch) => ({
                channelId: ch.channelId,
                name: ch.channelName || undefined,
                messageCount: Number(ch.messageCount),
                uniqueUsers: Number(ch.uniqueUsers),
            })),
            memberGrowth,
        };
    }
    async getLeaderboard(guildId, type, limit = 10, days = 30) {
        const topUsers = await this.queries.getTopUsers(guildId, type, limit, days);
        return topUsers.map((user, index) => ({
            rank: index + 1,
            userId: user.userId,
            username: user.username,
            value: type === 'messages'
                ? Number(user.count)
                : Number(user.totalTime || 0),
        }));
    }
    async getActivityHeatmap(guildId, userId, days = 7) {
        return await this.queries.getActivityTimeline(guildId, userId, days);
    }
}
