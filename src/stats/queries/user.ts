import type { CommonDatabase } from '../../db/index';
import { createDateSince } from '../../utils/date';

export class UserQueries {
  constructor(private db: CommonDatabase) {}

  /**
   * Get top users by messages or voice time
   */
  async getTop(guildId: string, type: 'messages' | 'voice', limit = 10, days = 30) {
    const since = createDateSince(days);

    if (type === 'messages') {
      const results = await this.db.$queryRaw<
        Array<{ userId: string; username: string; count: bigint }>
      >`
        SELECT
          m.userId,
          u.username,
          COUNT(*) as count
        FROM messageevent m
        INNER JOIN user u ON m.userId = u.id
        WHERE m.guildId = ${guildId}
          AND m.timestamp >= ${since}
        GROUP BY m.userId, u.username
        ORDER BY count DESC
        LIMIT ${limit}
      `;

      return results.map((r: { userId: string; username: string; count: bigint }) => ({
        userId: r.userId,
        username: r.username,
        count: Number(r.count),
      }));
    }

    const results = await this.db.$queryRaw<
      Array<{ userId: string; username: string; totalTime: bigint }>
    >`
      SELECT
        v.userId,
        u.username,
        SUM(v.duration) as totalTime
      FROM voiceevent v
      INNER JOIN user u ON v.userId = u.id
      WHERE v.guildId = ${guildId}
        AND v.action = 'leave'
        AND v.timestamp >= ${since}
      GROUP BY v.userId, u.username
      ORDER BY totalTime DESC
      LIMIT ${limit}
    `;

    return results.map((r: { userId: string; username: string; totalTime: bigint }) => ({
      userId: r.userId,
      username: r.username,
      totalTime: Number(r.totalTime),
    }));
  }
}
