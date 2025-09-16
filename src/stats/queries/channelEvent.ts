import { and, count, desc, eq, gte } from 'drizzle-orm';
import type { CommonDatabase } from '../../db/index';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class ChannelEventQueries {
  constructor(private db: CommonDatabase) {}

  async getChannelEventStats(guildId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        action: schema.channelEvents.action,
        channelType: schema.channelEvents.channelType,
        isThread: schema.channelEvents.isThread,
        count: count(),
      })
      .from(schema.channelEvents)
      .where(
        and(eq(schema.channelEvents.guildId, guildId), gte(schema.channelEvents.timestamp, since))
      )
      .groupBy(
        schema.channelEvents.action,
        schema.channelEvents.channelType,
        schema.channelEvents.isThread
      )
      .orderBy(desc(count()));
  }

  async getChannelEventsByType(guildId: string, channelType: number, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        action: schema.channelEvents.action,
        channelId: schema.channelEvents.channelId,
        name: schema.channelEvents.name,
        count: count(),
      })
      .from(schema.channelEvents)
      .where(
        and(
          eq(schema.channelEvents.guildId, guildId),
          eq(schema.channelEvents.channelType, channelType),
          gte(schema.channelEvents.timestamp, since)
        )
      )
      .groupBy(
        schema.channelEvents.action,
        schema.channelEvents.channelId,
        schema.channelEvents.name
      )
      .orderBy(desc(count()));
  }

  async getThreadStats(guildId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        threadId: schema.channelEvents.threadId,
        action: schema.channelEvents.action,
        name: schema.channelEvents.name,
        parentId: schema.channelEvents.parentId,
        count: count(),
      })
      .from(schema.channelEvents)
      .where(
        and(
          eq(schema.channelEvents.guildId, guildId),
          eq(schema.channelEvents.isThread, true),
          gte(schema.channelEvents.timestamp, since)
        )
      )
      .groupBy(
        schema.channelEvents.threadId,
        schema.channelEvents.action,
        schema.channelEvents.name,
        schema.channelEvents.parentId
      )
      .orderBy(desc(count()));
  }
}
