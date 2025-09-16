import { type CommonDatabase, schema } from '../db/index';

export abstract class BaseProcessor<T = unknown> {
  constructor(protected db: CommonDatabase) {}

  abstract process(data: T): Promise<void>;

  protected async upsertUser(user: unknown) {
    if (!this.validateUser(user)) {
      return;
    }

    const userData = user as Record<string, unknown>;

    try {
      await this.db
        .insert(schema.users)
        .values({
          id: userData.id as string,
          username: (userData.username as string) || 'Unknown',
          discriminator: (userData.discriminator as string) || '0000',
          avatar: userData.avatar as string | null,
          bot: (userData.bot as boolean) || false,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: schema.users.id,
          set: {
            username: (userData.username as string) || 'Unknown',
            discriminator: (userData.discriminator as string) || '0000',
            avatar: userData.avatar as string | null,
            updatedAt: new Date(),
          },
        });
    } catch (error) {
      throw new Error(`Failed to upsert user: ${error}`);
    }
  }

  private validateUser(user: unknown): boolean {
    if (!user || typeof user !== 'object') {
      return false;
    }

    const u = user as Record<string, unknown>;

    return !!(u.id && typeof u.id === 'string');
  }

  protected async upsertGuild(guild: unknown) {
    if (!this.validateGuildData(guild)) {
      return;
    }

    const guildData = guild as Record<string, unknown>;

    try {
      await this.db
        .insert(schema.guilds)
        .values({
          id: guildData.id as string,
          name: (guildData.name as string) || 'Unknown Guild',
          icon: guildData.icon as string | null,
          ownerId: (guildData.owner_id as string) || '',
          memberCount: (guildData.member_count as number) || 0,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: schema.guilds.id,
          set: {
            name: (guildData.name as string) || 'Unknown Guild',
            icon: guildData.icon as string | null,
            ownerId: (guildData.owner_id as string) || '',
            memberCount: (guildData.member_count as number) || 0,
            updatedAt: new Date(),
          },
        });
    } catch (error) {
      throw new Error(`Failed to upsert guild: ${error}`);
    }
  }

  private validateGuildData(guild: unknown): boolean {
    if (!guild || typeof guild !== 'object') {
      return false;
    }

    const g = guild as Record<string, unknown>;

    return !!(g.id && typeof g.id === 'string');
  }

  protected async upsertChannel(channel: unknown) {
    if (!this.validateChannelData(channel)) {
      return;
    }

    const channelData = channel as Record<string, unknown>;

    try {
      await this.db
        .insert(schema.channels)
        .values({
          id: channelData.id as string,
          guildId: channelData.guild_id as string,
          name: (channelData.name as string) || 'Unknown Channel',
          type: (channelData.type as number) || 0,
          parentId: channelData.parent_id as string | null,
        })
        .onConflictDoNothing();
    } catch (error) {
      throw new Error(`Failed to upsert channel: ${error}`);
    }
  }

  private validateChannelData(channel: unknown): boolean {
    if (!channel || typeof channel !== 'object') {
      return false;
    }

    const c = channel as Record<string, unknown>;

    return !!(c.id && typeof c.id === 'string' && c.guild_id && typeof c.guild_id === 'string');
  }
}
