export interface ExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  guildId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  includeUsers?: boolean;
  includeChannels?: boolean;
  includeMessages?: boolean;
  includeVoice?: boolean;
  includeMembers?: boolean;
}

export interface ExportData {
  metadata: {
    guildId: string;
    exportDate: Date;
    dateRange: {
      start: Date;
      end: Date;
    };
    recordCount: number;
  };
  users?: Array<{
    id: string;
    username: string;
    messageCount: number;
    voiceTime: number;
    joinDate?: Date;
  }>;
  channels?: Array<{
    id: string;
    name: string;
    messageCount: number;
    uniqueUsers: number;
  }>;
  messages?: Array<{
    id: string;
    userId: string;
    channelId: string;
    timestamp: Date;
    attachmentCount: number;
    embedCount: number;
  }>;
  voice?: Array<{
    id: string;
    userId: string;
    channelId: string;
    action: string;
    duration?: number;
    timestamp: Date;
  }>;
  members?: Array<{
    id: string;
    userId: string;
    action: string;
    timestamp: Date;
  }>;
}

export abstract class ExportFormatter {
  abstract format(data: ExportData): Promise<Buffer | string>;
  abstract getContentType(): string;
  abstract getFileExtension(): string;
}

export class JSONFormatter extends ExportFormatter {
  async format(data: ExportData): Promise<string> {
    return JSON.stringify(data, null, 2);
  }

  getContentType(): string {
    return 'application/json';
  }

  getFileExtension(): string {
    return 'json';
  }
}

export class CSVFormatter extends ExportFormatter {
  async format(data: ExportData): Promise<string> {
    const sections: string[] = [];

    if (data.users) {
      sections.push('Users');
      sections.push('id,username,messageCount,voiceTime,joinDate');
      sections.push(
        ...data.users.map(
          (u) =>
            `${u.id},${u.username},${u.messageCount},${u.voiceTime},${u.joinDate?.toISOString() || ''}`
        )
      );
      sections.push('');
    }

    if (data.channels) {
      sections.push('Channels');
      sections.push('id,name,messageCount,uniqueUsers');
      sections.push(
        ...data.channels.map((c) => `${c.id},${c.name},${c.messageCount},${c.uniqueUsers}`)
      );
      sections.push('');
    }

    if (data.messages) {
      sections.push('Messages');
      sections.push('id,userId,channelId,timestamp,attachmentCount,embedCount');
      sections.push(
        ...data.messages.map(
          (m) =>
            `${m.id},${m.userId},${m.channelId},${m.timestamp.toISOString()},${m.attachmentCount},${m.embedCount}`
        )
      );
    }

    return sections.join('\n');
  }

  getContentType(): string {
    return 'text/csv';
  }

  getFileExtension(): string {
    return 'csv';
  }
}
