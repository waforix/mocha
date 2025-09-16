import { schema } from '../db/index';
import { BaseProcessor } from './base';

interface InviteData {
  code: string;
  guild_id: string;
  channel_id?: string;
  inviter?: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
  };
  max_age?: number;
  max_uses?: number;
  temporary?: boolean;
  created_at?: string;
}

export class InviteProcessor extends BaseProcessor<InviteData> {
  async process(data: InviteData): Promise<void> {
    if (!this.validateInviteData(data)) {
      return;
    }

    try {
      await this.processCreate(data);
    } catch (error) {
      throw new Error(`Failed to process invite: ${error}`);
    }
  }

  async processCreate(data: InviteData): Promise<void> {
    if (!this.validateInviteData(data)) {
      return;
    }

    try {
      if (data.inviter) {
        await this.upsertUser(data.inviter);
      }

      if (data.channel_id) {
        await this.upsertChannel({
          id: data.channel_id,
          guild_id: data.guild_id,
          type: 0,
        });
      }

      await this.db.insert(schema.inviteEvents).values({
        guildId: data.guild_id,
        channelId: data.channel_id,
        inviteCode: data.code,
        inviterId: data.inviter?.id,
        action: 'create',
        maxAge: data.max_age,
        maxUses: data.max_uses,
        temporary: data.temporary || false,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process invite create: ${error}`);
    }
  }

  async processDelete(data: {
    code: string;
    guild_id: string;
    channel_id?: string;
  }): Promise<void> {
    if (!data.code || !data.guild_id) {
      return;
    }

    try {
      await this.db.insert(schema.inviteEvents).values({
        guildId: data.guild_id,
        channelId: data.channel_id,
        inviteCode: data.code,
        action: 'delete',
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process invite delete: ${error}`);
    }
  }

  private validateInviteData(data: unknown): data is InviteData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;

    return !!(d.code && typeof d.code === 'string' && d.guild_id && typeof d.guild_id === 'string');
  }
}
