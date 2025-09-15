import { schema } from '../db/index';
import { BaseProcessor } from './base';

export class GuildProcessor extends BaseProcessor<unknown> {
  async process(guild: unknown) {
    await this.upsertGuild(guild);

    const guildData = guild as Record<string, unknown>;

    if (guildData.channels && Array.isArray(guildData.channels)) {
      for (const channel of guildData.channels) {
        await this.upsertChannel({ ...channel, guild_id: guildData.id });
      }
    }

    if (guildData.members && Array.isArray(guildData.members)) {
      for (const member of guildData.members) {
        const memberData = member as Record<string, unknown>;
        if (memberData.user) {
          await this.upsertUser(memberData.user);

          await this.db
            .insert(schema.members)
            .values({
              guildId: guildData.id as string,
              userId: (memberData.user as Record<string, unknown>).id as string,
              nick: memberData.nick as string | undefined,
              roles: JSON.stringify(memberData.roles),
              joinedAt: new Date(memberData.joined_at as string),
            })
            .onConflictDoNothing();
        }
      }
    }
  }
}
