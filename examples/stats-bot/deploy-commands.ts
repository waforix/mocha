import { BotCommandManager } from './commands/manager.ts';
import { CONFIG, validateConfig } from './config.ts';
import { logger } from './logger.ts';

async function deployCommands(): Promise<void> {
  try {
    logger.info('🚀 Deploying slash commands...');

    validateConfig();

    const commandManager = new BotCommandManager(CONFIG.discord.applicationId);

    await commandManager.deploy();

    const commands = commandManager.getCommands();
    logger.info(`✅ Successfully deployed ${commands.length} commands:`);
    for (const cmd of commands) {
      logger.info(`  • /${cmd.name} - ${cmd.description}`);
    }
  } catch (error) {
    logger.error('❌ Failed to deploy commands:', error);
    process.exit(1);
  }
}

async function cleanupCommands(): Promise<void> {
  try {
    const forceGlobal = process.argv.includes('--global');
    const scope = forceGlobal ? 'global' : 'guild';
    logger.info(`🧹 Cleaning up ${scope} slash commands...`);

    validateConfig();

    const commandManager = new BotCommandManager(CONFIG.discord.applicationId);

    await commandManager.cleanup(forceGlobal);

    logger.info(`✅ Successfully cleaned up all ${scope} commands`);
  } catch (error) {
    logger.error('❌ Failed to cleanup commands:', error);
    process.exit(1);
  }
}

const action = process.argv[2];

if (action === 'cleanup') {
  cleanupCommands();
} else {
  deployCommands();
}
