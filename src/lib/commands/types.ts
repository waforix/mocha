export interface SlashCommand {
  name: string;
  description: string;
  options?: SlashCommandOption[];
}

export interface SlashCommandOption {
  type: SlashCommandOptionType;
  name: string;
  description: string;
  required?: boolean;
  choices?: SlashCommandChoice[];
  min_value?: number;
  max_value?: number;
}

export interface SlashCommandChoice {
  name: string;
  value: string | number;
}

export enum SlashCommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10,
  ATTACHMENT = 11,
}

export interface CommandRegistry {
  register(guildId?: string): Promise<void>;
  unregister(guildId?: string, forceGlobal?: boolean): Promise<void>;
  sync(guildId?: string): Promise<void>;
  getCommands(): SlashCommand[];
}
