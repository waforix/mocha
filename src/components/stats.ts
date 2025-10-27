import {
  countMessageEventsByGuild,
  findGuildById,
  findMessageEventsByGuildAndDateRange,
  findVoiceEventsByGuildAndDateRange,
} from '../database';
import { BaseComponent } from './base';
import type { CacheComponent } from './cache';

interface UserMessageStats {
  totalMessages: number;
  averagePerDay: number;
  lastMessageDate: Date | null;
}

interface GuildStats {
  totalMessages: number;
  totalUsers: number;
  totalVoiceEvents: number;
}

interface TopUser {
  userId: string;
  messageCount: number;
}

/**
 * Statistics component for aggregating and retrieving stats
 * @category Components
 */
export class StatsComponent extends BaseComponent {
  private cache: CacheComponent;

  /**
   * Create a new stats component
   * @param cache - Cache component instance
   */
  constructor(cache: CacheComponent) {
    super();
    this.cache = cache;
  }

  /**
   * Get user message statistics
   * @param guildId - Guild ID
   * @param userId - User ID
   * @param days - Number of days to look back
   * @returns User message stats
   */
  async getUserMessageStats(guildId: string, userId: string, days = 30): Promise<UserMessageStats> {
    const cacheKey = `user_msg_stats:${guildId}:${userId}:${days}`;
    const cached = this.cache.get<UserMessageStats>(cacheKey);
    if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();

    const events = await findMessageEventsByGuildAndDateRange(guildId, startDate, endDate);

    const userEvents = events.filter((e) => e.userId === userId);
    const totalMessages = userEvents.length;
    const averagePerDay = totalMessages / days;
    const lastMessageDate = userEvents.length > 0 ? userEvents[0].timestamp : null;

    const stats = {
      totalMessages,
      averagePerDay,
      lastMessageDate,
    };

    this.cache.set(cacheKey, stats);
    return stats;
  }

  /**
   * Get guild statistics
   * @param guildId - Guild ID
   * @returns Guild stats
   */
  async getGuildStats(guildId: string): Promise<GuildStats> {
    const cacheKey = `guild_stats:${guildId}`;
    const cached = this.cache.get<GuildStats>(cacheKey);
    if (cached) return cached;

    const totalMessages = await countMessageEventsByGuild(guildId);
    const guild = await findGuildById(guildId);
    const totalUsers = guild?.memberCount || 0;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    const voiceEvents = await findVoiceEventsByGuildAndDateRange(guildId, startDate, endDate);

    const stats: GuildStats = {
      totalMessages,
      totalUsers,
      totalVoiceEvents: voiceEvents.length,
    };

    this.cache.set(cacheKey, stats);
    return stats;
  }

  /**
   * Get top users by message count
   * @param guildId - Guild ID
   * @param limit - Number of top users to return
   * @returns Array of top users with message counts
   */
  async getTopUsers(guildId: string, limit = 10): Promise<TopUser[]> {
    const cacheKey = `top_users:${guildId}:${limit}`;
    const cached = this.cache.get<TopUser[]>(cacheKey);
    if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    const events = await findMessageEventsByGuildAndDateRange(guildId, startDate, endDate);

    const userCounts = new Map<string, number>();
    for (const event of events) {
      userCounts.set(event.userId, (userCounts.get(event.userId) || 0) + 1);
    }

    const topUsers: TopUser[] = Array.from(userCounts.entries())
      .map(([userId, messageCount]) => ({ userId, messageCount }))
      .sort((a, b) => b.messageCount - a.messageCount)
      .slice(0, limit);

    this.cache.set(cacheKey, topUsers);
    return topUsers;
  }

  /**
   * Clear all cached statistics
   */
  clearCache(): void {
    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.includes('stats') || key.includes('top_users')) {
        this.cache.delete(key);
      }
    }
  }
}
