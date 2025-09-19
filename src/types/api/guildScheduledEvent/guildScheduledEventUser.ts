import type { Library } from "../../conversion";
import type { APIGuildMember } from "../guild/guildMember";
import type { APIUser } from "../user/user";

export type APIGuildScheduledEventUser = {
    guild_scheduled_event_id: string;
    user: APIUser;
    member?: APIGuildMember;
}

export type GuildScheduledEventUser = Library<APIGuildScheduledEventUser>;