import type { CommonDatabase } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class ChannelQueries {
  constructor(private db: CommonDatabase) {}

  /**
   * Get channel statistics for a guild
   */
  async getStats(guildId: string, days = 30) {
    const since = createDateSince(days);

    const results = await this.db.$queryRaw<Array<{
      channelId: string;
      channelName: string | null;
      messageCount: bigint;
      uniqueUsers: bigint;
    }>>`
      SELECT
        m.channelId,
        c.name as channelName,
        COUNT(*) as messageCount,
        COUNT(DISTINCT m.userId) as uniqueUsers
      FROM messageevent m
      INNER JOIN channel c ON m.channelId = c.id
      WHERE m.guildId = ${guildId}
        AND m.timestamp >= ${since}
      GROUP BY m.channelId, c.name
      ORDER BY messageCount DESC
    `;

    return results.map(r => ({
      channelId: r.channelId,
      channelName: r.channelName,
      messageCount: Number(r.messageCount),
      uniqueUsers: Number(r.uniqueUsers),
    }));
  }
}
