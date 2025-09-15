import { INTENTS, StatsClient } from '../../src/index';
import { BotCommandManager } from './commands/manager';
import { CONFIG, validateConfig } from './config';
import { logStats, setupEventHandlers } from './handlers/events';
import { logger } from './logger';

async function main(): Promise<void> {
  try {
    logger.info('🚀 Starting Waforix Stats Bot...');

    validateConfig();

    const client = new StatsClient({
      token: CONFIG.discord.token,
      intents:
        INTENTS.GUILDS |
        INTENTS.GUILD_MESSAGES |
        INTENTS.GUILD_VOICE_STATES |
        INTENTS.GUILD_MEMBERS |
        INTENTS.GUILD_MESSAGE_REACTIONS,
      dbPath: CONFIG.database.path,
      cache: CONFIG.cache,
      enableMetrics: CONFIG.features.enableMetrics,
      enableNotifications: CONFIG.features.enableNotifications,
      enableRateLimit: CONFIG.features.enableRateLimit,
    });

    setupEventHandlers(client);

    const commandManager = new BotCommandManager(CONFIG.discord.applicationId);
    await commandManager.sync();

    await client.connect();

    logger.info('✅ Bot connected successfully!');
    logger.info(`📊 Database: ${CONFIG.database.path}`);
    logger.info(`🎯 Guild ID: ${CONFIG.discord.guildId || 'All guilds'}`);
    logger.info(`🤖 Prefix: ${CONFIG.bot.prefix}`);

    if (CONFIG.features.enableMetrics) {
      setInterval(() => logStats(client), 300000);
    }

    process.on('SIGINT', () => {
      logger.info('🛑 Shutting down bot...');
      client.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      logger.info('🛑 Shutting down bot...');
      client.disconnect();
      process.exit(0);
    });
  } catch (error) {
    logger.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

main();
