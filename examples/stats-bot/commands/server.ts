import type { StatsClient } from '../../../src/index';
import { logger } from '../logger';
import type { CommandContext } from './stats';

export async function handleServerCommand(
  client: StatsClient,
  context: CommandContext
): Promise<string> {
  try {
    const { guildId, args } = context;
    const days = args[0] ? Number.parseInt(args[0], 10) : 30;

    if (Number.isNaN(days) || days < 1 || days > 365) {
      return '❌ Please provide a valid number of days (1-365)';
    }

    const stats = await client.getGuildStats(guildId, days);

    let response = `📊 **Server Stats (Last ${days} days)**\n\n`;
    response += `💬 Total Messages: ${stats.totalMessages}\n`;
    response += `🎤 Total Voice Time: ${formatTime(stats.totalVoiceTime)}\n`;
    response += `👥 Active Users: ${stats.activeUsers}\n\n`;

    if (stats.topChannels.length > 0) {
      response += '📈 **Top Channels:**\n';
      for (const [index, channel] of stats.topChannels.slice(0, 5).entries()) {
        response += `${index + 1}. **${channel.name || 'Unknown'}**: ${channel.messageCount} messages\n`;
      }
      response += '\n';
    }

    if (stats.memberGrowth.joins.length > 0) {
      const totalJoins = stats.memberGrowth.joins.reduce((sum, day) => sum + day.joins, 0);
      const totalLeaves = stats.memberGrowth.leaves.reduce((sum, day) => sum + day.leaves, 0);
      const netGrowth = totalJoins - totalLeaves;

      response += '📊 **Member Growth:**\n';
      response += `➕ Joins: ${totalJoins}\n`;
      response += `➖ Leaves: ${totalLeaves}\n`;
      response += `📈 Net Growth: ${netGrowth > 0 ? '+' : ''}${netGrowth}`;
    }

    return response;
  } catch (error) {
    logger.error('Error handling server command:', error);
    return '❌ Failed to retrieve server stats. Please try again later.';
  }
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;

  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }

  return `${hours}h ${Math.floor((seconds % 3600) / 60)}m`;
}
