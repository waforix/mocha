import { sql } from 'drizzle-orm';

export const createDateFilter = (days: number) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return cutoffDate;
};

export const createTimeRangeFilter = (startDate: Date, endDate: Date) => {
  return { start: startDate, end: endDate };
};

export const createPaginationParams = (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

export const createOrderByClause = (field: string, direction: 'asc' | 'desc' = 'desc') => {
  return direction === 'desc'
    ? sql`${sql.identifier(field)} DESC`
    : sql`${sql.identifier(field)} ASC`;
};

export const createCountQuery = (tableName: string, whereClause?: unknown) => {
  return sql`SELECT COUNT(*) as count FROM ${sql.identifier(tableName)} ${whereClause ? sql`WHERE ${whereClause}` : sql``}`;
};

export const createTopUsersQuery = (guildId: string, limit: number, days: number) => {
  const cutoffDate = createDateFilter(days);
  return {
    guildId,
    cutoffDate,
    limit,
  };
};

export const createActivityTrendQuery = (
  guildId: string,
  days: number,
  interval: 'hour' | 'day' = 'day'
) => {
  const cutoffDate = createDateFilter(days);
  return {
    guildId,
    cutoffDate,
    interval,
  };
};

export const createChannelStatsQuery = (guildId: string, channelId?: string, days?: number) => {
  const filters: Record<string, unknown> = { guildId };

  if (channelId) {
    filters.channelId = channelId;
  }

  if (days) {
    filters.cutoffDate = createDateFilter(days);
  }

  return filters;
};

export const createUserStatsQuery = (guildId: string, userId: string, days: number) => {
  return {
    guildId,
    userId,
    cutoffDate: createDateFilter(days),
  };
};

export const createLeaderboardQuery = (
  guildId: string,
  type: 'messages' | 'voice' | 'reactions',
  days: number,
  limit: number = 10
) => {
  return {
    guildId,
    type,
    cutoffDate: createDateFilter(days),
    limit,
  };
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const createDateRanges = (days: number) => {
  const now = new Date();
  const endDate = new Date(now);
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);

  return { startDate, endDate };
};

export const groupByTimeInterval = (
  data: Array<{ timestamp: Date; value: number }>,
  interval: 'hour' | 'day' | 'week'
) => {
  const grouped = new Map<string, number>();

  for (const item of data) {
    let key: string;

    switch (interval) {
      case 'hour':
        key = item.timestamp.toISOString().slice(0, 13);
        break;
      case 'day':
        key = item.timestamp.toISOString().slice(0, 10);
        break;
      case 'week': {
        const weekStart = new Date(item.timestamp);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        key = weekStart.toISOString().slice(0, 10);
        break;
      }
    }

    grouped.set(key, (grouped.get(key) || 0) + item.value);
  }

  return Array.from(grouped.entries()).map(([timestamp, value]) => ({
    timestamp: new Date(timestamp),
    value,
  }));
};
