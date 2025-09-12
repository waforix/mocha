import { schema } from '../db/index';
import { BaseProcessor } from './base';
export class GuildProcessor extends BaseProcessor {
    async process(guild) {
        await this.upsertGuild(guild);
        const guildData = guild;
        if (guildData.channels && Array.isArray(guildData.channels)) {
            for (const channel of guildData.channels) {
                await this.upsertChannel({ ...channel, guild_id: guildData.id });
            }
        }
        if (guildData.members && Array.isArray(guildData.members)) {
            for (const member of guildData.members) {
                const memberData = member;
                if (memberData.user) {
                    await this.upsertUser(memberData.user);
                    await this.db
                        .insert(schema.members)
                        .values({
                        guildId: guildData.id,
                        userId: memberData.user.id,
                        nick: memberData.nick,
                        roles: JSON.stringify(memberData.roles),
                        joinedAt: new Date(memberData.joined_at),
                    })
                        .onConflictDoNothing();
                }
            }
        }
    }
}
