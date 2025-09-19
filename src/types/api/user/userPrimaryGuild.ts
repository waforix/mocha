import { Library } from "../../conversion";

export type APIUserPrimaryGuild = {
    identity_guild_id: string | null;
    identity_enabled: boolean | null;
    tag: string | null;
    badge: string | null;
}

export type UserPrimaryGuild = Library<APIUserPrimaryGuild>;