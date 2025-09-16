import { eq } from 'drizzle-orm';
import { channels, reactionEvents, users } from '../db/schema/index';
import { BaseProcessor } from './base';

interface ReactionData {
  guild_id: string;
  channel_id: string;
  message_id: string;
  user_id: string;
  emoji: {
    id?: string;
    name: string;
    animated?: boolean;
  };
}

export class ReactionProcessor extends BaseProcessor {
  async process(_data: unknown): Promise<void> {
    // Base implementation - not used for reactions
  }

  async processAdd(data: ReactionData): Promise<void> {
    if (!this.validateReactionData(data)) {
      return;
    }

    try {
      await this.ensureUserExists(data.user_id);
      await this.ensureChannelExists(data.channel_id, data.guild_id);

      await this.db.insert(reactionEvents).values({
        guildId: data.guild_id,
        channelId: data.channel_id,
        messageId: data.message_id,
        userId: data.user_id,
        emojiId: data.emoji.id || null,
        emojiName: data.emoji.name,
        emojiAnimated: data.emoji.animated || false,
        action: 'add',
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process reaction add: ${error}`);
    }
  }

  async processRemove(data: ReactionData): Promise<void> {
    if (!this.validateReactionData(data)) {
      return;
    }

    try {
      await this.ensureUserExists(data.user_id);
      await this.ensureChannelExists(data.channel_id, data.guild_id);

      await this.db.insert(reactionEvents).values({
        guildId: data.guild_id,
        channelId: data.channel_id,
        messageId: data.message_id,
        userId: data.user_id,
        emojiId: data.emoji.id || null,
        emojiName: data.emoji.name,
        emojiAnimated: data.emoji.animated || false,
        action: 'remove',
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process reaction remove: ${error}`);
    }
  }

  private validateReactionData(data: unknown): data is ReactionData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;

    return !!(
      d.guild_id &&
      typeof d.guild_id === 'string' &&
      d.channel_id &&
      typeof d.channel_id === 'string' &&
      d.message_id &&
      typeof d.message_id === 'string' &&
      d.user_id &&
      typeof d.user_id === 'string' &&
      d.emoji &&
      typeof d.emoji === 'object' &&
      (d.emoji as Record<string, unknown>).name &&
      typeof (d.emoji as Record<string, unknown>).name === 'string'
    );
  }

  private async ensureUserExists(userId: string): Promise<void> {
    const existing = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existing.length === 0) {
      await this.db.insert(users).values({
        id: userId,
        username: 'Unknown',
        discriminator: '0000',
      });
    }
  }

  private async ensureChannelExists(channelId: string, guildId: string): Promise<void> {
    const existing = await this.db
      .select({ id: channels.id })
      .from(channels)
      .where(eq(channels.id, channelId))
      .limit(1);

    if (existing.length === 0) {
      await this.db.insert(channels).values({
        id: channelId,
        guildId,
        name: 'Unknown',
        type: 0,
      });
    }
  }
}
