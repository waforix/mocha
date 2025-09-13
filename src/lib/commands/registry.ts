import type { CommandRegistry, SlashCommand } from './types';

export class DiscordCommandRegistry implements CommandRegistry {
  private commands: SlashCommand[] = [];
  private token: string;
  private applicationId: string;

  constructor(token: string, applicationId: string) {
    this.token = token;
    this.applicationId = applicationId;
  }

  addCommand(command: SlashCommand): void {
    this.commands.push(command);
  }

  removeCommand(name: string): void {
    this.commands = this.commands.filter((cmd) => cmd.name !== name);
  }

  getCommands(): SlashCommand[] {
    return [...this.commands];
  }

  async register(guildId?: string): Promise<void> {
    const url = guildId
      ? `https://discord.com/api/v10/applications/${this.applicationId}/guilds/${guildId}/commands`
      : `https://discord.com/api/v10/applications/${this.applicationId}/commands`;

    await this.makeRequest(url, 'PUT', this.commands);
  }

  async unregister(guildId?: string, forceGlobal = false): Promise<void> {
    const url =
      guildId && !forceGlobal
        ? `https://discord.com/api/v10/applications/${this.applicationId}/guilds/${guildId}/commands`
        : `https://discord.com/api/v10/applications/${this.applicationId}/commands`;

    await this.makeRequest(url, 'PUT', []);
  }

  async sync(guildId?: string): Promise<void> {
    const url = guildId
      ? `https://discord.com/api/v10/applications/${this.applicationId}/guilds/${guildId}/commands`
      : `https://discord.com/api/v10/applications/${this.applicationId}/commands`;

    const existingCommands = (await this.makeRequest(url, 'GET')) as { name: string }[];
    const currentNames = new Set(this.commands.map((cmd) => cmd.name));
    const existingNames = new Set(existingCommands.map((cmd) => cmd.name));

    const toRemove = [...existingNames].filter((name) => !currentNames.has(name));
    const toAdd = this.commands.filter((cmd) => !existingNames.has(cmd.name));
    const toUpdate = this.commands.filter((cmd) => existingNames.has(cmd.name));

    if (toRemove.length > 0 || toAdd.length > 0 || toUpdate.length > 0) {
      await this.register(guildId);
    }
  }

  private async makeRequest(url: string, method: string, body?: unknown): Promise<unknown> {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bot ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (response.ok) {
        return method === 'GET' ? response.json() : undefined;
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2 ** retryCount * 1000;

        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        retryCount++;
        continue;
      }

      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    throw new Error(`Max retries exceeded for ${method} ${url}`);
  }
}
