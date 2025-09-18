import { and, count, eq, gte, type SQL, sql, sum } from 'drizzle-orm';
import type { CommonDatabase } from '../../db/index';
import { toTimestamp } from '../../db/utils';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class MessageQueries {
  constructor(private db: CommonDatabase) {}

  async getStats(guildId: string, userId?: string, days = 30) {
    const since = createDateSince(days);

    const conditions: SQL[] = [
      eq(schema.messageEvents.guildId, guildId),
      gte(schema.messageEvents.timestamp, toTimestamp(since)),
    ];

    if (userId) {
      conditions.push(eq(schema.messageEvents.userId, userId));
    }

    return await this.db
      .select({
        count: count(),
        attachments: sum(schema.messageEvents.attachmentCount),
        embeds: sum(schema.messageEvents.embedCount),
      })
      .from(schema.messageEvents)
      .where(and(...conditions))
      .execute();
  }

  async getTimeline(guildId: string, userId?: string, days = 7) {
    const since = createDateSince(days);

    const conditions = [
      eq(schema.messageEvents.guildId, guildId),
      gte(schema.messageEvents.timestamp, toTimestamp(since)),
    ];

    if (userId) {
      conditions.push(eq(schema.messageEvents.userId, userId));
    }

    return await this.db
      .select({
        hour: sql<number>`strftime('%H', ${schema.messageEvents.timestamp})`,
        count: count(),
      })
      .from(schema.messageEvents)
      .where(and(...conditions))
      .groupBy(sql`strftime('%H', ${schema.messageEvents.timestamp})`)
      .orderBy(sql`strftime('%H', ${schema.messageEvents.timestamp})`)
      .execute();
  }
}
