import { and, count, eq, gte, sql, sum } from 'drizzle-orm';
import type { getDb } from '../../db/index';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class MessageQueries {
  constructor(private db: ReturnType<typeof getDb>) {}

  async getStats(guildId: string, userId?: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        count: count(),
        attachments: sum(schema.messageEvents.attachmentCount),
        embeds: sum(schema.messageEvents.embedCount),
      })
      .from(schema.messageEvents)
      .where(
        and(
          eq(schema.messageEvents.guildId, guildId),
          gte(schema.messageEvents.timestamp, since),
          userId ? eq(schema.messageEvents.userId, userId) : undefined
        )
      );
  }

  async getTimeline(guildId: string, userId?: string, days = 7) {
    const since = createDateSince(days);

    return await this.db
      .select({
        hour: sql<number>`strftime('%H', ${schema.messageEvents.timestamp})`,
        count: count(),
      })
      .from(schema.messageEvents)
      .where(
        and(
          eq(schema.messageEvents.guildId, guildId),
          gte(schema.messageEvents.timestamp, since),
          userId ? eq(schema.messageEvents.userId, userId) : undefined
        )
      )
      .groupBy(sql`strftime('%H', ${schema.messageEvents.timestamp})`)
      .orderBy(sql`strftime('%H', ${schema.messageEvents.timestamp})`);
  }
}
