import { and, count, desc, eq, gte } from 'drizzle-orm';
import type { CommonDatabase } from '../../db/index';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class RoleQueries {
  constructor(private db: CommonDatabase) {}

  async getRoleEventStats(guildId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        action: schema.roleEvents.action,
        count: count(),
      })
      .from(schema.roleEvents)
      .where(
        and(
          eq(schema.roleEvents.guildId, guildId),
          gte(schema.roleEvents.timestamp, since)
        )
      )
      .groupBy(schema.roleEvents.action)
      .orderBy(desc(count()));
  }

  async getRoleEventsByRole(guildId: string, roleId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        action: schema.roleEvents.action,
        name: schema.roleEvents.name,
        color: schema.roleEvents.color,
        position: schema.roleEvents.position,
        timestamp: schema.roleEvents.timestamp,
      })
      .from(schema.roleEvents)
      .where(
        and(
          eq(schema.roleEvents.guildId, guildId),
          eq(schema.roleEvents.roleId, roleId),
          gte(schema.roleEvents.timestamp, since)
        )
      )
      .orderBy(desc(schema.roleEvents.timestamp));
  }

  async getMostActiveRoles(guildId: string, limit = 10, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        roleId: schema.roleEvents.roleId,
        name: schema.roleEvents.name,
        count: count(),
      })
      .from(schema.roleEvents)
      .where(
        and(
          eq(schema.roleEvents.guildId, guildId),
          gte(schema.roleEvents.timestamp, since)
        )
      )
      .groupBy(schema.roleEvents.roleId, schema.roleEvents.name)
      .orderBy(desc(count()))
      .limit(limit);
  }
}
