import { ChannelType, DefaultMessageNotificationLevel, ExplicitContentFilter, ForumLayoutType, ForumTagName, GuildFeature, GuildInviteFlag, GuildNSFWLevel, InviteTargetType, InviteType, MessageType, MFALevel, OverwriteType, PremiumTier, SortOrderType, StickerFormat, StickerType, SystemChannelFlag, VerificationLevel, VideoQualityMode } from "../enums";
import { Locale } from "../enums/locale";
import { UserFlag } from "../enums/userFlag";
import { UserPremiumType } from "../enums/userPremiumType";







export type APIChannelMention = {
    id: string;
    guild_id: string;
    type: ChannelType;
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