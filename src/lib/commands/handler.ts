export interface CommandHandler {
  execute(interaction: any): Promise<any>;
}

export interface CommandHandlerRegistration {
  commandName: string;
  handler: CommandHandler;
}

export class CommandHandlerManager {
  private handlers = new Map<string, CommandHandler>();

  register(commandName: string, handler: CommandHandler): void {
    this.handlers.set(commandName, handler);
  }

  unregister(commandName: string): boolean {
    return this.handlers.delete(commandName);
  }

  get(commandName: string): CommandHandler | undefined {
    return this.handlers.get(commandName);
  }

  async handleCommand(interaction: any): Promise<any> {
    const commandName = interaction.data?.name;
    if (!commandName) {
      throw new Error('No command name found in interaction');
    }

    const handler = this.handlers.get(commandName);
    if (!handler) {
      throw new Error(`Command handler for '${commandName}' not found`);
    }

    return await handler.execute(interaction);
  }

  clear(): void {
    this.handlers.clear();
  }

  getRegistrations(): CommandHandlerRegistration[] {
    const registrations: CommandHandlerRegistration[] = [];
    for (const [commandName, handler] of this.handlers) {
      registrations.push({ commandName, handler });
    }
    return registrations;
  }
}
