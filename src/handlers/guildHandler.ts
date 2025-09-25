import { CommonDatabase } from '../db';
import { Events } from '../enums';
import { Intents } from '../enums/gateway/intents';
import type { EventDispatcher } from '../events';
import type {
    ChannelCreate,
    ChannelDelete,
    ChannelPinsUpdate,
    ChannelUpdate,
    GuildCreate,
    GuildDelete,
    GuildRoleCreate,
    GuildRoleDelete,
    GuildRoleUpdate,
    GuildUpdate,
    StageInstanceCreate,
    StageInstanceDelete,
    StageInstanceUpdate,
    ThreadCreate,
    ThreadDelete,
    ThreadListSync,
    ThreadMemberUpdate,
    ThreadUpdate,
} from '../types/event';
import { Handler } from './handler';
import { schema } from '../db';

export class GuildHandler extends Handler {
    public constructor(database: CommonDatabase, dispatcher: EventDispatcher) {
        super(database, [Intents.GUILDS]);
        dispatcher.on(Events.GUILD_CREATE, this.handleGuildCreate);
        dispatcher.on(Events.GUILD_UPDATE, this.handleGuildUpdate);
        dispatcher.on(Events.GUILD_DELETE, this.handleGuildDelete);
        dispatcher.on(Events.GUILD_ROLE_CREATE, this.handleGuildRoleCreate);
        dispatcher.on(Events.GUILD_ROLE_UPDATE, this.handleGuildRoleUpdate);
        dispatcher.on(Events.GUILD_ROLE_DELETE, this.handleGuildRoleDelete);
        dispatcher.on(Events.CHANNEL_CREATE, this.handleChannelCreate);
        dispatcher.on(Events.CHANNEL_UPDATE, this.handleChannelUpdate);
        dispatcher.on(Events.CHANNEL_DELETE, this.handleChannelDelete);
        dispatcher.on(Events.CHANNEL_PINS_UPDATE, this.handleChannelPinsUpdate);
    }

    public async handleGuildCreate(data: GuildCreate): Promise<void> {
        await this.database
            .insert(schema.guilds)
            .values({
                id: data.id,
                name: data.name,
                icon: data.icon,
                ownerId: data.ownerId,
                memberCount: data.memberCount,
                updatedAt: new Date()
            })
            .onConflictDoUpdate({
                target: schema.guilds.id,
                set: {
                    name: data.name,
                    icon: data.icon,
                    ownerId: data.ownerId,
                    memberCount: data.memberCount,
                    updatedAt: new Date()
                }
            });
    }

    public async handleGuildUpdate(data: GuildUpdate): Promise<void> {
        await this.database
            .update({
                target: schema.guilds.id,
                set: {
                    name: data.name,
                    icon: data.icon,
                    ownerId: data.ownerId,
                    updatedAt: new Date()
                }
            });
    }

    public async handleGuildDelete(data: GuildDelete): Promise<void> {}

    public async handleGuildRoleCreate(data: GuildRoleCreate): Promise<void> {}

    public async handleGuildRoleUpdate(data: GuildRoleUpdate): Promise<void> {}

    public async handleGuildRoleDelete(data: GuildRoleDelete): Promise<void> {}

    public async handleChannelCreate(data: ChannelCreate): Promise<void> {}

    public async handleChannelUpdate(data: ChannelUpdate): Promise<void> {}

    public async handleChannelDelete(data: ChannelDelete): Promise<void> {}

    public async handleChannelPinsUpdate(data: ChannelPinsUpdate): Promise<void> {}

    public async handleThreadCreate(data: ThreadCreate): Promise<void> {}

    public async handleThreadUpdate(data: ThreadUpdate): Promise<void> {}

    public async handleThreadDelete(data: ThreadDelete): Promise<void> {}

    public async handleThreadListSync(data: ThreadListSync): Promise<void> {}

    public async handleThreadMemberUpdate(data: ThreadMemberUpdate): Promise<void> {}

    public async handleThreadMembersUpdate(data: ThreadMemberUpdate): Promise<void> {}

    public async handleStageInstanceCreate(data: StageInstanceCreate): Promise<void> {}

    public async handleStageInstanceUpdate(data: StageInstanceUpdate): Promise<void> {}

    public async handleStageInstanceDelete(data: StageInstanceDelete): Promise<void> {}
}
