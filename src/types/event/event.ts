
export type Event<T> = T;

/**
 * GUILDS
 */


/**
 * GUILD_MEMBERS
 */
export type GuildMemberAdd = EventData<GuildMember & { guildId: string }>;
export type GuildMemberUpdate = EventData<
    Omit<Partial<GuildMember>, "user" | "roles" | "avatar" | "banner" | "joinedAt"> & {
        guildId: string;
        user: User;
        roles: Role[];
        avatar: string | null;
        banner: string | null;
        joinedAt: Date;
    }
>;
export type GuildMemberRemove = EventData<{ guildId: string; user: User }>;

/**
 * GUILD_MODERATION
 */
export type GuildAuditLogEntryCreate = EventData<AuditLogEntry>;
export type GuildBanAdd = EventData<{
    guildId: string;
    user: Partial<User>;
    deleteMessageSecs: number;
}>;
export type GuildBanRemove = EventData<{ guildId: string; user: Partial<User> }>;

/**
 * GUILD_EXPRESSIONS
 */
export type GuildEmojisUpdate = EventData<{ guildId: string; emojis: Emoji[] }>;
export type GuildStickersUpdate = EventData<{ guildId: string; stickers: Sticker[] }>;
export type GuildSoundboardSoundCreate = EventData<SoundboardSound>;
export type GuildSoundboardSoundUpdate = EventData<SoundboardSound>;
export type GuildSoundboardSoundDelete = EventData<SoundboardSound>;
export type GuildSoundboardSoundsUpdate = EventData<{
    guildId: string;
    soundboardSounds: SoundboardSound[];
}>;

/**
 * GUILD_INTEGRATIONS
 */
export type GuildIntegrationsUpdate = EventData<{ guildId: string }>;
export type IntegrationCreate = EventData<Integration & { guildId: string }>;
export type IntegrationUpdate = EventData<Integration & { guildId: string }>;
export type IntegrationDelete = EventData<{ id: string; guildId: string; applicationId: string }>;

/**
 * GUILD_WEBHOOKS
 */
export type WebhooksUpdate = EventData<{ guildId: string; channelId: string }>;

/**
 * GUILD_INVITES
 */
export type InviteCreate = EventData<{
    channelId: string;
    code: string;
    createdAt: Date;
    guildId?: string;
    inviter?: User;
    maxAge: number;
    maxUses: number;
    targetType?: InviteTargetType;
    targetUser?: User;
    targetApplication?: Partial<Application>;
    temporary: boolean;
    uses: number;
    expiresAt: Date | null;
}>;
export type InviteDelete = EventData<{ channelId: string; guildId?: string; code: string }>;

/**
 * GUILD_VOICE_STATES
 */
export type VoiceChannelEffectSend = EventData<VoiceChannelEffect>;
export type VoiceStateUpdate = EventData<VoiceState>;

/**
 * GUILD_PRESENCES
 */
export type PresenceUpdate = EventData<{ since: number | null; activities: Activity[]; status: Status; afk: boolean; }>;

/**
 * GUILD_MESSAGES | DIRECT MESSAGES
 */
export type MessageCreate = EventData<GuildMessage>;
export type MessageUpdate = EventData<Message>;
export type MessageDelete = EventData<{ id: string; channelId: string; guildId?: string }>;
export type MessageDeleteBulk = EventData<{ ids: string[]; channelId: string; guildId?: string }>;

/**
 * GUILD_MESSAGE_REACTIONS | DIRECT_MESSAGE_REACTIONS
 */
export type MessageReactionAdd = Event<MessageReaction>;
export type MessageReactionRemove = Event<
    Omit<MessageReaction, "member" | "message_author_id" | "burst_colors">
>;
export type MessageReactionRemoveAll = Event<{
    channelId: string;
    messageId: string;
    guildId?: string;
}>;
export type MessageReactionRemoveEmoji = Event<{
    channelId: string;
    guildId?: string;
    messageId: string;
    emoji: Partial<Emoji>;
}>;

/**
 * GUILD_MESSAGE_TYPING | DIRECT_MESSAGE_TYPING
 */
export type TypingStart = Event<Typing>;

/**
 * GUILD_SCHEDULED_EVENTS
 */
export type GuildScheduledEventCreate = Event<GuildScheduledEvent>;
export type GuildScheduledEventUpdate = Event<GuildScheduledEvent>;
export type GuildScheduledEventDelete = Event<GuildScheduledEvent>;
export type GuildScheduledEventUserAdd = Event<{
    guildScheduledEventId: string;
    userId: string;
    guildId: string;
}>;
export type GuildScheduledEventUserRemove = Event<{
    guildScheduledEventId: string;
    userId: string;
    guildId: string;
}>;

/**
 * GUILD_MESSAGE_POLLS | DIRECT_MESSAGE_POLLS
 */
export type MessagePollVoteAdd = Event<PollVote>;
export type MessagePollVoteRemove = Event<PollVote>;

/**
 * PASSTHROUGH
 */
export type EntitlementCreate = Event<Entitlement>;
export type EntitlementUpdate = Event<Entitlement & { endsAt: Date }>;
export type EntitlementDelete = Event<Entitlement>;
export type GuildMembersChunk = Event<{
    guildId: string;
    members: GuildMember[];
    chunkIndex: number;
    chunkCount: number;
    notFound?: number[];
    presences: Presence[];
    nonce?: string;
}>;
export type InteractionCreate = Event<Interaction>;
export type SubscriptionCreate = Event<Subscription>;
export type SubscriptionUpdate = Event<Subscription>;
export type SubscriptionDelete = Event<Subscription>;
export type UserUpdate = Event<User>;
export type VoiceServerUpdate = Event<{ token: string; guildId: string; endpoint: string }>;