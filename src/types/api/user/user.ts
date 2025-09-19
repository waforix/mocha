import type { Locale, UserFlag, UserPremiumType } from "../../../enums";
import type { Library } from "../../conversion";
import type { APIAvatarDecorationData } from "./avatarDecorationData";
import type { APICollectibles } from "./collectibles";
import type { APIUserPrimaryGuild } from "./userPrimaryGuild";

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

export type User = Library<APIUser>;