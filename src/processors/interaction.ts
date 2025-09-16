import { schema } from '../db/index';
import { BaseProcessor } from './base';

interface InteractionData {
  id: string;
  type: number;
  guild_id?: string;
  channel_id?: string;
  user?: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
  };
  member?: {
    user: {
      id: string;
      username: string;
      discriminator: string;
      avatar?: string;
      bot?: boolean;
    };
  };
  data?: {
    name?: string;
    custom_id?: string;
  };
  message?: {
    id: string;
    channel_id: string;
    thread?: {
      id: string;
      parent_id?: string;
    };
  };
}

export class InteractionProcessor extends BaseProcessor<InteractionData> {
  async process(data: InteractionData): Promise<void> {
    if (!this.validateInteractionData(data)) {
      return;
    }

    if (!data.guild_id) {
      return;
    }

    try {
      const user = data.member?.user || data.user;
      if (!user) {
        return;
      }

      await this.upsertUser(user);

      if (data.channel_id) {
        await this.upsertChannel({
          id: data.channel_id,
          guild_id: data.guild_id,
          type: 0,
        });
      }

      const threadId = data.message?.thread?.id;
      const parentChannelId = data.message?.thread?.parent_id;

      await this.db.insert(schema.interactionEvents).values({
        guildId: data.guild_id,
        channelId: data.channel_id,
        userId: user.id,
        interactionType: data.type,
        commandName: data.data?.name,
        customId: data.data?.custom_id,
        threadId,
        parentChannelId,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process interaction: ${error}`);
    }
  }

  private validateInteractionData(data: unknown): data is InteractionData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;

    return !!(
      d.id &&
      typeof d.id === 'string' &&
      typeof d.type === 'number' &&
      (d.user || d.member)
    );
  }
}
