import type { getDb } from '../db/index';
import { schema } from '../db/index';

export abstract class BaseProcessor<T = unknown> {
  constructor(protected db: ReturnType<typeof getDb>) {}

  abstract process(data: T): Promise<void>;

  protected async upsertUser(user: unknown) {
    const userData = user as Record<string, unknown>;
    if (!userData?.id) return;

    await this.db
      .insert(schema.users)
      .values({
        id: userData.id as string,
        username: userData.username as string,
        discriminator: userData.discriminator as string,
        avatar: userData.avatar as string | null,
        bot: (userData.bot as boolean) || false,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.users.id,
        set: {
          username: userData.username as string,
          discriminator: userData.discriminator as string,
          avatar: userData.avatar as string | null,
          updatedAt: new Date(),
        },
      });
  }

  protected async upsertGuild(guild: unknown) {
    const guildData = guild as Record<string, unknown>;
    if (!guildData?.id) return;

    await this.db
      .insert(schema.guilds)
      .values({
        id: guildData.id as string,
        name: guildData.name as string,
        icon: guildData.icon as string | null,
        ownerId: guildData.owner_id as string,
        memberCount: guildData.member_count as number,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.guilds.id,
        set: {
          name: guildData.name as string,
          icon: guildData.icon as string | null,
          ownerId: guildData.owner_id as string,
          memberCount: guildData.member_count as number,
          updatedAt: new Date(),
        },
      });
  }

  protected async upsertChannel(channel: unknown) {
    const channelData = channel as Record<string, unknown>;
    if (!channelData?.id) return;

    await this.db
      .insert(schema.channels)
      .values({
        id: channelData.id as string,
        guildId: channelData.guild_id as string,
        name: channelData.name as string,
        type: channelData.type as number,
        parentId: channelData.parent_id as string | null,
      })
      .onConflictDoNothing();
  }
}
