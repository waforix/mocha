import { and, count, desc, eq, gte } from 'drizzle-orm';
import type { CommonDatabase } from '../../db/index';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class InteractionQueries {
  constructor(private db: CommonDatabase) {}

  async getInteractionStats(guildId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        interactionType: schema.interactionEvents.interactionType,
        commandName: schema.interactionEvents.commandName,
        count: count(),
      })
      .from(schema.interactionEvents)
      .where(
        and(
          eq(schema.interactionEvents.guildId, guildId),
          gte(schema.interactionEvents.timestamp, since)
        )
      )
      .groupBy(schema.interactionEvents.interactionType, schema.interactionEvents.commandName)
      .orderBy(desc(count()));
  }

  async getTopInteractionUsers(guildId: string, limit = 10, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        userId: schema.interactionEvents.userId,
        username: schema.users.username,
        count: count(),
      })
      .from(schema.interactionEvents)
      .innerJoin(schema.users, eq(schema.interactionEvents.userId, schema.users.id))
      .where(
        and(
          eq(schema.interactionEvents.guildId, guildId),
          gte(schema.interactionEvents.timestamp, since)
        )
      )
      .groupBy(schema.interactionEvents.userId, schema.users.username)
      .orderBy(desc(count()))
      .limit(limit);
  }

  async getCommandStats(guildId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        commandName: schema.interactionEvents.commandName,
        count: count(),
      })
      .from(schema.interactionEvents)
      .where(
        and(
          eq(schema.interactionEvents.guildId, guildId),
          eq(schema.interactionEvents.interactionType, 2),
          gte(schema.interactionEvents.timestamp, since)
        )
      )
      .groupBy(schema.interactionEvents.commandName)
      .orderBy(desc(count()));
  }

  async getInteractionsByType(guildId: string, interactionType: number, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        commandName: schema.interactionEvents.commandName,
        customId: schema.interactionEvents.customId,
        userId: schema.interactionEvents.userId,
        username: schema.users.username,
        timestamp: schema.interactionEvents.timestamp,
      })
      .from(schema.interactionEvents)
      .innerJoin(schema.users, eq(schema.interactionEvents.userId, schema.users.id))
      .where(
        and(
          eq(schema.interactionEvents.guildId, guildId),
          eq(schema.interactionEvents.interactionType, interactionType),
          gte(schema.interactionEvents.timestamp, since)
        )
      )
      .orderBy(desc(schema.interactionEvents.timestamp));
  }
}
