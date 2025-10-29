import type { APIMessage } from '../types/index';
import { BaseProcessor } from './base';

export class MessageProcessor extends BaseProcessor<APIMessage> {
  /**
   * Process a message event
   */
  async process(message: APIMessage) {
    if (!this.validateMessage(message)) {
      return;
    }

    if (!message.guild_id || message.author?.bot) {
      return;
    }

    try {
      await this.upsertUser(message.author);
      await this.upsertChannel(message);

      await this.db.messageEvent.create({
        data: {
          id: message.id,
          guildId: message.guild_id,
          channelId: message.channel_id,
          userId: message.author.id,
          content: (message.content || '').slice(0, 2000),
          attachmentCount: message.attachments?.length || 0,
          embedCount: message.embeds?.length || 0,
          timestamp: new Date(message.timestamp),
        },
      });
    } catch (error) {
      throw new Error(`Failed to process message: ${error}`);
    }
  }

  private validateMessage(message: unknown): message is APIMessage {
    if (!message || typeof message !== 'object') {
      return false;
    }

    const msg = message as Record<string, unknown>;

    return !!(
      msg.id &&
      typeof msg.id === 'string' &&
      msg.channel_id &&
      typeof msg.channel_id === 'string' &&
      msg.author &&
      typeof msg.author === 'object' &&
      msg.timestamp &&
      typeof msg.timestamp === 'string'
    );
  }
}
