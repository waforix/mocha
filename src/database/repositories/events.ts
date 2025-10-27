import type {
  MemberEvent,
  MessageEvent,
  PresenceEvent,
  Prisma,
  ReactionEvent,
  VoiceEvent,
} from '@prisma/client';
import { DatabaseQueryError } from '../../errors/database';
import { DatabaseClient } from '../client';

/**
 * Repository for Message Event operations
 * @category Database
 */
export class MessageEventRepository {
  /**
   * Create a message event
   * @param data - Message event data
   * @returns Created message event
   * @throws DatabaseQueryError if operation fails
   */
  static async create(data: Prisma.MessageEventCreateInput): Promise<MessageEvent> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.messageEvent.create({ data });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to create message event',
        { guildId: data.guildId },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Find message events by guild and date range
   * @param guildId - Guild ID
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Array of message events
   * @throws DatabaseQueryError if operation fails
   */
  static async findByGuildAndDateRange(
    guildId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MessageEvent[]> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.messageEvent.findMany({
        where: {
          guildId,
          timestamp: { gte: startDate, lte: endDate },
        },
        orderBy: { timestamp: 'desc' },
      });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to find message events',
        { guildId, startDate, endDate },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Count message events by guild
   * @param guildId - Guild ID
   * @returns Number of message events
   * @throws DatabaseQueryError if operation fails
   */
  static async countByGuild(guildId: string): Promise<number> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.messageEvent.count({ where: { guildId } });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to count message events',
        { guildId },
        error instanceof Error ? error : undefined
      );
    }
  }
}

/**
 * Repository for Voice Event operations
 * @category Database
 */
export class VoiceEventRepository {
  /**
   * Create a voice event
   * @param data - Voice event data
   * @returns Created voice event
   * @throws DatabaseQueryError if operation fails
   */
  static async create(data: Prisma.VoiceEventCreateInput): Promise<VoiceEvent> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.voiceEvent.create({ data });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to create voice event',
        { guildId: data.guildId },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Find voice events by guild and date range
   * @param guildId - Guild ID
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Array of voice events
   * @throws DatabaseQueryError if operation fails
   */
  static async findByGuildAndDateRange(
    guildId: string,
    startDate: Date,
    endDate: Date
  ): Promise<VoiceEvent[]> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.voiceEvent.findMany({
        where: {
          guildId,
          timestamp: { gte: startDate, lte: endDate },
        },
        orderBy: { timestamp: 'desc' },
      });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to find voice events',
        { guildId, startDate, endDate },
        error instanceof Error ? error : undefined
      );
    }
  }
}

/**
 * Repository for Member Event operations
 * @category Database
 */
export class MemberEventRepository {
  /**
   * Create a member event
   * @param data - Member event data
   * @returns Created member event
   * @throws DatabaseQueryError if operation fails
   */
  static async create(data: Prisma.MemberEventCreateInput): Promise<MemberEvent> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.memberEvent.create({ data });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to create member event',
        { guildId: data.guildId },
        error instanceof Error ? error : undefined
      );
    }
  }
}

/**
 * Repository for Presence Event operations
 * @category Database
 */
export class PresenceEventRepository {
  /**
   * Create a presence event
   * @param data - Presence event data
   * @returns Created presence event
   * @throws DatabaseQueryError if operation fails
   */
  static async create(data: Prisma.PresenceEventCreateInput): Promise<PresenceEvent> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.presenceEvent.create({ data });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to create presence event',
        { guildId: data.guildId },
        error instanceof Error ? error : undefined
      );
    }
  }
}

/**
 * Repository for Reaction Event operations
 * @category Database
 */
export class ReactionEventRepository {
  /**
   * Create a reaction event
   * @param data - Reaction event data
   * @returns Created reaction event
   * @throws DatabaseQueryError if operation fails
   */
  static async create(data: Prisma.ReactionEventCreateInput): Promise<ReactionEvent> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.reactionEvent.create({ data });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to create reaction event',
        { guildId: data.guildId },
        error instanceof Error ? error : undefined
      );
    }
  }
}
