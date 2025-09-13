import type { StatsClient } from '../../../src/index';
import { logger } from '../logger';

export interface CommandContext {
  guildId: string;
  channelId: string;
  userId: string;
  username: string;
  args: string[];
}

export async function handleStatsCommand(
  client: StatsClient,
  context: CommandContext
): Promise<string> {
  try {
    const { guildId, userId, args } = context;
    const days = args[0] ? Number.parseInt(args[0], 10) : 30;

    if (Number.isNaN(days) || days < 1 || days > 365) {
      return '❌ Please provide a valid number of days (1-365)';
    }

    const stats = await client.getUserStats(guildId, userId, days);

    return (
      `📊 **Your Stats (Last ${days} days)**\n` +
      `💬 Messages: ${stats.messageCount}\n` +
      `🎤 Voice Time: ${formatTime(stats.voiceTime)}\n` +
      `🎧 Voice Sessions: ${stats.voiceSessions}\n` +
      `📎 Attachments: ${stats.attachments}\n` +
      `📋 Embeds: ${stats.embeds}`
    );
  } catch (error) {
    logger.error('Error handling stats command:', error);
    return '❌ Failed to retrieve stats. Please try again later.';
  }
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
