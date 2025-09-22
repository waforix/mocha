import { Client } from "pg";
import { Event } from "../enums";
import { Intents } from "../enums/gateway/intents";
import { Dispatcher } from "../events";
import { ChannelCreate, ChannelDelete, ChannelPinsUpdate, ChannelUpdate, GuildCreate, GuildDelete, GuildRoleCreate, GuildRoleDelete, GuildRoleUpdate, GuildUpdate, StageInstanceCreate, StageInstanceDelete, StageInstanceUpdate, ThreadCreate, ThreadDelete, ThreadListSync, ThreadMemberUpdate, ThreadUpdate } from "../types/event/eventData";
import type { EventHandler } from "../types/eventHandler";
import { Handler } from "./handler";

class GuildHandler extends Handler {
    public constructor(
        dispatcher: Dispatcher
    ) {
        super([Intents.GUILDS]);
        dispatcher.on(Event.GUILD_CREATE, this.handleGuildCreate);
        dispatcher.on(Event.GUILD_UPDATE, this.handleGuildUpdate);
        dispatcher.on(Event.GUILD_DELETE, this.handleGuildDelete);
        dispatcher.on(Event.GUILD_ROLE_CREATE, this.handleGuildRoleCreate);
        dispatcher.on(Event.GUILD_ROLE_UPDATE, this.handleGuildRoleUpdate);
        dispatcher.on(Event.GUILD_ROLE_DELETE, this.handleGuildRoleDelete);
        dispatcher.on(Event.CHANNEL_CREATE, this.handleChannelCreate);
        dispatcher.on(Event.CHANNEL_UPDATE, this.handleChannelUpdate);
        dispatcher.on(Event.CHANNEL_DELETE, this.handleChannelDelete);
        dispatcher.on(Event.CHANNEL_PINS_UPDATE, this.handleChannelPinsUpdate);
        
    }

    public async handleGuildCreate (data: GuildCreate): Promise<void> {

    }

    public async handleGuildUpdate (data: GuildUpdate): Promise<void> {

    }

    public async handleGuildDelete (data: GuildDelete): Promise<void> {

    }

    public async handleGuildRoleCreate (data: GuildRoleCreate): Promise<void> {

    }

    public async handleGuildRoleUpdate (data: GuildRoleUpdate): Promise<void> {

    }

    public async handleGuildRoleDelete (data: GuildRoleDelete): Promise<void> {

    }

    public async handleChannelCreate (data: ChannelCreate): Promise<void> {

    }

    public async handleChannelUpdate (data: ChannelUpdate): Promise<void> {

    }

    public async handleChannelDelete (data: ChannelDelete): Promise<void> {

    }

    public async handleChannelPinsUpdate (data: ChannelPinsUpdate): Promise<void> {

    }

    public async handleThreadCreate (data: ThreadCreate): Promise<void> {

    }

    public async handleThreadUpdate (data: ThreadUpdate): Promise<void> {

    }

    public async handleThreadDelete (data: ThreadDelete): Promise<void> {

    }

    public async handleThreadListSync (data: ThreadListSync): Promise<void> {

    }

    public async handleThreadMemberUpdate (data: ThreadMemberUpdate): Promise<void> {

    }

    public async handleThreadMembersUpdate (data: ThreadMemberUpdate): Promise<void> {

    }

    public async handleStageInstanceCreate (data: StageInstanceCreate): Promise<void> {

    }

    public async handleStageInstanceUpdate (data: StageInstanceUpdate): Promise<void> {

    }

    public async handleStageInstanceDelete (data: StageInstanceDelete): Promise<void> {

    }
}