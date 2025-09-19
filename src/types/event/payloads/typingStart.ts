import type { GuildMember } from "../../api";

export type TypingStart = {
    channel_id: string;
    guild_id?: string;
    user_id: string;
    timestamp: number;
    member?: GuildMember;
}