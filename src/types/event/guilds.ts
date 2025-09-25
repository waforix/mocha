import { ChannelType } from "../../enums";
import { Channel, Emoji, Guild, GuildMember, GuildScheduledEvent, Role, StageInstance, Sticker, ThreadMember, VoiceState } from "../api";
import { Presence } from "../api/presence";
import { Event } from "./event";

export type GuildCreate = Event<
    Guild & {
        joinedAt: Date;
        large: boolean;
        unavailable: boolean;
        geoRestricted?: boolean;
        memberCount: number;
        voiceStates: VoiceState[];
        members: GuildMember[];
        channels: Channel[];
        threads: Channel[];
        presences: Presence[];
        stageInstances: StageInstance[];
        guildScheduledEvents: GuildScheduledEvent[];
        properties: Partial<Guild>;
        stickers: Sticker[];
        roles: Role[];
        emojis: Emoji[];
        premiumSubscriptionCount: number;
    }
>;

export type GuildUpdate = Event<Guild>;

export type GuildDelete = Event<Guild>;

export type GuildRoleCreate = Event<{ guildId: string; role: Role }>;

export type GuildRoleUpdate = Event<{ guildId: string; role: Role }>;

export type GuildRoleDelete = Event<{ guildId: string; role: Role }>;

export type ChannelCreate = Event<Channel & { originChannelId?: string }>;

export type ChannelUpdate = Event<Channel>;

export type ChannelDelete = Event<Partial<Channel>>;

export type ChannelPinsUpdate = Event<
    Channel & { guildId?: string; channelId: string; lastPinTimestamp?: Date | null }
>;

export type ThreadCreate = Event<Channel & { newlyCreated?: boolean }>;

export type ThreadUpdate = Event<Channel>;

export type ThreadDelete = Event<{
    id: string;
    guildId: string;
    parentId: string;
    type: ChannelType;
}>;

export type ThreadListSync = Event<{
    guildId: string;
    channelIds?: string[];
    threads: Channel[];
    members: ThreadMember[];
}>;

export type ThreadMemberUpdate = Event<ThreadMember & { guildId: string }>;

export type ThreadMembersUpdate = Event<{
    id: string;
    guildId: string;
    memberCount: number;
    addedMembers: ThreadMember[];
    removedMemberIds: string[];
}>;

export type StageInstanceCreate = Event<StageInstance>;

export type StageInstanceUpdate = Event<StageInstance>;

export type StageInstanceDelete = Event<StageInstance>;