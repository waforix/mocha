export interface DiscordMessage {
  content?: string;
  embeds?: DiscordEmbed[];
  components?: DiscordActionRow[];
  attachments?: DiscordAttachment[];
  flags?: number;
  tts?: boolean;
  allowed_mentions?: AllowedMentions;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  author?: EmbedAuthor;
  fields?: EmbedField[];
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedFooter {
  text: string;
  icon_url?: string;
}

export interface EmbedImage {
  url: string;
  height?: number;
  width?: number;
}

export interface EmbedThumbnail {
  url: string;
  height?: number;
  width?: number;
}

export interface EmbedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
}

export interface DiscordActionRow {
  type: 1; // ACTION_ROW
  components: DiscordComponent[];
}

export interface DiscordComponent {
  type: number;
  style?: number;
  label?: string;
  emoji?: PartialEmoji;
  custom_id?: string;
  url?: string;
  disabled?: boolean;
  placeholder?: string;
  min_values?: number;
  max_values?: number;
  options?: SelectOption[];
}

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  emoji?: PartialEmoji;
  default?: boolean;
}

export interface PartialEmoji {
  id?: string;
  name?: string;
  animated?: boolean;
}

export interface DiscordAttachment {
  id: string;
  filename: string;
  description?: string;
  content_type?: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number;
  width?: number;
}

export interface AllowedMentions {
  parse?: ('roles' | 'users' | 'everyone')[];
  roles?: string[];
  users?: string[];
  replied_user?: boolean;
}

export class MessageBuilder {
  private message: DiscordMessage = {};

  setContent(content: string): this {
    this.message.content = content;
    return this;
  }

  addEmbed(embed: DiscordEmbed): this {
    this.message.embeds = this.message.embeds || [];
    this.message.embeds.push(embed);
    return this;
  }

  addEmbeds(embeds: DiscordEmbed[]): this {
    this.message.embeds = this.message.embeds || [];
    this.message.embeds.push(...embeds);
    return this;
  }

  addComponent(component: DiscordActionRow): this {
    this.message.components = this.message.components || [];
    this.message.components.push(component);
    return this;
  }

  addComponents(components: DiscordActionRow[]): this {
    this.message.components = this.message.components || [];
    this.message.components.push(...components);
    return this;
  }

  setTTS(tts: boolean): this {
    this.message.tts = tts;
    return this;
  }

  setFlags(flags: number): this {
    this.message.flags = flags;
    return this;
  }

  setAllowedMentions(mentions: AllowedMentions): this {
    this.message.allowed_mentions = mentions;
    return this;
  }

  suppressEmbeds(): this {
    this.message.flags = (this.message.flags || 0) | (1 << 2);
    return this;
  }

  ephemeral(): this {
    this.message.flags = (this.message.flags || 0) | (1 << 6);
    return this;
  }

  build(): DiscordMessage {
    return { ...this.message };
  }
}

export class ActionRowBuilder {
  private row: DiscordActionRow = {
    type: 1,
    components: [],
  };

  addComponent(component: DiscordComponent): this {
    if (this.row.components.length >= 5) {
      throw new Error('Action row can only contain up to 5 components');
    }
    this.row.components.push(component);
    return this;
  }

  addComponents(components: DiscordComponent[]): this {
    for (const component of components) {
      this.addComponent(component);
    }
    return this;
  }

  build(): DiscordActionRow {
    return { ...this.row };
  }
}

export class ButtonBuilder {
  private button: DiscordComponent = {
    type: 2, // BUTTON
  };

  setStyle(style: 'primary' | 'secondary' | 'success' | 'danger' | 'link'): this {
    const styles = {
      primary: 1,
      secondary: 2,
      success: 3,
      danger: 4,
      link: 5,
    };
    this.button.style = styles[style];
    return this;
  }

  setLabel(label: string): this {
    this.button.label = label;
    return this;
  }

  setCustomId(customId: string): this {
    this.button.custom_id = customId;
    return this;
  }

  setURL(url: string): this {
    this.button.url = url;
    this.button.style = 5; // Link style
    return this;
  }

  setEmoji(emoji: PartialEmoji): this {
    this.button.emoji = emoji;
    return this;
  }

  setDisabled(disabled: boolean): this {
    this.button.disabled = disabled;
    return this;
  }

  build(): DiscordComponent {
    return { ...this.button };
  }
}

export class SelectMenuBuilder {
  private select: DiscordComponent = {
    type: 3, // SELECT_MENU
    options: [],
  };

  setCustomId(customId: string): this {
    this.select.custom_id = customId;
    return this;
  }

  setPlaceholder(placeholder: string): this {
    this.select.placeholder = placeholder;
    return this;
  }

  setMinValues(min: number): this {
    this.select.min_values = min;
    return this;
  }

  setMaxValues(max: number): this {
    this.select.max_values = max;
    return this;
  }

  addOption(option: SelectOption): this {
    this.select.options = this.select.options || [];
    this.select.options.push(option);
    return this;
  }

  addOptions(options: SelectOption[]): this {
    this.select.options = this.select.options || [];
    this.select.options.push(...options);
    return this;
  }

  setDisabled(disabled: boolean): this {
    this.select.disabled = disabled;
    return this;
  }

  build(): DiscordComponent {
    return { ...this.select };
  }
}
