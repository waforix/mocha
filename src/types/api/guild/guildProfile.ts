import { GuildFeature, GuildVisibility, PremiumTier } from "../../../enums";
import { GuildTrait } from "./guildTrait";

export type APIGuildProfile = {
    id: string;
    name: string;
    icon_has: string | null;
    member_count: number;
    online_count: number;
    description: string;
    brand_color_primary: string;
    /**
     * @deprecated use custom_banner_hash
     */
    banner_hash: string | null;
    game_application_ids: string[];
    game_activity: Record<string, { activity_level: number; activity_score: number; }>;
    tag: string | null;
    badge: number;
    badge_color_primary: string;
    badge_color_secondary: string;
    badge_hash: string;
    traits: GuildTrait[];
    features: GuildFeature[];
    visibility: GuildVisibility;
    custom_banner_hash: string | null;
    premium_subscription_count: number;
    premium_tier: PremiumTier;
}