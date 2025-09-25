import { GuildMessage, Message } from "../api";
import { Event } from "./event";

export type MessageCreate = Event<GuildMessage>;

export type MessageUpdate = Event<Message>;

export type MessageDelete = Event<{ id: string; channelId: string; guildId?: string }>;

export type MessageDeleteBulk = Event<{ ids: string[]; channelId: string; guildId?: string }>;