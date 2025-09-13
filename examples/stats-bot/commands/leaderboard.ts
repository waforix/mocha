import type { StatsClient } from '../../../src/index';
import { logger } from '../logger';
import type { CommandContext } from './stats';

interface LeaderboardEntry {
  username: string;
  value: number;
}

export async function handleLeaderboardCommand(
  client: StatsClient,
  context: CommandContext
): Promise<string> {
  try {
    const { guildId, args } = context;
    const type = args[0]?.toLowerCase() === 'voice' ? 'voice' : 'messages';
    const limit = args[1] ? Number.parseInt(args[1], 10) : 10;
    const days = args[2] ? Number.parseInt(args[2], 10) : 30;

    if (Number.isNaN(limit) || limit < 1 || limit > 25) {
      return '❌ Please provide a valid limit (1-25)';
    }

    if (Number.isNaN(days) || days < 1 || days > 365) {
      return '❌ Please provide a valid number of days (1-365)';
    }

    const leaderboard = await client.getLeaderboard(guildId, type, limit, days);

    if (leaderboard.length === 0) {
      return `📊 No ${type} data found for the last ${days} days.`;
    }

    const title = type === 'voice' ? '🎤 Voice Leaderboard' : '💬 Message Leaderboard';
    const unit = type === 'voice' ? 'minutes' : 'messages';

    let response = `${title} (Last ${days} days)\n\n`;

    for (const [index, entry] of leaderboard.entries()) {
      const medal = getMedal(index);
      const typedEntry = entry as LeaderboardEntry;
      const value = type === 'voice' ? Math.floor(typedEntry.value / 60) : typedEntry.value;

      response += `${medal} **${typedEntry.username || 'Unknown'}**: ${value} ${unit}\n`;
    }

    return response;
  } catch (error) {
    logger.error('Error handling leaderboard command:', error);
    return '❌ Failed to retrieve leaderboard. Please try again later.';
  }
}

function getMedal(index: number): string {
  switch (index) {
    case 0:
      return '🥇';
    case 1:
      return '🥈';
    case 2:
      return '🥉';
    default:
      return `${index + 1}.`;
  }
}
