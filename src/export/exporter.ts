import { and, eq, gte, lte } from 'drizzle-orm';
import type { DatabaseInstance } from '../db/index';
import { channels, memberEvents, messageEvents, users, voiceEvents } from '../db/schema/index';
import type { ExportData, ExportOptions } from './formats';
import { CSVFormatter, JSONFormatter } from './formats';

export class DataExporter {
  private formatters = {
    json: new JSONFormatter(),
    csv: new CSVFormatter(),
    xlsx: new JSONFormatter(),
  };

  constructor(private db: ReturnType<typeof getDb>) {}

  async export(
    options: ExportOptions
  ): Promise<{ data: Buffer | string; contentType: string; filename: string }> {
    const exportData = await this.gatherData(options);
    const formatter = this.formatters[options.format];

    const data = await formatter.format(exportData);
    const filename = `guild-${options.guildId}-${Date.now()}.${formatter.getFileExtension()}`;

    return {
      data,
      contentType: formatter.getContentType(),
      filename,
    };
  }

  private async gatherData(options: ExportOptions): Promise<ExportData> {
    const { guildId, dateRange } = options;
    const data: ExportData = {
      metadata: {
        guildId,
        exportDate: new Date(),
        dateRange,
        recordCount: 0,
      },
    };

    const promises: Promise<void>[] = [];

    if (options.includeUsers) {
      promises.push(this.gatherUserData(data, options));
    }

    if (options.includeChannels) {
      promises.push(this.gatherChannelData(data, options));
    }

    if (options.includeMessages) {
      promises.push(this.gatherMessageData(data, options));
    }

    if (options.includeVoice) {
      promises.push(this.gatherVoiceData(data, options));
    }

    if (options.includeMembers) {
      promises.push(this.gatherMemberData(data, options));
    }

    await Promise.all(promises);

    data.metadata.recordCount =
      (data.users?.length || 0) +
      (data.channels?.length || 0) +
      (data.messages?.length || 0) +
      (data.voice?.length || 0) +
      (data.members?.length || 0);

    return data;
  }

  private async gatherUserData(data: ExportData, options: ExportOptions): Promise<void> {
    const userStats = await this.db
      .select({
        id: users.id,
        username: users.username,
        messageCount: messageEvents.id,
        voiceTime: voiceEvents.duration,
      })
      .from(users)
      .leftJoin(
        messageEvents,
        and(
          eq(messageEvents.userId, users.id),
          eq(messageEvents.guildId, options.guildId),
          gte(messageEvents.timestamp, options.dateRange.start),
          lte(messageEvents.timestamp, options.dateRange.end)
        )
      )
      .leftJoin(
        voiceEvents,
        and(
          eq(voiceEvents.userId, users.id),
          eq(voiceEvents.guildId, options.guildId),
          gte(voiceEvents.timestamp, options.dateRange.start),
          lte(voiceEvents.timestamp, options.dateRange.end)
        )
      );

    const userMap = new Map<
      string,
      { id: string; username: string; messageCount: number; voiceTime: number }
    >();

    for (const row of userStats) {
      const existing = userMap.get(row.id);
      if (existing) {
        existing.messageCount += row.messageCount ? 1 : 0;
        existing.voiceTime += row.voiceTime || 0;
      } else {
        userMap.set(row.id, {
          id: row.id,
          username: row.username,
          messageCount: row.messageCount ? 1 : 0,
          voiceTime: row.voiceTime || 0,
        });
      }
    }

    data.users = Array.from(userMap.values());
  }

  private async gatherChannelData(data: ExportData, options: ExportOptions): Promise<void> {
    const channelStats = await this.getChannelStatsQuery(options);
    const channelMap = this.buildChannelMap(channelStats);

    data.channels = Array.from(channelMap.values()).map((c) => ({
      id: c.id,
      name: c.name,
      messageCount: c.messageCount,
      uniqueUsers: c.uniqueUsers.size,
    }));
  }

  private async getChannelStatsQuery(options: ExportOptions) {
    return await this.db
      .select({
        id: channels.id,
        name: channels.name,
        messageCount: messageEvents.id,
        userId: messageEvents.userId,
      })
      .from(channels)
      .leftJoin(
        messageEvents,
        and(
          eq(messageEvents.channelId, channels.id),
          eq(messageEvents.guildId, options.guildId),
          gte(messageEvents.timestamp, options.dateRange.start),
          lte(messageEvents.timestamp, options.dateRange.end)
        )
      );
  }

  private buildChannelMap(
    channelStats: Array<{
      id: string;
      name: string | null;
      messageCount: string | null;
      userId: string | null;
    }>
  ) {
    const channelMap = new Map<
      string,
      { id: string; name: string; messageCount: number; uniqueUsers: Set<string> }
    >();

    for (const row of channelStats) {
      this.processChannelRow(channelMap, row);
    }

    return channelMap;
  }

  private processChannelRow(
    channelMap: Map<
      string,
      { id: string; name: string; messageCount: number; uniqueUsers: Set<string> }
    >,
    row: { id: string; name: string | null; messageCount: string | null; userId: string | null }
  ) {
    const existing = channelMap.get(row.id);
    if (existing) {
      if (row.messageCount) {
        existing.messageCount++;
        if (row.userId) existing.uniqueUsers.add(row.userId);
      }
    } else {
      channelMap.set(row.id, {
        id: row.id,
        name: row.name || 'Unknown',
        messageCount: row.messageCount ? 1 : 0,
        uniqueUsers: new Set(row.userId ? [row.userId] : []),
      });
    }
  }

  private async gatherMessageData(data: ExportData, options: ExportOptions): Promise<void> {
    const messages = await this.db
      .select()
      .from(messageEvents)
      .where(
        and(
          eq(messageEvents.guildId, options.guildId),
          gte(messageEvents.timestamp, options.dateRange.start),
          lte(messageEvents.timestamp, options.dateRange.end)
        )
      )
      .limit(10000);

    data.messages = messages.map((m) => ({
      id: m.id,
      userId: m.userId,
      channelId: m.channelId,
      timestamp: m.timestamp,
      attachmentCount: m.attachmentCount,
      embedCount: m.embedCount,
    }));
  }

  private async gatherVoiceData(data: ExportData, options: ExportOptions): Promise<void> {
    const voice = await this.db
      .select()
      .from(voiceEvents)
      .where(
        and(
          eq(voiceEvents.guildId, options.guildId),
          gte(voiceEvents.timestamp, options.dateRange.start),
          lte(voiceEvents.timestamp, options.dateRange.end)
        )
      )
      .limit(10000);

    data.voice = voice.map((v) => ({
      id: v.id,
      userId: v.userId,
      channelId: v.channelId || '',
      action: v.action,
      duration: v.duration || undefined,
      timestamp: v.timestamp,
    }));
  }

  private async gatherMemberData(data: ExportData, options: ExportOptions): Promise<void> {
    const members = await this.db
      .select()
      .from(memberEvents)
      .where(
        and(
          eq(memberEvents.guildId, options.guildId),
          gte(memberEvents.timestamp, options.dateRange.start),
          lte(memberEvents.timestamp, options.dateRange.end)
        )
      )
      .limit(10000);

    data.members = members.map((m) => ({
      id: m.id,
      userId: m.userId,
      action: m.action,
      timestamp: m.timestamp,
    }));
  }
}
