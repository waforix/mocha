import { Library } from "../../conversion";
import { APIGuildMember } from "../guild/guildMember";
import { APIUser } from "../user/user";

export type APIGuildScheduledEventUser = {
    guild_scheduled_event_id: string;
    user: APIUser;
    member?: APIGuildMember;
}

export type GuildScheduledEventUser = Library<APIGuildScheduledEventUser>;