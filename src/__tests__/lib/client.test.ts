import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Client } from '../../lib/client';
import { setupTestDb } from '../utils/setup';

describe('Client', () => {
  const dbManager = setupTestDb();
  let client: Client;

  beforeEach(async () => {
    await dbManager.setup();
    client = new Client({
      database: {
        type: 'sqlite',
        path: ':memory:',
      },
      token: 'test-token',
    });
  });

  afterEach(async () => {
    await client.close();
    await dbManager.cleanup();
  });

  describe('initialization', () => {
    it('creates client with database instance', () => {
      expect(client).toBeDefined();
    });

    it('initializes with default options', () => {
      expect(client).toBeInstanceOf(Client);
    });
  });

  describe('input validation', () => {
    describe('getUserStats', () => {
      it('validates guild ID', async () => {
        await expect(client.getUserStats('invalid', '123456789012345678')).rejects.toThrow(
          'Guild ID must be a valid Discord snowflake ID'
        );
      });

      it('validates user ID', async () => {
        await expect(client.getUserStats('123456789012345678', 'invalid')).rejects.toThrow(
          'User ID must be a valid Discord snowflake ID'
        );
      });

      it('validates days parameter', async () => {
        await expect(
          client.getUserStats('123456789012345678', '123456789012345678', 0)
        ).rejects.toThrow('Days must be an integer between 1 and 365');
      });

      it('accepts valid parameters', async () => {
        await expect(
          client.getUserStats('123456789012345678', '123456789012345678')
        ).resolves.toBeDefined();
      });
    });

    describe('getGuildStats', () => {
      it('validates guild ID', async () => {
        await expect(client.getGuildStats('invalid')).rejects.toThrow(
          'Guild ID must be a valid Discord snowflake ID'
        );
      });

      it('validates days parameter', async () => {
        await expect(client.getGuildStats('123456789012345678', 366)).rejects.toThrow(
          'Days must be an integer between 1 and 365'
        );
      });

      it('accepts valid parameters', async () => {
        await expect(client.getGuildStats('123456789012345678')).resolves.toBeDefined();
      });
    });

    describe('getLeaderboard', () => {
      it('validates guild ID', async () => {
        await expect(client.getLeaderboard('invalid', 'messages')).rejects.toThrow(
          'Guild ID must be a valid Discord snowflake ID'
        );
      });

      it('validates limit parameter', async () => {
        await expect(client.getLeaderboard('123456789012345678', 'messages', 0)).rejects.toThrow(
          'Limit must be an integer between 1 and 100'
        );
      });

      it('accepts valid parameters', async () => {
        await expect(
          client.getLeaderboard('123456789012345678', 'messages')
        ).resolves.toBeDefined();
      });
    });

    describe('getActivityHeatmap', () => {
      it('validates guild ID', async () => {
        await expect(client.getActivityHeatmap('invalid')).rejects.toThrow(
          'Guild ID must be a valid Discord snowflake ID'
        );
      });

      it('validates days parameter', async () => {
        await expect(
          client.getActivityHeatmap('123456789012345678', 'messages', 0)
        ).rejects.toThrow('Days must be an integer between 1 and 365');
      });

      it('accepts valid parameters', async () => {
        await expect(
          client.getActivityHeatmap('123456789012345678', 'messages')
        ).resolves.toBeDefined();
      });
    });
  });

  describe('resource management', () => {
    it('closes properly', async () => {
      await expect(client.close()).resolves.not.toThrow();
    });

    it('handles multiple close calls', async () => {
      await client.close();
      await expect(client.close()).resolves.not.toThrow();
    });
  });
});
