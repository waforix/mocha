import type { StatsClient } from '../../../src/index';
import { CONFIG } from '../config';
import { logger } from '../logger';
import type { CommandContext } from './stats';

export async function handleCacheCommand(
  client: StatsClient,
  context: CommandContext
): Promise<string> {
  try {
    const { userId, args } = context;

    if (userId !== CONFIG.discord.ownerId) {
      return '❌ This command is only available to the bot owner.';
    }

    const action = args[0]?.toLowerCase();

    switch (action) {
      case 'stats':
        return getCacheStats(client);
      case 'clear':
        return clearCache(client);
      case 'metrics':
        return getMetrics(client);
      default:
        return (
          '📋 **Cache Commands:**\n' +
          '• `cache stats` - Show cache statistics\n' +
          '• `cache clear` - Clear all caches\n' +
          '• `cache metrics` - Show performance metrics'
        );
    }
  } catch (error) {
    logger.error('Error handling cache command:', error);
    return '❌ Failed to execute cache command.';
  }
}

function getCacheStats(client: StatsClient): string {
  const stats = client.getCacheStats();

  return (
    '📊 **Cache Statistics:**\n' +
    `👥 User Stats: ${stats.userStats}\n` +
    `🏰 Guild Stats: ${stats.guildStats}\n` +
    `🏆 Leaderboards: ${stats.leaderboards}\n` +
    `🔍 Queries: ${stats.queries}`
  );
}

function clearCache(client: StatsClient): string {
  client.clearCache();
  return '✅ All caches cleared successfully.';
}

function getMetrics(client: StatsClient): string {
  const metrics = client.getMetrics();

  if (!metrics) {
    return '❌ Metrics are not enabled.';
  }

  const memoryMB = Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024);
  const uptimeMin = Math.floor(metrics.uptime / 60);

  return (
    '📈 **Performance Metrics:**\n' +
    `⚡ Events Processed: ${metrics.eventsProcessed}\n` +
    `📊 Events/Second: ${metrics.eventsPerSecond}\n` +
    `🔍 Queries Executed: ${metrics.queriesExecuted}\n` +
    `✅ Cache Hits: ${metrics.cacheHits}\n` +
    `❌ Cache Misses: ${metrics.cacheMisses}\n` +
    `🚨 Errors: ${metrics.errors}\n` +
    `⏱️ Uptime: ${uptimeMin} minutes\n` +
    `💾 Memory Usage: ${memoryMB} MB`
  );
}
