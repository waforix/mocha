import { and, count, desc, eq, gte } from 'drizzle-orm';
import type { CommonDatabase } from '../../db/index';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class InviteQueries {
  constructor(private db: CommonDatabase) {}

  async getInviteStats(guildId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        action: schema.inviteEvents.action,
        inviterId: schema.inviteEvents.inviterId,
        inviterUsername: schema.users.username,
        count: count(),
      })
      .from(schema.inviteEvents)
      .leftJoin(schema.users, eq(schema.inviteEvents.inviterId, schema.users.id))
      .where(
        and(
          eq(schema.inviteEvents.guildId, guildId),
          gte(schema.inviteEvents.timestamp, since)
        )
      )
      .groupBy(
        schema.inviteEvents.action,
        schema.inviteEvents.inviterId,
        schema.users.username
      )
      .orderBy(desc(count()));
  }

  async getTopInviters(guildId: string, limit = 10, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        inviterId: schema.inviteEvents.inviterId,
        inviterUsername: schema.users.username,
        count: count(),
      })
      .from(schema.inviteEvents)
      .innerJoin(schema.users, eq(schema.inviteEvents.inviterId, schema.users.id))
      .where(
        and(
          eq(schema.inviteEvents.guildId, guildId),
          eq(schema.inviteEvents.action, 'create'),
          gte(schema.inviteEvents.timestamp, since)
        )
      )
      .groupBy(schema.inviteEvents.inviterId, schema.users.username)
      .orderBy(desc(count()))
      .limit(limit);
  }

  async getInviteActivity(guildId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        inviteCode: schema.inviteEvents.inviteCode,
        action: schema.inviteEvents.action,
        inviterId: schema.inviteEvents.inviterId,
        inviterUsername: schema.users.username,
        channelId: schema.inviteEvents.channelId,
        timestamp: schema.inviteEvents.timestamp,
      })
      .from(schema.inviteEvents)
      .leftJoin(schema.users, eq(schema.inviteEvents.inviterId, schema.users.id))
      .where(
        and(
          eq(schema.inviteEvents.guildId, guildId),
          gte(schema.inviteEvents.timestamp, since)
        )
      )
      .orderBy(desc(schema.inviteEvents.timestamp));
  }
}
