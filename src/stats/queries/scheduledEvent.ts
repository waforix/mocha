import { and, count, desc, eq, gte } from 'drizzle-orm';
import type { CommonDatabase } from '../../db/index';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class ScheduledEventQueries {
  constructor(private db: CommonDatabase) {}

  async getScheduledEventStats(guildId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        action: schema.scheduledEvents.action,
        eventId: schema.scheduledEvents.eventId,
        name: schema.scheduledEvents.name,
        count: count(),
      })
      .from(schema.scheduledEvents)
      .where(
        and(
          eq(schema.scheduledEvents.guildId, guildId),
          gte(schema.scheduledEvents.timestamp, since)
        )
      )
      .groupBy(
        schema.scheduledEvents.action,
        schema.scheduledEvents.eventId,
        schema.scheduledEvents.name
      )
      .orderBy(desc(count()));
  }

  async getEventParticipation(guildId: string, eventId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        action: schema.scheduledEvents.action,
        userId: schema.scheduledEvents.userId,
        username: schema.users.username,
        timestamp: schema.scheduledEvents.timestamp,
      })
      .from(schema.scheduledEvents)
      .leftJoin(schema.users, eq(schema.scheduledEvents.userId, schema.users.id))
      .where(
        and(
          eq(schema.scheduledEvents.guildId, guildId),
          eq(schema.scheduledEvents.eventId, eventId),
          gte(schema.scheduledEvents.timestamp, since)
        )
      )
      .orderBy(desc(schema.scheduledEvents.timestamp));
  }

  async getMostActiveEvents(guildId: string, limit = 10, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        eventId: schema.scheduledEvents.eventId,
        name: schema.scheduledEvents.name,
        count: count(),
      })
      .from(schema.scheduledEvents)
      .where(
        and(
          eq(schema.scheduledEvents.guildId, guildId),
          gte(schema.scheduledEvents.timestamp, since)
        )
      )
      .groupBy(schema.scheduledEvents.eventId, schema.scheduledEvents.name)
      .orderBy(desc(count()))
      .limit(limit);
  }
}
