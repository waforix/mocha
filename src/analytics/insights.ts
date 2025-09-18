import { and, count, eq, gte, lt, sql } from 'drizzle-orm';
import type { CommonDatabase } from '../db/index';
import { toTimestamp } from '../db/utils';
import { guilds, memberEvents, messageEvents, voiceEvents } from '../db/schema/index';
import { createDateSince } from '../utils/date';

export interface ActivityInsight {
  type: 'peak_hours' | 'quiet_hours' | 'growth_trend' | 'engagement_drop';
  title: string;
  description: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

export interface GuildInsights {
  insights: ActivityInsight[];
  peakHours: number[];
  quietHours: number[];
  growthRate: number;
  engagementScore: number;
}

export class InsightsEngine {
  constructor(private db: CommonDatabase) {}

  async generateGuildInsights(guildId: string, days = 30): Promise<GuildInsights> {
    const [hourlyActivity, memberGrowth, engagementData] = await Promise.all([
      this.getHourlyActivity(guildId, days),
      this.getMemberGrowthTrend(guildId, days),
      this.getEngagementMetrics(guildId, days),
    ]);

    const insights: ActivityInsight[] = [];
    const peakHours = this.identifyPeakHours(hourlyActivity);
    const quietHours = this.identifyQuietHours(hourlyActivity);

    if (memberGrowth.trend !== 'stable') {
      insights.push({
        type: 'growth_trend',
        title: memberGrowth.trend === 'up' ? 'Growing Community' : 'Declining Membership',
        description: `Member count has ${memberGrowth.trend === 'up' ? 'increased' : 'decreased'} by ${Math.abs(memberGrowth.rate)}% over the last ${days} days`,
        value: memberGrowth.rate,
        trend: memberGrowth.trend as 'up' | 'down' | 'stable',
        confidence: memberGrowth.confidence,
      });
    }

    if (engagementData.score < 0.3) {
      insights.push({
        type: 'engagement_drop',
        title: 'Low Engagement',
        description: 'Server engagement is below average. Consider hosting events or discussions.',
        value: engagementData.score,
        trend: 'down',
        confidence: 0.8,
      });
    }

    return {
      insights,
      peakHours,
      quietHours,
      growthRate: memberGrowth.rate,
      engagementScore: engagementData.score,
    };
  }

  private async getHourlyActivity(guildId: string, days: number) {
    const since = createDateSince(days);

    const result = await this.db
      .select({
        hour: sql<number>`cast(strftime('%H', datetime(${messageEvents.timestamp}, 'unixepoch')) as integer)`,
        activity: count(),
      })
      .from(messageEvents)
      .where(and(eq(messageEvents.guildId, guildId), gte(messageEvents.timestamp, toTimestamp(since))))
      .groupBy(sql`strftime('%H', datetime(${messageEvents.timestamp}, 'unixepoch'))`)
      .orderBy(sql`hour`);

    const activityMap = new Map(
      result.map((r: { hour: number; activity: unknown }) => [r.hour, r.activity])
    );

    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      activity: Number(activityMap.get(hour)) || 0,
    }));
  }

  private async getMemberGrowthTrend(guildId: string, days: number) {
    const since = createDateSince(days);
    const previousPeriod = createDateSince(days * 2);

    const [current, previous] = await Promise.all([
      this.db
        .select({ joins: count() })
        .from(memberEvents)
        .where(
          and(
            eq(memberEvents.guildId, guildId),
            eq(memberEvents.action, 'join'),
            gte(memberEvents.createdAt, toTimestamp(since))
          )
        ),
      this.db
        .select({ joins: count() })
        .from(memberEvents)
        .where(
          and(
            eq(memberEvents.guildId, guildId),
            eq(memberEvents.action, 'join'),
            gte(memberEvents.createdAt, toTimestamp(previousPeriod)),
            lt(memberEvents.createdAt, toTimestamp(since))
          )
        ),
    ]);

    const currentJoins = current[0]?.joins || 0;
    const previousJoins = previous[0]?.joins || 0;

    const growthRate =
      previousJoins > 0
        ? ((currentJoins - previousJoins) / previousJoins) * 100
        : currentJoins > 0
          ? 100
          : 0;

    return {
      rate: growthRate,
      trend: growthRate > 5 ? 'up' : growthRate < -5 ? 'down' : ('stable' as const),
      confidence: Math.min(0.9, Math.abs(growthRate) / 50),
    };
  }

  private async getEngagementMetrics(guildId: string, days: number) {
    const since = createDateSince(days);

    const [messageStats, voiceStats, memberCount] = await Promise.all([
      this.db
        .select({
          totalMessages: count(),
          activeUsers: sql<number>`count(distinct ${messageEvents.userId})`,
        })
        .from(messageEvents)
        .where(and(eq(messageEvents.guildId, guildId), gte(messageEvents.timestamp, toTimestamp(since)))),
      this.db
        .select({
          voiceUsers: sql<number>`count(distinct ${voiceEvents.userId})`,
          avgDuration: sql<number>`avg(${voiceEvents.duration})`,
        })
        .from(voiceEvents)
        .where(
          and(
            eq(voiceEvents.guildId, guildId),
            gte(voiceEvents.createdAt, toTimestamp(since)),
            eq(voiceEvents.action, 'leave')
          )
        ),
      this.db
        .select({ memberCount: guilds.memberCount })
        .from(guilds)
        .where(eq(guilds.id, guildId)),
    ]);

    const totalMessages = messageStats[0]?.totalMessages || 0;
    const activeUsers = messageStats[0]?.activeUsers || 0;
    const voiceUsers = voiceStats[0]?.voiceUsers || 0;
    const totalMembers = memberCount[0]?.memberCount || 1;

    const messagesPerUser = activeUsers > 0 ? totalMessages / activeUsers : 0;
    const voiceParticipation = voiceUsers / totalMembers;
    const activityRatio = activeUsers / totalMembers;

    const score =
      activityRatio * 0.4 + voiceParticipation * 0.3 + Math.min(messagesPerUser / 10, 1) * 0.3;

    return {
      score: Math.min(score, 1),
      messagesPerUser,
      voiceParticipation,
    };
  }

  private identifyPeakHours(hourlyActivity: Array<{ hour: number; activity: number }>): number[] {
    const sorted = [...hourlyActivity].sort((a, b) => b.activity - a.activity);
    return sorted.slice(0, 3).map((h) => h.hour);
  }

  private identifyQuietHours(hourlyActivity: Array<{ hour: number; activity: number }>): number[] {
    const sorted = [...hourlyActivity].sort((a, b) => a.activity - b.activity);
    return sorted.slice(0, 3).map((h) => h.hour);
  }
}
