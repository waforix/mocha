import { BaseProcessor } from './base';

export class GuildProcessor extends BaseProcessor<unknown> {
  /**
   * Process a guild event
   */
  async process(guild: unknown) {
    if (!this.validateGuild(guild)) {
      return;
    }

    try {
      const guildData = guild as Record<string, unknown>;

      if (guildData.owner_id) {
        await this.upsertUser({ id: guildData.owner_id });
      }

      await this.upsertGuild(guild);

      await this.processGuildChannels(guildData);
      await this.processGuildMembers(guildData);
    } catch (error) {
      throw new Error(`Failed to process guild: ${error}`);
    }
  }

  private async processGuildChannels(guildData: Record<string, unknown>) {
    if (!guildData.channels || !Array.isArray(guildData.channels)) {
      return;
    }

    for (const channel of guildData.channels) {
      if (this.validateChannel(channel)) {
        await this.upsertChannel({ ...channel, guild_id: guildData.id });
      }
    }
  }

  private async processGuildMembers(guildData: Record<string, unknown>) {
    if (!guildData.members || !Array.isArray(guildData.members)) {
      return;
    }

    for (const member of guildData.members) {
      if (this.validateMember(member)) {
        await this.processSingleMember(member, guildData.id as string);
      }
    }
  }

  private async processSingleMember(member: unknown, guildId: string) {
    const memberData = member as Record<string, unknown>;
    if (!memberData.user) {
      return;
    }

    await this.upsertUser(memberData.user);

    await this.db.member.upsert({
      where: {
        id: `${guildId}-${(memberData.user as Record<string, unknown>).id}`,
      },
      create: {
        id: `${guildId}-${(memberData.user as Record<string, unknown>).id}`,
        guildId,
        userId: (memberData.user as Record<string, unknown>).id as string,
        nick: memberData.nick as string | undefined,
        roles: JSON.stringify(memberData.roles || []),
        joinedAt: new Date(memberData.joined_at as string),
      },
      update: {},
    });
  }

  private validateGuild(guild: unknown): guild is Record<string, unknown> {
    if (!guild || typeof guild !== 'object') {
      return false;
    }

    const g = guild as Record<string, unknown>;

    return !!(g.id && typeof g.id === 'string' && g.name && typeof g.name === 'string');
  }

  private validateChannel(channel: unknown): boolean {
    if (!channel || typeof channel !== 'object') {
      return false;
    }

    const c = channel as Record<string, unknown>;

    return !!(c.id && typeof c.id === 'string' && typeof c.type === 'number');
  }

  private validateMember(member: unknown): boolean {
    if (!member || typeof member !== 'object') {
      return false;
    }

    const m = member as Record<string, unknown>;

    return !!(
      m.user &&
      typeof m.user === 'object' &&
      m.joined_at &&
      typeof m.joined_at === 'string'
    );
  }
}
