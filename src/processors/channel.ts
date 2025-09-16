import { schema } from '../db/index';
import { BaseProcessor } from './base';

interface ChannelData {
  id: string;
  guild_id?: string;
  name?: string;
  type: number;
  parent_id?: string;
  thread_metadata?: {
    archived?: boolean;
    auto_archive_duration?: number;
    archive_timestamp?: string;
    locked?: boolean;
  };
}

export class ChannelProcessor extends BaseProcessor<ChannelData> {
  async process(data: ChannelData): Promise<void> {
    if (!this.isValidChannelData(data)) {
      return;
    }

    if (!data.guild_id) {
      return;
    }

    try {
      await this.upsertChannel(data);
    } catch (error) {
      throw new Error(`Failed to process channel: ${error}`);
    }
  }

  async processCreate(data: ChannelData): Promise<void> {
    if (!this.isValidChannelData(data) || !data.guild_id) {
      return;
    }

    try {
      await this.upsertChannel(data);

      const isThread = data.type === 11 || data.type === 12;

      await this.db.insert(schema.channelEvents).values({
        guildId: data.guild_id,
        channelId: data.id,
        action: 'create',
        channelType: data.type,
        name: data.name,
        parentId: data.parent_id,
        threadId: isThread ? data.id : null,
        isThread,
        threadMetadata: data.thread_metadata ? JSON.stringify(data.thread_metadata) : null,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process channel create: ${error}`);
    }
  }

  async processUpdate(data: ChannelData): Promise<void> {
    if (!this.isValidChannelData(data) || !data.guild_id) {
      return;
    }

    try {
      await this.upsertChannel(data);

      const isThread = data.type === 11 || data.type === 12;

      await this.db.insert(schema.channelEvents).values({
        guildId: data.guild_id,
        channelId: data.id,
        action: 'update',
        channelType: data.type,
        name: data.name,
        parentId: data.parent_id,
        threadId: isThread ? data.id : null,
        isThread,
        threadMetadata: data.thread_metadata ? JSON.stringify(data.thread_metadata) : null,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process channel update: ${error}`);
    }
  }

  async processDelete(data: ChannelData): Promise<void> {
    if (!this.isValidChannelData(data) || !data.guild_id) {
      return;
    }

    try {
      const isThread = data.type === 11 || data.type === 12;

      await this.db.insert(schema.channelEvents).values({
        guildId: data.guild_id,
        channelId: data.id,
        action: 'delete',
        channelType: data.type,
        name: data.name,
        parentId: data.parent_id,
        threadId: isThread ? data.id : null,
        isThread,
        threadMetadata: data.thread_metadata ? JSON.stringify(data.thread_metadata) : null,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process channel delete: ${error}`);
    }
  }

  async processThreadCreate(data: ChannelData): Promise<void> {
    if (!this.isValidChannelData(data) || !data.guild_id) {
      return;
    }

    try {
      await this.upsertChannel(data);

      await this.db.insert(schema.channelEvents).values({
        guildId: data.guild_id,
        channelId: data.id,
        action: 'create',
        channelType: data.type,
        name: data.name,
        parentId: data.parent_id,
        threadId: data.id,
        isThread: true,
        threadMetadata: data.thread_metadata ? JSON.stringify(data.thread_metadata) : null,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process thread create: ${error}`);
    }
  }

  async processThreadUpdate(data: ChannelData): Promise<void> {
    if (!this.isValidChannelData(data) || !data.guild_id) {
      return;
    }

    try {
      await this.upsertChannel(data);

      await this.db.insert(schema.channelEvents).values({
        guildId: data.guild_id,
        channelId: data.id,
        action: 'update',
        channelType: data.type,
        name: data.name,
        parentId: data.parent_id,
        threadId: data.id,
        isThread: true,
        threadMetadata: data.thread_metadata ? JSON.stringify(data.thread_metadata) : null,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process thread update: ${error}`);
    }
  }

  async processThreadDelete(data: ChannelData): Promise<void> {
    if (!this.isValidChannelData(data) || !data.guild_id) {
      return;
    }

    try {
      await this.db.insert(schema.channelEvents).values({
        guildId: data.guild_id,
        channelId: data.id,
        action: 'delete',
        channelType: data.type,
        name: data.name,
        parentId: data.parent_id,
        threadId: data.id,
        isThread: true,
        threadMetadata: data.thread_metadata ? JSON.stringify(data.thread_metadata) : null,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process thread delete: ${error}`);
    }
  }

  private isValidChannelData(data: unknown): data is ChannelData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;

    return !!(d.id && typeof d.id === 'string' && typeof d.type === 'number');
  }
}
