import { and, count, desc, eq, gte } from 'drizzle-orm';
import type { CommonDatabase } from '../../db/index';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class AutoModerationQueries {
  constructor(private db: CommonDatabase) {}

  async getAutoModerationStats(guildId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        action: schema.autoModerationEvents.action,
        ruleId: schema.autoModerationEvents.ruleId,
        ruleName: schema.autoModerationEvents.ruleName,
        triggerType: schema.autoModerationEvents.triggerType,
        actionType: schema.autoModerationEvents.actionType,
        count: count(),
      })
      .from(schema.autoModerationEvents)
      .where(
        and(
          eq(schema.autoModerationEvents.guildId, guildId),
          gte(schema.autoModerationEvents.timestamp, since)
        )
      )
      .groupBy(
        schema.autoModerationEvents.action,
        schema.autoModerationEvents.ruleId,
        schema.autoModerationEvents.ruleName,
        schema.autoModerationEvents.triggerType,
        schema.autoModerationEvents.actionType
      )
      .orderBy(desc(count()));
  }

  async getRuleExecutions(guildId: string, ruleId: string, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        userId: schema.autoModerationEvents.userId,
        username: schema.users.username,
        channelId: schema.autoModerationEvents.channelId,
        messageId: schema.autoModerationEvents.messageId,
        actionType: schema.autoModerationEvents.actionType,
        timestamp: schema.autoModerationEvents.timestamp,
      })
      .from(schema.autoModerationEvents)
      .leftJoin(schema.users, eq(schema.autoModerationEvents.userId, schema.users.id))
      .where(
        and(
          eq(schema.autoModerationEvents.guildId, guildId),
          eq(schema.autoModerationEvents.ruleId, ruleId),
          eq(schema.autoModerationEvents.action, 'execution'),
          gte(schema.autoModerationEvents.timestamp, since)
        )
      )
      .orderBy(desc(schema.autoModerationEvents.timestamp));
  }

  async getMostTriggeredRules(guildId: string, limit = 10, days = 30) {
    const since = createDateSince(days);

    return await this.db
      .select({
        ruleId: schema.autoModerationEvents.ruleId,
        ruleName: schema.autoModerationEvents.ruleName,
        triggerType: schema.autoModerationEvents.triggerType,
        count: count(),
      })
      .from(schema.autoModerationEvents)
      .where(
        and(
          eq(schema.autoModerationEvents.guildId, guildId),
          eq(schema.autoModerationEvents.action, 'execution'),
          gte(schema.autoModerationEvents.timestamp, since)
        )
      )
      .groupBy(
        schema.autoModerationEvents.ruleId,
        schema.autoModerationEvents.ruleName,
        schema.autoModerationEvents.triggerType
      )
      .orderBy(desc(count()))
      .limit(limit);
  }
}
