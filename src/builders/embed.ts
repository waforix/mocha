import type { DiscordEmbed, EmbedField } from './message';

export class EmbedBuilder {
  private embed: DiscordEmbed = {};

  setTitle(title: string): this {
    this.embed.title = title;
    return this;
  }

  setDescription(description: string): this {
    this.embed.description = description;
    return this;
  }

  setURL(url: string): this {
    this.embed.url = url;
    return this;
  }

  setTimestamp(timestamp?: Date | string | number): this {
    if (timestamp === undefined) {
      this.embed.timestamp = new Date().toISOString();
    } else if (timestamp instanceof Date) {
      this.embed.timestamp = timestamp.toISOString();
    } else if (typeof timestamp === 'number') {
      this.embed.timestamp = new Date(timestamp).toISOString();
    } else {
      this.embed.timestamp = timestamp;
    }
    return this;
  }

  setColor(color: number | string): this {
    if (typeof color === 'string') {
      // Handle hex color strings
      if (color.startsWith('#')) {
        this.embed.color = parseInt(color.slice(1), 16);
      } else if (color.startsWith('0x')) {
        this.embed.color = parseInt(color.slice(2), 16);
      } else {
        // Handle named colors
        const namedColors: Record<string, number> = {
          red: 0xff0000,
          green: 0x00ff00,
          blue: 0x0000ff,
          yellow: 0xffff00,
          orange: 0xffa500,
          purple: 0x800080,
          pink: 0xffc0cb,
          cyan: 0x00ffff,
          magenta: 0xff00ff,
          lime: 0x00ff00,
          indigo: 0x4b0082,
          violet: 0xee82ee,
          brown: 0xa52a2a,
          black: 0x000000,
          white: 0xffffff,
          gray: 0x808080,
          grey: 0x808080,
          silver: 0xc0c0c0,
          gold: 0xffd700,
          navy: 0x000080,
          teal: 0x008080,
          olive: 0x808000,
          maroon: 0x800000,
          aqua: 0x00ffff,
          fuchsia: 0xff00ff,
        };
        this.embed.color = namedColors[color.toLowerCase()] || 0x000000;
      }
    } else {
      this.embed.color = color;
    }
    return this;
  }

  setFooter(text: string, iconURL?: string): this {
    this.embed.footer = {
      text,
      icon_url: iconURL,
    };
    return this;
  }

  setImage(url: string, width?: number, height?: number): this {
    this.embed.image = {
      url,
      width,
      height,
    };
    return this;
  }

  setThumbnail(url: string, width?: number, height?: number): this {
    this.embed.thumbnail = {
      url,
      width,
      height,
    };
    return this;
  }

  setAuthor(name: string, url?: string, iconURL?: string): this {
    this.embed.author = {
      name,
      url,
      icon_url: iconURL,
    };
    return this;
  }

  addField(name: string, value: string, inline = false): this {
    this.embed.fields = this.embed.fields || [];
    this.embed.fields.push({
      name,
      value,
      inline,
    });
    return this;
  }

  addFields(fields: EmbedField[]): this {
    this.embed.fields = this.embed.fields || [];
    this.embed.fields.push(...fields);
    return this;
  }

  addBlankField(inline = false): this {
    return this.addField('\u200B', '\u200B', inline);
  }

  setFields(fields: EmbedField[]): this {
    this.embed.fields = fields;
    return this;
  }

  spliceFields(index: number, deleteCount: number, ...fields: EmbedField[]): this {
    this.embed.fields = this.embed.fields || [];
    this.embed.fields.splice(index, deleteCount, ...fields);
    return this;
  }

  // Utility methods for common embed patterns
  setSuccess(title?: string, description?: string): this {
    this.setColor(0x00ff00); // Green
    if (title) this.setTitle(`✅ ${title}`);
    if (description) this.setDescription(description);
    return this;
  }

  setError(title?: string, description?: string): this {
    this.setColor(0xff0000); // Red
    if (title) this.setTitle(`❌ ${title}`);
    if (description) this.setDescription(description);
    return this;
  }

  setWarning(title?: string, description?: string): this {
    this.setColor(0xffff00); // Yellow
    if (title) this.setTitle(`⚠️ ${title}`);
    if (description) this.setDescription(description);
    return this;
  }

  setInfo(title?: string, description?: string): this {
    this.setColor(0x0099ff); // Blue
    if (title) this.setTitle(`ℹ️ ${title}`);
    if (description) this.setDescription(description);
    return this;
  }

  setLoading(title?: string, description?: string): this {
    this.setColor(0x808080); // Gray
    if (title) this.setTitle(`⏳ ${title}`);
    if (description) this.setDescription(description);
    return this;
  }

  // Discord branding colors
  setDiscordColor(
    color:
      | 'blurple'
      | 'greyple'
      | 'dark_but_not_black'
      | 'not_quite_black'
      | 'green'
      | 'yellow'
      | 'fuchsia'
      | 'red'
  ): this {
    const discordColors = {
      blurple: 0x5865f2,
      greyple: 0x99aab5,
      dark_but_not_black: 0x2c2f33,
      not_quite_black: 0x23272a,
      green: 0x57f287,
      yellow: 0xfee75c,
      fuchsia: 0xeb459e,
      red: 0xed4245,
    };
    this.setColor(discordColors[color]);
    return this;
  }

  // Random color
  setRandomColor(): this {
    this.setColor(Math.floor(Math.random() * 0xffffff));
    return this;
  }

  // Clear specific properties
  clearTitle(): this {
    this.embed.title = undefined;
    return this;
  }

  clearDescription(): this {
    this.embed.description = undefined;
    return this;
  }

  clearFields(): this {
    this.embed.fields = [];
    return this;
  }

  clearFooter(): this {
    this.embed.footer = undefined;
    return this;
  }

  clearImage(): this {
    this.embed.image = undefined;
    return this;
  }

  clearThumbnail(): this {
    this.embed.thumbnail = undefined;
    return this;
  }

  clearAuthor(): this {
    this.embed.author = undefined;
    return this;
  }

  clearColor(): this {
    this.embed.color = undefined;
    return this;
  }

  clearTimestamp(): this {
    this.embed.timestamp = undefined;
    return this;
  }

  clearURL(): this {
    this.embed.url = undefined;
    return this;
  }

  // Validation
  isValid(): boolean {
    const titleLength = this.embed.title?.length || 0;
    const descriptionLength = this.embed.description?.length || 0;
    const fieldsLength =
      this.embed.fields?.reduce((acc, field) => acc + field.name.length + field.value.length, 0) ||
      0;
    const footerLength = this.embed.footer?.text.length || 0;
    const authorLength = this.embed.author?.name.length || 0;

    const totalLength =
      titleLength + descriptionLength + fieldsLength + footerLength + authorLength;

    return (
      titleLength <= 256 &&
      descriptionLength <= 4096 &&
      (this.embed.fields?.length || 0) <= 25 &&
      (this.embed.fields?.every(
        (field) => field.name.length <= 256 && field.value.length <= 1024
      ) ??
        true) &&
      footerLength <= 2048 &&
      authorLength <= 256 &&
      totalLength <= 6000
    );
  }

  build(): DiscordEmbed {
    if (!this.isValid()) {
      throw new Error('Embed exceeds Discord limits');
    }
    return { ...this.embed };
  }
}
