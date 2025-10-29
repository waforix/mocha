import type { CommonDatabase } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class VoiceQueries {
  constructor(private db: CommonDatabase) {}

  /**
   * Get voice statistics for a guild
   */
  async getStats(guildId: string, userId?: string, days = 30) {
    const since = createDateSince(days);

    const result = await this.db.voiceEvent.aggregate({
      where: {
        guildId,
        userId,
        action: 'leave',
        timestamp: {
          gte: since,
        },
      },
      _sum: {
        duration: true,
      },
      _count: true,
    });

    return {
      totalTime: result._sum.duration || 0,
      sessions: result._count,
    };
  }
}
