import { GuildScheduledEvent } from "../api";
import { Event } from "./event";

export type GuildScheduledEventCreate = Event<GuildScheduledEvent>;

export type GuildScheduledEventUpdate = Event<GuildScheduledEvent>;

export type GuildScheduledEventDelete = Event<GuildScheduledEvent>;

export type GuildScheduledEventUserAdd = Event<{
    guildScheduledEventId: string;
    userId: string;
    guildId: string;
}>;

export type GuildScheduledEventUserRemove = Event<{
    guildScheduledEventId: string;
    userId: string;
    guildId: string;
}>;