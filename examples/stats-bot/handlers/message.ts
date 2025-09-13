import type { StatsClient } from '../../../src/index';
import { getHelpMessage, handleCommand } from '../commands/index';
import { CONFIG } from '../config';
import { logger } from '../logger';

export interface MessageData {
  id: string;
  guild_id?: string;
  channel_id: string;
  author: {
    id: string;
    username: string;
    bot?: boolean;
  };
  content: string;
  timestamp: string;
  attachments?: unknown[];
  embeds?: unknown[];
}

export async function handleMessage(client: StatsClient, data: MessageData): Promise<void> {
  try {
    if (data.author.bot) return;
    if (!data.guild_id) return;

    const { content, guild_id, channel_id, author } = data;

    if (content.startsWith(CONFIG.bot.prefix)) {
      const response = await handleCommand(
        client,
        content,
        guild_id,
        channel_id,
        author.id,
        author.username
      );

      if (response) {
        logger.info(`Command response sent to ${author.username}:`, response.slice(0, 100));
        await sendMessage(channel_id, response);
      } else if (content === `${CONFIG.bot.prefix}help`) {
        await sendMessage(channel_id, getHelpMessage());
      }
    }
  } catch (error) {
    logger.error('Error handling message:', error);
  }
}

async function sendMessage(channelId: string, content: string): Promise<void> {
  try {
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${CONFIG.discord.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error('Failed to send message:', error);
    }
  } catch (error) {
    logger.error('Error sending message:', error);
  }
}
