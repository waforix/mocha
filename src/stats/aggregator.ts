import type { CommonDatabase } from '../db/index';
import { StatsQueries } from './queries';

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
    joins: Array<{ date: string; joins: number }>;
    leaves: Array<{ date: string; leaves: number }>;
  };
}

export class StatsAggregator {
  private queries: StatsQueries;

  constructor(db: CommonDatabase) {
    this.queries = new StatsQueries(db);
  }

  async getUserStats(guildId: string, userId: string, days = 30): Promise<UserStats> {
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

  async getGuildStats(guildId: string, days = 30): Promise<GuildStats> {
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
      activeUsers: channelStats.reduce(
        (acc: number, ch: Record<string, unknown>) => acc + (ch.uniqueUsers as number),
        0
      ),
      topChannels: channelStats.map((ch: Record<string, unknown>) => ({
        channelId: ch.channelId,
        name: ch.channelName || undefined,
        messageCount: Number(ch.messageCount),
        uniqueUsers: Number(ch.uniqueUsers),
      })),
      memberGrowth,
    };
  }

  async getLeaderboard(guildId: string, type: 'messages' | 'voice', limit = 10, days = 30) {
    const topUsers = await this.queries.getTopUsers(guildId, type, limit, days);

    return topUsers.map((user: Record<string, unknown>, index: number) => ({
      rank: index + 1,
      userId: user.userId,
      username: user.username,
      value:
        type === 'messages'
          ? Number((user as Record<string, unknown>).count)
          : Number((user as Record<string, unknown>).totalTime || 0),
    }));
  }

  async getActivityHeatmap(guildId: string, userId?: string, days = 7) {
    return await this.queries.getActivityTimeline(guildId, userId, days);
  }
}
