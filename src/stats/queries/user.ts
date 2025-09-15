import { and, count, desc, eq, gte, sum } from 'drizzle-orm';
import type { CommonDatabase } from '../../db/index';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class UserQueries {
  constructor(private db: CommonDatabase) {}

  async getTop(guildId: string, type: 'messages' | 'voice', limit = 10, days = 30) {
    const since = createDateSince(days);

    if (type === 'messages') {
      return await this.db
        .select({
          userId: schema.messageEvents.userId,
          username: schema.users.username,
          count: count(),
        })
        .from(schema.messageEvents)
        .innerJoin(schema.users, eq(schema.messageEvents.userId, schema.users.id))
        .where(
          and(eq(schema.messageEvents.guildId, guildId), gte(schema.messageEvents.timestamp, since))
        )
        .groupBy(schema.messageEvents.userId, schema.users.username)
        .orderBy(desc(count()))
        .limit(limit);
    }

    return await this.db
      .select({
        userId: schema.voiceEvents.userId,
        username: schema.users.username,
        totalTime: sum(schema.voiceEvents.duration),
      })
      .from(schema.voiceEvents)
      .innerJoin(schema.users, eq(schema.voiceEvents.userId, schema.users.id))
      .where(
        and(
          eq(schema.voiceEvents.guildId, guildId),
          eq(schema.voiceEvents.action, 'leave'),
          gte(schema.voiceEvents.timestamp, since)
        )
      )
      .groupBy(schema.voiceEvents.userId, schema.users.username)
      .orderBy(desc(sum(schema.voiceEvents.duration)))
      .limit(limit);
  }
}
