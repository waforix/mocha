import { APIGuildMember, GuildMember } from "../guild/guildMember";
import { APIMention, Mention } from "./mention";

export type APIGuildMessage = {
    guild_id?: string;
    member: Partial<APIGuildMember>;
    mentions: APIMention[]
}

export type GuildMessage = {
    guildId: string;
    member: Partial<GuildMember>;
    mentions: Mention[];
}