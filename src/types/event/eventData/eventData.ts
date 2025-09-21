import { ChannelType, DataMode, InviteTargetType } from "../../../enums";
import { Application, AuditLogEntry, Channel, Emoji, Entitlement, Guild, GuildMember, GuildMessage, GuildScheduledEvent, Integration, Interaction, Message, MessageReaction, PollVote, Presence, Role, SoundboardSound, StageInstance, Sticker, Subscription, ThreadMember, Typing, User, VoiceChannelEffect, VoiceState } from "../../api";


export type EventData<T extends unknown> = {
    d: T;
}

/**
 * GUILDS
 */
export type GuildCreate = EventData<Guild & {
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
    dataMode: DataMode;
    properties: Partial<Guild>;
    stickers: Sticker[];
    roles: Role[];
    emojis: Emoji[];
    premiumSubscriptionCount: number;
}>;
export type GuildUpdate = EventData<Guild>;
export type GuildDelete = EventData<Guild>;
export type GuildRoleCreate = EventData<{ guildId: string; role: Role; }>;
export type GuildRoleUpdate = EventData<{ guildId: string; role: Role; }>;
export type GuildRoleDelete = EventData<{ guildId: string; role: Role; }>;
export type ChannelCreate = EventData<Channel & { originChannelId?: string; }>;
export type ChannelUpdate = EventData<Channel>;
export type ChannelDelete = EventData<Partial<Channel>>;
export type ChannelPinsUpdate = EventData<Channel & { guildId?: string; channelId: string; lastPinTimestamp?: Date | null; }>;
export type ThreadCreate = EventData<Channel & { newlyCreated?: boolean; }>;
export type ThreadUpdate = EventData<Channel>;
export type ThreadDelete = EventData<{ id: string; guildId: string; parentId: string; type: ChannelType; }>;
export type ThreadListSync = EventData<{ guildId: string; channelIds?: string[]; threads: Channel[]; members: ThreadMember[]; }>;
export type ThreadMemberUpdate = EventData<ThreadMember & { guildId: string }>;
export type ThreadMembersUpdate = EventData<{ id: string; guildId: string; memberCount: number; addedMembers: ThreadMember[]; removedMemberIds: string[] }>;
export type StageInstanceCreate = EventData<StageInstance>;
export type StageInstanceUpdate = EventData<StageInstance>;
export type StageInstanceDelete = EventData<StageInstance>;

/**
 * GUILD_MEMBERS
 */
export type GuildMemberAdd = EventData<GuildMember & { guildId: string }>;
export type GuildMemberUpdate = EventData<Omit<Partial<GuildMember>, "user" | "roles" | "avatar" | "banner" | "joinedAt"> & {
    guildId: string;
    user: User;
    roles: Role[];
    avatar: string | null;
    banner: string | null;
    joinedAt: Date;
}>;
export type GuildMemberRemove = EventData<{ guildId: string; user: User }>;

/**
 * GUILD_MODERATION
 */
export type GuildAuditLogEntryCreate = EventData<AuditLogEntry>;
export type GuildBanAdd = EventData<{ guildId: string; user: Partial<User>; deleteMessageSecs: number; }>;
export type GuildBanRemove = EventData<{ guildId: string; user: Partial<User>; }>;

/**
 * GUILD_EXPRESSIONS
 */
export type GuildEmojisUpdate = EventData<{ guildId: string; emojis: Emoji[]; }>;
export type GuildStickersUpdate = EventData<{ guildId: string; stickers: Sticker[]; }>;
export type GuildSoundboardSoundCreate = EventData<SoundboardSound>;
export type GuildSoundboardSoundUpdate = EventData<SoundboardSound>;
export type GuildSoundboardSoundDelete = EventData<SoundboardSound>;
export type GuildSoundboardSoundsUpdate = EventData<{ guildId: string; soundboardSounds: SoundboardSound[]; }>;

/**
 * GUILD_INTEGRATIONS
 */
export type GuildIntegrationsUpdate = EventData<{ guildId: string }>;
export type IntegrationCreate = EventData<Integration & { guildId: string; }>;
export type IntegrationUpdate = EventData<Integration & { guildId: string; }>;
export type IntegrationDelete = EventData<{ id: string; guildId: string; applicationId: string; }>;

/**
 * GUILD_WEBHOOKS
 */
export type WebhooksUpdate = EventData<{ guildId: string; channelId: string; }>;

/**
 * GUILD_INVITES
 */
export type InviteCreate = EventData<{ channelId: string; code: string; createdAt: Date; guildId?: string; inviter?: User; maxAge: number; maxUses: number; targetType?: InviteTargetType; targetUser?: User; targetApplication?: Partial<Application>; temporary: boolean; uses: number; expiresAt: Date | null; }>;
export type InviteDelete = EventData<{ channelId: string; guildId?: string; code: string; }>;

/**
 * GUILD_VOICE_STATES
 */
export type VoiceChannelEffectSend = EventData<VoiceChannelEffect>;
export type VoiceStateUpdate = EventData<VoiceState>;

/**
 * GUILD_PRESENCES
 */
export type PresenceUpdate = EventData<Presence>;

/**
 * GUILD_MESSAGES | DIRECT MESSAGES
 */
export type MessageCreate = EventData<GuildMessage>;
export type MessageUpdate = EventData<Message>;
export type MessageDelete = EventData<{ id: string; channelId: string; guildId?: string; }>;
export type MessageDeleteBulk = EventData<{ ids: string[]; channelId: string; guildId?: string; }>;

/**
 * GUILD_MESSAGE_REACTIONS | DIRECT_MESSAGE_REACTIONS
 */
export type MessageReactionAdd = EventData<MessageReaction>;
export type MessageReactionRemove = EventData<Omit<MessageReaction, "member" | "message_author_id" | "burst_colors">>;
export type MessageReactionRemoveAll = EventData<{ channelId: string, messageId: string; guildId?: string; }>;
export type MessageReactionRemoveEmoji = EventData<{ channelId: string; guildId?: string; messageId: string; emoji: Partial<Emoji>; }>;

/**
 * GUILD_MESSAGE_TYPING | DIRECT_MESSAGE_TYPING
 */
export type TypingStart = EventData<Typing>;

/**
 * GUILD_SCHEDULED_EVENTS
 */
export type GuildScheduledEventCreate = EventData<GuildScheduledEvent>;
export type GuildScheduledEventUpdate = EventData<GuildScheduledEvent>;
export type GuildScheduledEventDelete = EventData<GuildScheduledEvent>;
export type GuildScheduledEventUserAdd = EventData<{ guildScheduledEventId: string; userId: string; guildId: string; }>;
export type GuildScheduledEventUserRemove = EventData<{ guildScheduledEventId: string; userId: string; guildId: string; }>;

/**
 * GUILD_MESSAGE_POLLS | DIRECT_MESSAGE_POLLS
 */
export type MessagePollVoteAdd = EventData<PollVote>;
export type MessagePollVoteRemove = EventData<PollVote>;

/**
 * PASSTHROUGH
 */
export type EntitlementCreate = EventData<Entitlement>;
export type EntitlementUpdate = EventData<Entitlement & { endsAt: Date }>;
export type EntitlementDelete = EventData<Entitlement>;
export type GuildMembersChunk = EventData<{ guildId: string; members: GuildMember[]; chunkIndex: number; chunkCount: number; notFound?: number[]; presences: Presence[]; nonce?: string; }>;
export type InteractionCreate = EventData<Interaction>;
export type SubscriptionCreate = EventData<Subscription>;
export type SubscriptionUpdate = EventData<Subscription>;
export type SubscriptionDelete = EventData<Subscription>;
export type UserUpdate = EventData<User>;
export type VoiceServerUpdate = EventData<{ token: string; guildId: string; endpoint: string; }>;