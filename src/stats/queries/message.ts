import type { CommonDatabase } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class MessageQueries {
  constructor(private db: CommonDatabase) {}

  /**
   * Get message statistics for a guild
   */
  async getStats(guildId: string, userId?: string, days = 30) {
    const since = createDateSince(days);

    const result = await this.db.messageEvent.aggregate({
      where: {
        guildId,
        userId,
        timestamp: {
          gte: since,
        },
      },
      _count: true,
      _sum: {
        attachmentCount: true,
        embedCount: true,
      },
    });

    return [
      {
        count: result._count,
        attachments: result._sum.attachmentCount || 0,
        embeds: result._sum.embedCount || 0,
      },
    ];
  }

  /**
   * Get message timeline by hour
   */
  async getTimeline(guildId: string, userId?: string, days = 7) {
    const since = createDateSince(days);

    const results = await this.db.$queryRaw<Array<{ hour: number; count: bigint }>>`
      SELECT
        CAST(strftime('%H', timestamp) AS INTEGER) as hour,
        COUNT(*) as count
      FROM messageevent
      WHERE guildId = ${guildId}
        AND timestamp >= ${since}
        ${userId ? `AND userId = ${userId}` : ''}
      GROUP BY strftime('%H', timestamp)
      ORDER BY strftime('%H', timestamp)
    `;

    return results.map((r) => ({
      hour: r.hour,
      count: Number(r.count),
    }));
  }
}
