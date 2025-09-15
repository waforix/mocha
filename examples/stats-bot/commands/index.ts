import type { StatsClient } from '../../../src/index';
import { CONFIG } from '../config';
import { logger } from '../logger';
import { handleCacheCommand } from './cache';
import { handleLeaderboardCommand } from './leaderboard';
import { handleServerCommand } from './server';
import type { CommandContext } from './stats';
import { handleStatsCommand } from './stats';

export type CommandHandler = (client: StatsClient, context: CommandContext) => Promise<string>;

export const commands: Record<string, CommandHandler> = {
  stats: handleStatsCommand,
  leaderboard: handleLeaderboardCommand,
  lb: handleLeaderboardCommand,
  server: handleServerCommand,
  guild: handleServerCommand,
  cache: handleCacheCommand,
};

export async function handleCommand(
  client: StatsClient,
  message: string,
  guildId: string,
  channelId: string,
  userId: string,
  username: string
): Promise<string | null> {
  const prefix = CONFIG.bot.prefix;

  if (!message.startsWith(prefix)) {
    return null;
  }

  const args = message.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName || !commands[commandName]) {
    return null;
  }

  const context: CommandContext = {
    guildId,
    channelId,
    userId,
    username,
    args,
  };

  try {
    logger.debug(`Executing command: ${commandName}`, { userId, guildId });
    return await commands[commandName](client, context);
  } catch (error) {
    logger.error(`Error executing command ${commandName}:`, error);
    return '❌ An error occurred while executing the command.';
  }
}

export function getHelpMessage(): string {
  const prefix = CONFIG.bot.prefix;

  return (
    '🤖 **Waforix Stats Bot Commands**\n\n' +
    '📊 **Statistics:**\n' +
    `• \`${prefix}stats [days]\` - Your personal stats\n` +
    `• \`${prefix}server [days]\` - Server statistics\n` +
    `• \`${prefix}leaderboard [voice|messages] [limit] [days]\` - Top users\n\n` +
    '⚙️ **Admin:**\n' +
    `• \`${prefix}cache stats\` - Cache information\n` +
    `• \`${prefix}cache clear\` - Clear caches\n` +
    `• \`${prefix}cache metrics\` - Performance metrics\n\n` +
    '💡 **Tips:**\n' +
    '• Default period is 30 days\n' +
    `• Use \`${prefix}lb\` as shortcut for leaderboard\n` +
    '• Admin commands require bot owner permissions'
  );
}
