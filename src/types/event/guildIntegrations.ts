import { Integration } from "../api";
import { Event } from "./event";

export type GuildIntegrationsUpdate = Event<{ guildId: string }>;

export type IntegrationCreate = Event<Integration & { guildId: string }>;

export type IntegrationUpdate = Event<Integration & { guildId: string }>;

export type IntegrationDelete = Event<{ id: string; guildId: string; applicationId: string }>;