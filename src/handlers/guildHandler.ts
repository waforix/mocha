import type { CommonDatabase } from '../db';
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
    await this.database.guild.upsert({
      where: {
        id: data.id,
      },
      create: {
        id: data.id,
        name: data.name,
        icon: data.icon,
        ownerId: data.ownerId,
        memberCount: data.memberCount,
      },
      update: {
        name: data.name,
        icon: data.icon,
        ownerId: data.ownerId,
        memberCount: data.memberCount,
        updatedAt: new Date(),
      },
    });
  }

  public async handleGuildUpdate(data: GuildUpdate): Promise<void> {
    await this.database.guild.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        icon: data.icon,
        ownerId: data.ownerId,
        updatedAt: new Date(),
      },
    });
  }

  public async handleGuildDelete(_data: GuildDelete): Promise<void> {}

  public async handleGuildRoleCreate(_data: GuildRoleCreate): Promise<void> {}

  public async handleGuildRoleUpdate(_data: GuildRoleUpdate): Promise<void> {}

  public async handleGuildRoleDelete(_data: GuildRoleDelete): Promise<void> {}

  public async handleChannelCreate(_data: ChannelCreate): Promise<void> {}

  public async handleChannelUpdate(_data: ChannelUpdate): Promise<void> {}

  public async handleChannelDelete(_data: ChannelDelete): Promise<void> {}

  public async handleChannelPinsUpdate(_data: ChannelPinsUpdate): Promise<void> {}

  public async handleThreadCreate(_data: ThreadCreate): Promise<void> {}

  public async handleThreadUpdate(_data: ThreadUpdate): Promise<void> {}

  public async handleThreadDelete(_data: ThreadDelete): Promise<void> {}

  public async handleThreadListSync(_data: ThreadListSync): Promise<void> {}

  public async handleThreadMemberUpdate(_data: ThreadMemberUpdate): Promise<void> {}

  public async handleThreadMembersUpdate(_data: ThreadMemberUpdate): Promise<void> {}

  public async handleStageInstanceCreate(_data: StageInstanceCreate): Promise<void> {}

  public async handleStageInstanceUpdate(_data: StageInstanceUpdate): Promise<void> {}

  public async handleStageInstanceDelete(_data: StageInstanceDelete): Promise<void> {}
}
