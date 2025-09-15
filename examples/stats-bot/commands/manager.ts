import { CommandManager } from '../../../src/lib/commands/index.ts';
import { CONFIG } from '../config.ts';
import { logger } from '../logger.ts';
import { cacheCommand, leaderboardCommand, serverCommand, statsCommand } from './definitions.ts';

export class BotCommandManager {
  private manager: CommandManager;

  constructor(applicationId: string) {
    this.manager = new CommandManager(CONFIG.discord.token, applicationId);
    this.setupCommands();
  }

  private setupCommands(): void {
    this.manager.add(statsCommand);
    this.manager.add(leaderboardCommand);
    this.manager.add(serverCommand);
    this.manager.add(cacheCommand);
  }

  async deploy(): Promise<void> {
    try {
      const guildId = CONFIG.discord.guildId;
      await this.manager.deploy(guildId);
      logger.info(`✅ Commands deployed${guildId ? ` to guild ${guildId}` : ' globally'}`);
    } catch (error) {
      logger.error('❌ Failed to deploy commands:', error);
      throw error;
    }
  }

  async cleanup(forceGlobal = false): Promise<void> {
    try {
      const guildId = CONFIG.discord.guildId;
      await this.manager.cleanup(guildId, forceGlobal);
      const scope = forceGlobal ? 'globally' : guildId ? `from guild ${guildId}` : 'globally';
      logger.info(`🧹 Commands cleaned up ${scope}`);
    } catch (error) {
      logger.error('❌ Failed to cleanup commands:', error);
      throw error;
    }
  }

  async sync(): Promise<void> {
    try {
      const guildId = CONFIG.discord.guildId;
      await this.manager.sync(guildId);
      logger.info(`🔄 Commands synced${guildId ? ` for guild ${guildId}` : ' globally'}`);
    } catch (error) {
      logger.error('❌ Failed to sync commands:', error);
      throw error;
    }
  }

  getCommands() {
    return this.manager.getCommands();
  }
}
