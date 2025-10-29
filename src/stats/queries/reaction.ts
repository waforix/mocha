import type { CommonDatabase } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class ReactionQueries {
  constructor(private db: CommonDatabase) {}

  /**
   * Get reaction statistics by action type
   */
  async getReactionStats(guildId: string, userId?: string, days = 30) {
    const since = createDateSince(days);

    const results = await this.db.$queryRaw<Array<{ action: string; count: bigint }>>`
      SELECT
        action,
        COUNT(*) as count
      FROM reactionevent
      WHERE guildId = ${guildId}
        AND timestamp >= ${since}
        ${userId ? `AND userId = ${userId}` : ''}
      GROUP BY action
    `;

    return results.map((r: { action: string; count: bigint }) => ({
      action: r.action,
      count: Number(r.count),
    }));
  }

  /**
   * Get top emojis by usage
   */
  async getTopEmojis(guildId: string, limit = 10, days = 30) {
    const since = createDateSince(days);

    const results = await this.db.$queryRaw<
      Array<{
        emojiId: string | null;
        emojiName: string;
        emojiAnimated: number;
        count: bigint;
      }>
    >`
      SELECT
        emojiId,
        emojiName,
        emojiAnimated,
        COUNT(*) as count
      FROM reactionevent
      WHERE guildId = ${guildId}
        AND action = 'add'
        AND timestamp >= ${since}
      GROUP BY emojiId, emojiName
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    return results.map((r: { emojiId: string | null; emojiName: string | null; emojiAnimated: number; count: bigint }) => ({
      emojiId: r.emojiId,
      emojiName: r.emojiName,
      emojiAnimated: Boolean(r.emojiAnimated),
      count: Number(r.count),
    }));
  }

  /**
   * Get top users by reaction count
   */
  async getTopReactors(guildId: string, limit = 10, days = 30) {
    const since = createDateSince(days);

    const results = await this.db.$queryRaw<
      Array<{
        userId: string;
        username: string;
        reactions: bigint;
      }>
    >`
      SELECT
        r.userId,
        u.username,
        COUNT(*) as reactions
      FROM reactionevent r
      LEFT JOIN user u ON u.id = r.userId
      WHERE r.guildId = ${guildId}
        AND r.action = 'add'
        AND r.timestamp >= ${since}
      GROUP BY r.userId
      ORDER BY reactions DESC
      LIMIT ${limit}
    `;

    return results.map((r: { userId: string; username: string; reactions: bigint }) => ({
      userId: r.userId,
      username: r.username,
      reactions: Number(r.reactions),
    }));
  }

  /**
   * Get reaction timeline by date and hour
   */
  async getReactionTimeline(guildId: string, days = 7) {
    const since = createDateSince(days);

    const results = await this.db.$queryRaw<
      Array<{
        date: string;
        hour: number;
        reactions: bigint;
      }>
    >`
      SELECT
        date(timestamp) as date,
        CAST(strftime('%H', timestamp) AS INTEGER) as hour,
        COUNT(*) as reactions
      FROM reactionevent
      WHERE guildId = ${guildId}
        AND action = 'add'
        AND timestamp >= ${since}
      GROUP BY date(timestamp), strftime('%H', timestamp)
      ORDER BY date, hour
    `;

    return results.map((r: { date: string; hour: number; reactions: bigint }) => ({
      date: r.date,
      hour: r.hour,
      reactions: Number(r.reactions),
    }));
  }
}
