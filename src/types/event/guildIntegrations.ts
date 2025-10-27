import type { Integration } from '../api';
import type { Event } from './event';

export type GuildIntegrationsUpdate = Event<{ guildId: string }>;

export type IntegrationCreate = Event<Integration & { guildId: string }>;

export type IntegrationUpdate = Event<Integration & { guildId: string }>;

export type IntegrationDelete = Event<{ id: string; guildId: string; applicationId: string }>;
