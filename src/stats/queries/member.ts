import type { CommonDatabase } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class MemberQueries {
  constructor(private db: CommonDatabase) {}

  /**
   * Get member growth statistics for a guild
   */
  async getGrowth(guildId: string, days = 30) {
    const since = createDateSince(days);

    const joinsResults = await this.db.$queryRaw<Array<{ date: string; joins: bigint }>>`
      SELECT
        date(timestamp) as date,
        COUNT(*) as joins
      FROM memberevent
      WHERE guildId = ${guildId}
        AND action = 'join'
        AND timestamp >= ${since}
      GROUP BY date(timestamp)
    `;

    const leavesResults = await this.db.$queryRaw<Array<{ date: string; leaves: bigint }>>`
      SELECT
        date(timestamp) as date,
        COUNT(*) as leaves
      FROM memberevent
      WHERE guildId = ${guildId}
        AND action = 'leave'
        AND timestamp >= ${since}
      GROUP BY date(timestamp)
    `;

    return {
      joins: joinsResults.map((r: { date: string; joins: bigint }) => ({ date: r.date, joins: Number(r.joins) })),
      leaves: leavesResults.map((r: { date: string; leaves: bigint }) => ({ date: r.date, leaves: Number(r.leaves) })),
    };
  }
}
