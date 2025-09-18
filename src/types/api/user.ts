import { Locale, UserFlag, UserPremiumType } from "../../enums";
import { Library } from "../conversion";

export type APIUser = {
    id: string;
    username: string;
    discriminator: string;
    global_name: string | null;
    avatar: string | null;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string | null;
    accent_color?: number | null;
    locale?: Locale;
    verified?: boolean;
    email?: string | null;
    flags?: UserFlag;
    premium_type?: UserPremiumType;
    public_flags?: UserFlag;
    avatar_decoration_data?: APIAvatarDecorationData | null;
    collectibles?: APICollectibles | null;
    primary_guild?: APIUserPrimaryGuild | null;
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

export type APIUserPrimaryGuild = {
    identity_guild_id: string | null;
    identity_enabled: boolean | null;
    tag: string | null;
    badge: string | null;
}

export type User = Library<APIUser>;
export type AvatarDecorationData = Library<APIAvatarDecorationData>;
export type Collectibles = Library<APICollectibles>;
export type Nameplate = Library<APINameplate>;
export type UserPrimaryGuild = Library<APIUserPrimaryGuild>;