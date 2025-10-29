import { Prisma } from '@prisma/client';
import type { CommonDatabase } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class ReactionQueries {
  constructor(private db: CommonDatabase) {}

  /**
   * Get reaction statistics by action type
   */
  async getReactionStats(guildId: string, userId?: string, days = 30) {
    const since = createDateSince(days);

    const userFilter = userId ? Prisma.sql`AND "userId" = ${userId}` : Prisma.empty;

    const results = await this.db.$queryRaw<Array<{ action: string; count: bigint }>>`
      SELECT
        "action",
        COUNT(*) as count
      FROM "ReactionEvent"
      WHERE "guildId" = ${guildId}
        AND "timestamp" >= ${since}
        ${userFilter}
      GROUP BY "action"
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
        "emojiId",
        "emojiName",
        "emojiAnimated",
        COUNT(*) as count
      FROM "ReactionEvent"
      WHERE "guildId" = ${guildId}
        AND "action" = 'add'
        AND "timestamp" >= ${since}
      GROUP BY "emojiId", "emojiName"
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    return results.map(
      (r: {
        emojiId: string | null;
        emojiName: string | null;
        emojiAnimated: number;
        count: bigint;
      }) => ({
        emojiId: r.emojiId,
        emojiName: r.emojiName,
        emojiAnimated: Boolean(r.emojiAnimated),
        count: Number(r.count),
      })
    );
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
        r."userId",
        u."username",
        COUNT(*) as reactions
      FROM "ReactionEvent" r
      LEFT JOIN "User" u ON u."id" = r."userId"
      WHERE r."guildId" = ${guildId}
        AND r."action" = 'add'
        AND r."timestamp" >= ${since}
      GROUP BY r."userId", u."username"
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

    const rawResults = await this.db.$queryRaw<
      Array<{
        timestamp: Date;
      }>
    >`
      SELECT
        "timestamp"
      FROM "ReactionEvent"
      WHERE "guildId" = ${guildId}
        AND "action" = 'add'
        AND "timestamp" >= ${since}
    `;

    // Aggregate by date and hour in JavaScript
    const buckets = new Map<string, number>();

    for (const row of rawResults) {
      const ts = row.timestamp instanceof Date ? row.timestamp : new Date(row.timestamp);
      const date = ts.toISOString().split('T')[0]; // YYYY-MM-DD
      const hour = ts.getUTCHours();
      const key = `${date}:${hour}`;

      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }

    // Convert to sorted array
    const results: Array<{ date: string; hour: number; reactions: number }> = [];
    for (const [key, count] of buckets) {
      const [date, hourStr] = key.split(':');
      results.push({
        date,
        hour: parseInt(hourStr, 10),
        reactions: count,
      });
    }

    // Sort by date, then hour
    results.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.hour - b.hour;
    });

    return results;
  }
}
