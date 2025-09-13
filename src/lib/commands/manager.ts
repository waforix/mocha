import { DiscordCommandRegistry } from './registry';
import type { SlashCommand } from './types';

export class CommandManager {
  private registry: DiscordCommandRegistry;
  private autoSync: boolean;

  constructor(token: string, applicationId: string, autoSync = true) {
    this.registry = new DiscordCommandRegistry(token, applicationId);
    this.autoSync = autoSync;
  }

  add(command: SlashCommand): void {
    this.registry.addCommand(command);
  }

  remove(name: string): void {
    this.registry.removeCommand(name);
  }

  async deploy(guildId?: string): Promise<void> {
    await this.registry.register(guildId);
  }

  async cleanup(guildId?: string, forceGlobal = false): Promise<void> {
    await this.registry.unregister(guildId, forceGlobal);
  }

  async sync(guildId?: string): Promise<void> {
    if (this.autoSync) {
      await this.registry.sync(guildId);
    }
  }

  getCommands(): SlashCommand[] {
    return this.registry.getCommands();
  }
}
