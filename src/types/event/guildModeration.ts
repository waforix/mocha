import { AuditLogEntry, User } from "../api";
import { Event } from "./event";

export type GuildAuditLogEntryCreate = Event<AuditLogEntry>;

export type GuildBanAdd = Event<{
    guildId: string;
    user: Partial<User>;
    deleteMessageSecs: number;
}>;

export type GuildBanRemove = Event<{ guildId: string; user: Partial<User> }>;