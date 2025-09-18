import { and, count, eq, gte, sql } from 'drizzle-orm';
import type { CommonDatabase } from '../../db/index';
import { toTimestamp } from '../../db/utils';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class MemberQueries {
  constructor(private db: CommonDatabase) {}

  async getGrowth(guildId: string, days = 30) {
    const since = createDateSince(days);

    const joins = await this.db
      .select({
        date: sql<string>`date(${schema.memberEvents.timestamp})`,
        joins: count(),
      })
      .from(schema.memberEvents)
      .where(
        and(
          eq(schema.memberEvents.guildId, guildId),
          eq(schema.memberEvents.action, 'join'),
          gte(schema.memberEvents.timestamp, toTimestamp(since))
        )
      )
      .groupBy(sql`date(${schema.memberEvents.timestamp})`);

    const leaves = await this.db
      .select({
        date: sql<string>`date(${schema.memberEvents.timestamp})`,
        leaves: count(),
      })
      .from(schema.memberEvents)
      .where(
        and(
          eq(schema.memberEvents.guildId, guildId),
          eq(schema.memberEvents.action, 'leave'),
          gte(schema.memberEvents.timestamp, toTimestamp(since))
        )
      )
      .groupBy(sql`date(${schema.memberEvents.timestamp})`);

    return { joins, leaves };
  }
}
