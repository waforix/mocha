import { GuildMember } from "../api";
import { Event } from "./event";

export type TypingStart = Event<{
    channelId: string;
    guildId: string;
    userId: string;
    timestamp: number;
    member?: GuildMember
}>;