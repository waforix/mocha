import { schema } from '../db/index';
export class BaseProcessor {
    db;
    constructor(db) {
        this.db = db;
    }
    async upsertUser(user) {
        const userData = user;
        if (!userData?.id)
            return;
        await this.db
            .insert(schema.users)
            .values({
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar: userData.avatar,
            bot: userData.bot || false,
            updatedAt: new Date(),
        })
            .onConflictDoUpdate({
            target: schema.users.id,
            set: {
                username: userData.username,
                discriminator: userData.discriminator,
                avatar: userData.avatar,
                updatedAt: new Date(),
            },
        });
    }
    async upsertGuild(guild) {
        const guildData = guild;
        if (!guildData?.id)
            return;
        await this.db
            .insert(schema.guilds)
            .values({
            id: guildData.id,
            name: guildData.name,
            icon: guildData.icon,
            ownerId: guildData.owner_id,
            memberCount: guildData.member_count,
            updatedAt: new Date(),
        })
            .onConflictDoUpdate({
            target: schema.guilds.id,
            set: {
                name: guildData.name,
                icon: guildData.icon,
                ownerId: guildData.owner_id,
                memberCount: guildData.member_count,
                updatedAt: new Date(),
            },
        });
    }
    async upsertChannel(channel) {
        const channelData = channel;
        if (!channelData?.id)
            return;
        await this.db
            .insert(schema.channels)
            .values({
            id: channelData.id,
            guildId: channelData.guild_id,
            name: channelData.name,
            type: channelData.type,
            parentId: channelData.parent_id,
        })
            .onConflictDoNothing();
    }
}
