import { and, count, desc, eq, gte, sql } from 'drizzle-orm';
import type { getDb } from '../../db/index';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class ChannelQueries {
  constructor(private db: ReturnType<typeof getDb>) {}

  async getStats(guildId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        channelId: schema.messageEvents.channelId,
        channelName: schema.channels.name,
        messageCount: count(),
        uniqueUsers: sql<number>`COUNT(DISTINCT ${schema.messageEvents.userId})`,
      })
      .from(schema.messageEvents)
      .innerJoin(schema.channels, eq(schema.messageEvents.channelId, schema.channels.id))
      .where(
        and(eq(schema.messageEvents.guildId, guildId), gte(schema.messageEvents.timestamp, since))
      )
      .groupBy(schema.messageEvents.channelId, schema.channels.name)
      .orderBy(desc(count()));
  }
}
