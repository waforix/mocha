import type { APIMessage, APIPresenceUpdate, APIVoiceState } from '../../types';

export const createMockMessage = (overrides: Partial<APIMessage> = {}): APIMessage => ({
  id: '123456789012345678',
  channel_id: '987654321098765432',
  guild_id: '111222333444555666',
  author: {
    id: '777888999000111222',
    username: 'testuser',
    discriminator: '0001',
    bot: false,
  },
  content: 'Test message',
  timestamp: new Date().toISOString(),
  attachments: [],
  embeds: [],
  ...overrides,
});

export const createMockVoiceState = (overrides: Partial<APIVoiceState> = {}): APIVoiceState => ({
  guild_id: '111222333444555666',
  channel_id: '555666777888999000',
  user_id: '777888999000111222',
  session_id: 'test-session-id',
  deaf: false,
  mute: false,
  self_deaf: false,
  self_mute: false,
  ...overrides,
});

export const createMockPresence = (
  overrides: Partial<APIPresenceUpdate> = {}
): APIPresenceUpdate => ({
  user: {
    id: '777888999000111222',
    username: 'testuser',
    discriminator: '0001',
    bot: false,
  },
  guild_id: '111222333444555666',
  status: 'online',
  activities: [],
  ...overrides,
});

export const createMockGuild = (overrides: Record<string, unknown> = {}) => ({
  id: '111222333444555666',
  name: 'Test Guild',
  icon: null,
  owner_id: '777888999000111222',
  member_count: 100,
  ...overrides,
});

export const createMockUser = (overrides: Record<string, unknown> = {}) => ({
  id: '777888999000111222',
  username: 'testuser',
  discriminator: '0001',
  bot: false,
  ...overrides,
});
