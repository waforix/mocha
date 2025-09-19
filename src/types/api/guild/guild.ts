import { DefaultMessageNotificationLevel, ExplicitContentFilter, GuildFeature, GuildNSFWLevel, Locale, MFALevel, PremiumTier, SystemChannelFlag, VerificationLevel } from "../../../enums";
import { Library } from "../../conversion";
import { APIEmoji } from "../emoji/emoji";
import { APIRole } from "../role/role";
import { APISticker } from "../sticker/sticker";
import { APIIncidentsData } from "./incidentsData";
import { APIWelcomeScreen } from "./welcomeScreen";

export type APIGuild = {
    id: string;
    name: string;
    icon: string | null;
    icon_hash?: string | null;
    splash?: string | null;
    discovery_splash?: string | null;
    owner?: boolean;
    owner_id: string;
    permissions?: string;
    /**
     * @deprecated use preferred_locale
     */
    region?: string | null
    afk_channel_id: string | null;
    afk_timeout: number;
    widget_enabled: boolean | null;
    widget_channel_id: string | null;
    verification_level: VerificationLevel;
    default_message_notifications: DefaultMessageNotificationLevel;
    explicit_content_filter: ExplicitContentFilter;
    roles: APIRole[];
    emojis: APIEmoji[];
    features: GuildFeature[];
    mfa_level: MFALevel;
    application_id: string | null;
    system_channel_id: string | null;
    system_channel_flags: SystemChannelFlag;
    rules_channel_id: string | null;
    max_presences?: number | null;
    max_members?: number;
    vanity_url_code: string | null;
    description: string | null;
    banner: string | null;
    premium_tier: PremiumTier;
    premium_subscription_count?: number;
    preferred_locale: Locale;
    public_updates_channel_id: string | null;
    max_video_channel_users?: number;
    max_stage_video_channel_users?: number;
    approximate_member_count?: number;
    approximate_presence_count?: number;
    welcome_screen?: APIWelcomeScreen;
    nsfw_level: GuildNSFWLevel;
    stickers?: APISticker[];
    premium_progress_bar_enabled: boolean;
    safety_alerts_channel_id: string | null;
    incidents_data: APIIncidentsData | null;
}

export type Guild = Library<APIGuild>;