import type { Library } from "../../conversion";
import type { APIAvatarDecorationData } from "../user/avatarDecoration";
import type { APIUser } from "../user/user";

export type APIGuildMember = {
    user?: APIUser;
    nick?: string | null;
    avatar?: string | null;
    banner?: string | null;
    roles: string[];
    joined_at: Date | null;
    premium_since?: Date | null;
    deaf: boolean;
    mute: boolean;
    flags: number;
    pending?: boolean;
    permissions?: string;
    communication_disabled_until?: Date | null;
    avatar_decoration_data?: APIAvatarDecorationData | null;
}

export type GuildMember = Library<APIGuildMember>;