import { beforeEach, describe, expect, it } from 'bun:test';
import { EventDispatcher } from '../../events/dispatcher';
import { createMockMessage, createMockPresence, createMockVoiceState } from '../utils/mocks';
import { setupTestDb } from '../utils/setup';

describe('EventDispatcher', () => {
  const dbManager = setupTestDb();
  let dispatcher: EventDispatcher;

  beforeEach(async () => {
    const db = await dbManager.setup();
    dispatcher = new EventDispatcher(db.db);
  });

  describe('message events', () => {
    it('dispatches valid message create events', () => {
      const mockMessage = createMockMessage();

      expect(() => dispatcher.dispatch('MESSAGE_CREATE', mockMessage)).not.toThrow();
    });

    it('validates message data structure', () => {
      const invalidMessage = { invalid: 'data' };

      expect(() => dispatcher.dispatch('MESSAGE_CREATE', invalidMessage)).toThrow();
    });

    it('handles message update events', () => {
      const mockMessage = createMockMessage();

      expect(() => dispatcher.dispatch('MESSAGE_UPDATE', mockMessage)).not.toThrow();
    });

    it('handles message delete events', () => {
      const deleteData = {
        id: '123456789012345678',
        channel_id: '987654321098765432',
        guild_id: '111222333444555666',
      };

      expect(() => dispatcher.dispatch('MESSAGE_DELETE', deleteData)).not.toThrow();
    });
  });

  describe('voice events', () => {
    it('dispatches voice state update events', () => {
      const mockVoiceState = createMockVoiceState();

      expect(() => dispatcher.dispatch('VOICE_STATE_UPDATE', mockVoiceState)).not.toThrow();
    });

    it('validates voice state data', () => {
      const invalidVoiceState = { invalid: 'data' };

      expect(() => dispatcher.dispatch('VOICE_STATE_UPDATE', invalidVoiceState)).toThrow();
    });

    it('handles voice state with undefined channel_id', () => {
      const mockVoiceState = createMockVoiceState({ channel_id: undefined });

      expect(() => dispatcher.dispatch('VOICE_STATE_UPDATE', mockVoiceState)).not.toThrow();
    });
  });

  describe('presence events', () => {
    it('dispatches presence update events', () => {
      const mockPresence = createMockPresence();

      expect(() => dispatcher.dispatch('PRESENCE_UPDATE', mockPresence)).not.toThrow();
    });

    it('validates presence data', () => {
      const invalidPresence = { invalid: 'data' };

      expect(() => dispatcher.dispatch('PRESENCE_UPDATE', invalidPresence)).toThrow();
    });

    it('handles different presence statuses', () => {
      const statuses = ['online', 'idle', 'dnd', 'offline'] as const;

      for (const status of statuses) {
        const mockPresence = createMockPresence({ status });
        expect(() => dispatcher.dispatch('PRESENCE_UPDATE', mockPresence)).not.toThrow();
      }
    });
  });

  describe('guild events', () => {
    it('handles guild create events', () => {
      const guildData = {
        id: '111222333444555666',
        name: 'Test Guild',
        member_count: 100,
      };

      expect(() => dispatcher.dispatch('GUILD_CREATE', guildData)).not.toThrow();
    });

    it('handles guild member add events', () => {
      const memberData = {
        user: {
          id: '777888999000111222',
          username: 'testuser',
        },
        guild_id: '111222333444555666',
        joined_at: new Date().toISOString(),
      };

      expect(() => dispatcher.dispatch('GUILD_MEMBER_ADD', memberData)).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('throws for unknown event types', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Testing invalid event type
      expect(() => dispatcher.dispatch('UNKNOWN_EVENT' as any, {})).toThrow(
        'Unknown event type: UNKNOWN_EVENT'
      );
    });

    it('throws for invalid data structures', () => {
      expect(() => dispatcher.dispatch('MESSAGE_CREATE', null)).toThrow();
    });

    it('throws for missing required fields', () => {
      const incompleteMessage = { id: '123' };

      expect(() => dispatcher.dispatch('MESSAGE_CREATE', incompleteMessage)).toThrow();
    });
  });
});
