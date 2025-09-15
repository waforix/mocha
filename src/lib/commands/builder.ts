import type { SlashCommand, SlashCommandChoice, SlashCommandOption } from './types';
import { SlashCommandOptionType } from './types';

export class SlashCommandBuilder {
  private command: SlashCommand;

  constructor(name: string, description: string) {
    this.command = {
      name: name.toLowerCase(),
      description,
      options: [],
    };
  }

  addStringOption(name: string, description: string, required = false): SlashCommandOptionBuilder {
    const option = new SlashCommandOptionBuilder(
      SlashCommandOptionType.STRING,
      name,
      description,
      required
    );
    this.command.options = this.command.options || [];
    this.command.options.push(option.build());
    return option;
  }

  addIntegerOption(name: string, description: string, required = false): SlashCommandOptionBuilder {
    const option = new SlashCommandOptionBuilder(
      SlashCommandOptionType.INTEGER,
      name,
      description,
      required
    );
    this.command.options = this.command.options || [];
    this.command.options.push(option.build());
    return option;
  }

  addNumberOption(name: string, description: string, required = false): SlashCommandOptionBuilder {
    const option = new SlashCommandOptionBuilder(
      SlashCommandOptionType.NUMBER,
      name,
      description,
      required
    );
    this.command.options = this.command.options || [];
    this.command.options.push(option.build());
    return option;
  }

  addBooleanOption(name: string, description: string, required = false): SlashCommandOptionBuilder {
    const option = new SlashCommandOptionBuilder(
      SlashCommandOptionType.BOOLEAN,
      name,
      description,
      required
    );
    this.command.options = this.command.options || [];
    this.command.options.push(option.build());
    return option;
  }

  addUserOption(name: string, description: string, required = false): SlashCommandOptionBuilder {
    const option = new SlashCommandOptionBuilder(
      SlashCommandOptionType.USER,
      name,
      description,
      required
    );
    this.command.options = this.command.options || [];
    this.command.options.push(option.build());
    return option;
  }

  addChannelOption(name: string, description: string, required = false): SlashCommandOptionBuilder {
    const option = new SlashCommandOptionBuilder(
      SlashCommandOptionType.CHANNEL,
      name,
      description,
      required
    );
    this.command.options = this.command.options || [];
    this.command.options.push(option.build());
    return option;
  }

  addRoleOption(name: string, description: string, required = false): SlashCommandOptionBuilder {
    const option = new SlashCommandOptionBuilder(
      SlashCommandOptionType.ROLE,
      name,
      description,
      required
    );
    this.command.options = this.command.options || [];
    this.command.options.push(option.build());
    return option;
  }

  addMentionableOption(
    name: string,
    description: string,
    required = false
  ): SlashCommandOptionBuilder {
    const option = new SlashCommandOptionBuilder(
      SlashCommandOptionType.MENTIONABLE,
      name,
      description,
      required
    );
    this.command.options = this.command.options || [];
    this.command.options.push(option.build());
    return option;
  }

  addAttachmentOption(
    name: string,
    description: string,
    required = false
  ): SlashCommandOptionBuilder {
    const option = new SlashCommandOptionBuilder(
      SlashCommandOptionType.ATTACHMENT,
      name,
      description,
      required
    );
    this.command.options = this.command.options || [];
    this.command.options.push(option.build());
    return option;
  }

  addSubcommand(name: string, description: string): SlashCommandSubcommandBuilder {
    const subcommand = new SlashCommandSubcommandBuilder(name, description);
    this.command.options = this.command.options || [];
    this.command.options.push(subcommand.build());
    return subcommand;
  }

  addSubcommandGroup(name: string, description: string): SlashCommandSubcommandGroupBuilder {
    const group = new SlashCommandSubcommandGroupBuilder(name, description);
    this.command.options = this.command.options || [];
    this.command.options.push(group.build());
    return group;
  }

  build(): SlashCommand {
    return { ...this.command };
  }
}

export class SlashCommandOptionBuilder {
  private option: SlashCommandOption;

  constructor(type: SlashCommandOptionType, name: string, description: string, required = false) {
    this.option = {
      type,
      name: name.toLowerCase(),
      description,
      required,
    };
  }

  setRequired(required: boolean): this {
    this.option.required = required;
    return this;
  }

  addChoice(name: string, value: string | number): this {
    this.option.choices = this.option.choices || [];
    this.option.choices.push({ name, value });
    return this;
  }

  addChoices(choices: SlashCommandChoice[]): this {
    this.option.choices = this.option.choices || [];
    this.option.choices.push(...choices);
    return this;
  }

  setMinValue(min: number): this {
    this.option.min_value = min;
    return this;
  }

  setMaxValue(max: number): this {
    this.option.max_value = max;
    return this;
  }

  setMinMaxValue(min: number, max: number): this {
    this.option.min_value = min;
    this.option.max_value = max;
    return this;
  }

  build(): SlashCommandOption {
    return { ...this.option };
  }
}

export class SlashCommandSubcommandBuilder {
  private subcommand: SlashCommandOption;

  constructor(name: string, description: string) {
    this.subcommand = {
      type: SlashCommandOptionType.SUB_COMMAND,
      name: name.toLowerCase(),
      description,
      options: [],
    };
  }

  addStringOption(name: string, description: string, required = false): SlashCommandOptionBuilder {
    const option = new SlashCommandOptionBuilder(
      SlashCommandOptionType.STRING,
      name,
      description,
      required
    );
    this.subcommand.options = this.subcommand.options || [];
    this.subcommand.options.push(option.build());
    return option;
  }

  addIntegerOption(name: string, description: string, required = false): SlashCommandOptionBuilder {
    const option = new SlashCommandOptionBuilder(
      SlashCommandOptionType.INTEGER,
      name,
      description,
      required
    );
    this.subcommand.options = this.subcommand.options || [];
    this.subcommand.options.push(option.build());
    return option;
  }

  addUserOption(name: string, description: string, required = false): SlashCommandOptionBuilder {
    const option = new SlashCommandOptionBuilder(
      SlashCommandOptionType.USER,
      name,
      description,
      required
    );
    this.subcommand.options = this.subcommand.options || [];
    this.subcommand.options.push(option.build());
    return option;
  }

  build(): SlashCommandOption {
    return { ...this.subcommand };
  }
}

export class SlashCommandSubcommandGroupBuilder {
  private group: SlashCommandOption;

  constructor(name: string, description: string) {
    this.group = {
      type: SlashCommandOptionType.SUB_COMMAND_GROUP,
      name: name.toLowerCase(),
      description,
      options: [],
    };
  }

  addSubcommand(name: string, description: string): SlashCommandSubcommandBuilder {
    const subcommand = new SlashCommandSubcommandBuilder(name, description);
    this.group.options = this.group.options || [];
    this.group.options.push(subcommand.build());
    return subcommand;
  }

  build(): SlashCommandOption {
    return { ...this.group };
  }
}
