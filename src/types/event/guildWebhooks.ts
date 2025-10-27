import type { Event } from './event';

export type WebhooksUpdate = Event<{ guildId: string; channelId: string }>;
