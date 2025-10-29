import type { CommonDatabase } from '../db/index';
import type { ExportData, ExportOptions } from './formats';
import { CSVFormatter, JSONFormatter } from './formats';

export class DataExporter {
  private formatters = {
    json: new JSONFormatter(),
    csv: new CSVFormatter(),
    xlsx: new JSONFormatter(),
  };

  constructor(private db: CommonDatabase) {}

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

  /**
   * Gather user data with message and voice statistics
   */
  private async gatherUserData(data: ExportData, options: ExportOptions): Promise<void> {
    const userStats = await this.db.$queryRaw<
      Array<{
        id: string;
        username: string;
        messageCount: bigint;
        voiceTime: bigint;
      }>
    >`
      SELECT
        u.id,
        u.username,
        COUNT(DISTINCT me.id) as messageCount,
        COALESCE(SUM(ve.duration), 0) as voiceTime
      FROM User u
      LEFT JOIN MessageEvent me ON me.userId = u.id
        AND me.guildId = ${options.guildId}
        AND me.timestamp >= ${options.dateRange.start}
        AND me.timestamp <= ${options.dateRange.end}
      LEFT JOIN VoiceEvent ve ON ve.userId = u.id
        AND ve.guildId = ${options.guildId}
        AND ve.timestamp >= ${options.dateRange.start}
        AND ve.timestamp <= ${options.dateRange.end}
      WHERE me.id IS NOT NULL OR ve.id IS NOT NULL
      GROUP BY u.id, u.username
    `;

    data.users = userStats.map(
      (row: { id: string; username: string; messageCount: bigint; voiceTime: bigint }) => ({
        id: row.id,
        username: row.username,
        messageCount: Number(row.messageCount),
        voiceTime: Number(row.voiceTime),
      })
    );
  }

  /**
   * Gather channel data with message statistics
   */
  private async gatherChannelData(data: ExportData, options: ExportOptions): Promise<void> {
    const channelStats = await this.db.$queryRaw<
      Array<{
        id: string;
        name: string;
        messageCount: bigint;
        uniqueUsers: bigint;
      }>
    >`
      SELECT
        c.id,
        c.name,
        COUNT(me.id) as messageCount,
        COUNT(DISTINCT me.userId) as uniqueUsers
      FROM Channel c
      LEFT JOIN MessageEvent me ON me.channelId = c.id
        AND me.guildId = ${options.guildId}
        AND me.timestamp >= ${options.dateRange.start}
        AND me.timestamp <= ${options.dateRange.end}
      WHERE c.guildId = ${options.guildId}
      GROUP BY c.id, c.name
    `;

    data.channels = channelStats.map(
      (c: { id: string; name: string; messageCount: bigint; uniqueUsers: bigint }) => ({
        id: c.id,
        name: c.name,
        messageCount: Number(c.messageCount),
        uniqueUsers: Number(c.uniqueUsers),
      })
    );
  }

  /**
   * Gather message event data
   */
  private async gatherMessageData(data: ExportData, options: ExportOptions): Promise<void> {
    const messages = await this.db.messageEvent.findMany({
      where: {
        guildId: options.guildId,
        timestamp: {
          gte: options.dateRange.start,
          lte: options.dateRange.end,
        },
      },
      take: 10000,
      select: {
        id: true,
        userId: true,
        channelId: true,
        timestamp: true,
        attachmentCount: true,
        embedCount: true,
      },
    });

    data.messages = messages;
  }

  /**
   * Gather voice event data
   */
  private async gatherVoiceData(data: ExportData, options: ExportOptions): Promise<void> {
    const voice = await this.db.voiceEvent.findMany({
      where: {
        guildId: options.guildId,
        timestamp: {
          gte: options.dateRange.start,
          lte: options.dateRange.end,
        },
      },
      take: 10000,
      select: {
        id: true,
        userId: true,
        channelId: true,
        action: true,
        duration: true,
        timestamp: true,
      },
    });

    data.voice = voice.map(
      (v: {
        id: string;
        userId: string;
        channelId: string | null;
        action: string;
        duration: number | null;
        timestamp: Date;
      }) => ({
        id: v.id,
        userId: v.userId,
        channelId: v.channelId || '',
        action: v.action,
        duration: v.duration || undefined,
        timestamp: v.timestamp,
      })
    );
  }

  /**
   * Gather member event data
   */
  private async gatherMemberData(data: ExportData, options: ExportOptions): Promise<void> {
    const members = await this.db.memberEvent.findMany({
      where: {
        guildId: options.guildId,
        timestamp: {
          gte: options.dateRange.start,
          lte: options.dateRange.end,
        },
      },
      take: 10000,
      select: {
        id: true,
        userId: true,
        action: true,
        timestamp: true,
      },
    });

    data.members = members;
  }
}
