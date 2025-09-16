import { ChannelType, DefaultMessageNotificationLevel, ExplicitContentFilter, ForumLayoutType, ForumTagName, GuildFeature, GuildInviteFlag, GuildNSFWLevel, InviteTargetType, InviteType, MessageType, MFALevel, OverwriteType, PremiumTier, SortOrderType, StickerFormat, StickerType, SystemChannelFlag, VerificationLevel, VideoQualityMode } from "../enums";
import { Locale } from "../enums/locale";
import { UserFlag } from "../enums/userFlag";
import { UserPremiumType } from "../enums/userPremiumType";

export type APIChannel = {
    id: string;
    type: ChannelType;
    guild_id?: string;
    position?: number;
    permission_overwrites?: APIOverwrite[];
    name?: string;
    topic?: string;
    nsfw?: boolean;
    last_message_id?: string;
    bitrate?: number;
    user_limit?: number;
    rate_limit_per_user?: number;
    recipients?: APIUser[];
    owner_id?: string;
    application_id?: string;
    managed?: boolean;
    parent_id?: string;
    last_pin_timestamp?: Date;
    rtc_region?: string;
    video_quality_mode: VideoQualityMode;
    message_count?: number;
    thread_metadata?: APIThreadMetadata;
    member?: APIThreadMember;
    default_auto_archive_duration?: number;
    permissions?: string;
    flags?: number;
    total_messages_sent?: number;
    available_tags?: APIForumTag[];
    applied_tags?: APIForumTag[];
    default_reaction_emoji?: APIDefaultReaction;
    default_thread_rate_limit_per_user?: number;
    default_sort_order?: SortOrderType;
    default_forum_layout?: ForumLayoutType;
}

export type APIOverwrite = {
    id: string;
    type: OverwriteType;
    allow: string;
    deny: string;
}

export type APIForumTag = {
    id: string;
    name: ForumTagName;
    moderated: boolean;
    emoji_id?: string;
    emoji_name?: string;
}

export type APIChannelMention = {
    id: string;
    guild_id: string;
    type: ChannelType;
}

export type APIEmoji = {
    id?: string;
    name?: string;
    roles?: null//
    user?: null//
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;
}

export type APIGuild = {
    id: string;
    name: string;
    icon: string;
    icon_hash?: string;
    splash?: string;
    discovery_splash?: string;
    owner?: boolean;
    owner_id: string;
    permissions?: string;
    region?: string /* deprecated */
    afk_channel_id?: string;
    afk_timeout: number;
    widget_enabled?: boolean;
    widget_channel_id?: string;
    verification_level: VerificationLevel;
    default_message_notifications: DefaultMessageNotificationLevel;
    explicit_content_filter: ExplicitContentFilter;
    roles: APIRole[];
    emojis: APIEmoji[];
    features: GuildFeature[];
    mfa_level: MFALevel;
    application_id?: string;
    system_channel_id?: string;
    system_channel_flags: SystemChannelFlag;
    rules_channel_id?: string;
    max_presences?: number;
    max_members?: number;
    vanity_url_code?: string;
    description?: string;
    banner?: string;
    premium_tier: PremiumTier;
    premium_subscription_count?: number;
    preferred_locale: Locale;
    public_updates_channel_id?: string;
    max_video_channel_users?: number;
    max_stage_video_channel_users?: number;
    approximate_member_count?: number;
    approximate_presence_count?: number;
    welcome_screen?: APIWelcomeScreen;
    nsfw_level: GuildNSFWLevel;
    stickers: APISticker[];
    premium_progress_bar_enabled: boolean;
    safety_alerts_channel_id?: number;
    incidents_data?: APIIncidentsData;
}

export type APIWelcomeScreen = {
    description?: string;
    welcome_channels: APIWelcomeScreenChannel[];
}

export type APIWelcomeScreenChannel = {
    channel_id: string;
    description: string;
    emoji_id: string | null;
    emoji_name: string | null;
}

export type APIIncidentsData = {
    invites_disabled_until: Date | null;
    dms_disabled_until: Date | null;
    dm_spam_detected_at: Date | null;
    raid_detected_at: Date | null;
}

export type APIInvite = {
    type: InviteType;
    code: string;
    guild?: null;
    channel?: Partial<APIChannel>;
    inviter?: APIUser;
    target_type?: InviteTargetType;
    target_user?: APIUser;
    target_application?: null;
    approximate_presence_count?: number;
    approximate_member_count?: number;
    expires_at: Date;
    guild_scheduled_event?: null;
    flags?: GuildInviteFlag;
}

export type APIMessage = {
    id: string;
    channel_id: string;
    author: APIUser;
    content: string;
    timestamp: Date;
    edited_timestamp: Date;
    tts: boolean;
    mention_everyone: boolean;
    mentions: APIUser[];
    mention_roles: APIRole[];
    mention_channels?: APIChannel[];
    attachments: null;
    embeds: null;
    reactions?: null;
    nonce?: number | string;
    pinned: boolean;
    webhook_id?: string;
    type: MessageType;
}


// color: deprecated in version 10

export type APIRole = {
    id: string;
    name: string;
    colors: APIRoleColors;
    hoist: boolean;
    icon?: string;
    unicode_emoji?: string;
    position: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    tags?: APIRoleTags;
    flags: number;
}


// holographic style:
// primary_color = 11127295, secondary_color = 16759788, tertiary_color = 16761760

export type APIRoleColors = {
    primary_color: number;
    secondary_color?: number;
    tertiary_color?: number;
}

// tags with null type should be considered true
// if they are present, otherwise false

export type APIRoleTags = {
    bot_id?: string;
    integration_id?: string;
    premium_subscriber?: null;
    subscription_listing_id?: string;
    available_for_purchase?: null;
    guild_connections?: null;
}

export type APISticker = {
    id: string;
    pack_id?: string;
    name: string;
    description?: string;
    tags: string;
    type: StickerType;
    format_type: StickerFormat;
    available?: boolean;
    guild_id?: string;
    user?: APIUser;
    sort_value?: number;
}

export type APIUser = {
    id: string;
    username: string;
    discriminator: string;
    global_name?: string;
    avatar?: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: Locale;
    verified?: boolean;
    email?: string;
    flags?: UserFlag;
    premium_type?: UserPremiumType;
    public_flags: UserFlag;
    avatar_decoration_data: APIAvatarDecorationData;
    collectibles: APICollectibles;
}

export type APIGuildMember = {
    user: APIUser;
    nick: string | null;
    avatar?: string | null;
    banner?: string | null;
    roles: string[];
    joined_at: Date | null;
    premium_since: Date | null;
    deaf: boolean;
    mute: boolean;
    flags: null;
    pending?: boolean;
    permissions?: string;
    communication_disabled_until?: Date | null;
    avatar_decoration_data?: APIAvatarDecorationData;
}


export type APIUserPrimaryGuild = {
    identity_guild_id?: string;
    identity_enabled?: boolean;
    tag?: string;
    badge?: string;
}

export type APIAvatarDecorationData = {
    asset: string;
    sku_id: string;
}

export type APICollectibles = {
    nameplate?: APINameplate;
}

export type APINameplate = {
    sku_id: string;
    asset: string;
    label: string;
    palette: "crimson" | "berry" | "sky" | "teal" | "forest" | "bubble_gum" | "violet" | "cobalt" | "clover" | "lemon" | "white";
}

export type APIThreadMetadata = {
    archived: boolean;
    auto_archive_duration: number;
    archive_timestamp: Date;
    locked: boolean;
    invitable?: boolean;
    create_timestamp?: Date;
}

export type APIThreadMember = {
    id?: string;
    user_id?: string;
    join_timestamp: Date;
    flags: number;
    member?: APIGuildMember;
}

export type APIDefaultReaction = {
    emoji_id?: string;
    emoji_name?: string;
}

export type APIVoiceState = {
    guild_id?: string;
    channel_id?: string;
    user_id: string;
    member?: APIGuildMember;
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
    self_stream?: boolean;
    self_video: boolean;
    suppress: boolean;
    request_to_speak_timestamp?: Date;
}

export type APIWebhook = {
    id: string;
    type: number;
    guild_id?: string;
    channel_id?: string;
    user?: APIUser;
    name?: string;
    avatar?: string;
    token?: string;
    application_id?: string;
    source_guild?: Partial<APIGuild>;
    source_channel?: Partial<APIChannel>;
    url?: string;
}