import { and, count, eq, gte, sum } from 'drizzle-orm';
import type { CommonDatabase } from '../../db/index';
import { toTimestamp } from '../../db/utils';
import { schema } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class VoiceQueries {
  constructor(private db: CommonDatabase) {}

  async getStats(guildId: string, userId?: string, days = 30) {
    const since = createDateSince(days);

    const result = await this.db
      .select({
        totalTime: sum(schema.voiceEvents.duration),
        sessions: count(),
      })
      .from(schema.voiceEvents)
      .where(
        and(
          eq(schema.voiceEvents.guildId, guildId),
          eq(schema.voiceEvents.action, 'leave'),
          gte(schema.voiceEvents.timestamp, toTimestamp(since)),
          userId ? eq(schema.voiceEvents.userId, userId) : undefined
        )
      );

    return result[0];
  }
}
