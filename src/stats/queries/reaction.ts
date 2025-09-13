import { and, count, desc, eq, gte, sql } from 'drizzle-orm';
import type { getDb } from '../../db/index';
import { reactionEvents, users } from '../../db/schema/index';
import { createDateSince } from '../../utils/date';

export class ReactionQueries {
  constructor(private db: ReturnType<typeof getDb>) {}

  async getReactionStats(guildId: string, userId?: string, days = 30) {
    const since = createDateSince(days);
    const conditions = [eq(reactionEvents.guildId, guildId), gte(reactionEvents.timestamp, since)];

    if (userId) {
      conditions.push(eq(reactionEvents.userId, userId));
    }

    return await this.db
      .select({
        action: reactionEvents.action,
        count: count(),
      })
      .from(reactionEvents)
      .where(and(...conditions))
      .groupBy(reactionEvents.action);
  }

  async getTopEmojis(guildId: string, limit = 10, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        emojiId: reactionEvents.emojiId,
        emojiName: reactionEvents.emojiName,
        emojiAnimated: reactionEvents.emojiAnimated,
        count: count(),
      })
      .from(reactionEvents)
      .where(
        and(
          eq(reactionEvents.guildId, guildId),
          eq(reactionEvents.action, 'add'),
          gte(reactionEvents.timestamp, since)
        )
      )
      .groupBy(reactionEvents.emojiId, reactionEvents.emojiName)
      .orderBy(desc(count()))
      .limit(limit);
  }

  async getTopReactors(guildId: string, limit = 10, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        userId: reactionEvents.userId,
        username: users.username,
        reactions: count(),
      })
      .from(reactionEvents)
      .leftJoin(users, eq(users.id, reactionEvents.userId))
      .where(
        and(
          eq(reactionEvents.guildId, guildId),
          eq(reactionEvents.action, 'add'),
          gte(reactionEvents.timestamp, since)
        )
      )
      .groupBy(reactionEvents.userId)
      .orderBy(desc(count()))
      .limit(limit);
  }

  async getReactionTimeline(guildId: string, days = 7) {
    const since = createDateSince(days);

    return await this.db
      .select({
        date: sql<string>`date(${reactionEvents.timestamp})`,
        hour: sql<number>`cast(strftime('%H', ${reactionEvents.timestamp}) as integer)`,
        reactions: count(),
      })
      .from(reactionEvents)
      .where(
        and(
          eq(reactionEvents.guildId, guildId),
          eq(reactionEvents.action, 'add'),
          gte(reactionEvents.timestamp, since)
        )
      )
      .groupBy(
        sql`date(${reactionEvents.timestamp})`,
        sql`strftime('%H', ${reactionEvents.timestamp})`
      )
      .orderBy(sql`date`, sql`hour`);
  }
}
