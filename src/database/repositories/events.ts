import type {
  MemberEvent,
  MessageEvent,
  PresenceEvent,
  Prisma,
  ReactionEvent,
  VoiceEvent,
} from '@prisma/client';
import { DatabaseQueryError } from '../../errors/database';
import { getInstance } from '../client';

/**
 * Create a message event
 * @param data - Message event data
 * @returns Created message event
 * @throws DatabaseQueryError if operation fails
 * @category Database
 */
export async function createMessageEvent(
  data: Prisma.MessageEventCreateInput
): Promise<MessageEvent> {
  try {
    const client = await getInstance();
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
 * @category Database
 */
export async function findMessageEventsByGuildAndDateRange(
  guildId: string,
  startDate: Date,
  endDate: Date
): Promise<MessageEvent[]> {
  try {
    const client = await getInstance();
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
 * @category Database
 */
export async function countMessageEventsByGuild(guildId: string): Promise<number> {
  try {
    const client = await getInstance();
    return await client.messageEvent.count({ where: { guildId } });
  } catch (error) {
    throw new DatabaseQueryError(
      'Failed to count message events',
      { guildId },
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Create a voice event
 * @param data - Voice event data
 * @returns Created voice event
 * @throws DatabaseQueryError if operation fails
 * @category Database
 */
export async function createVoiceEvent(data: Prisma.VoiceEventCreateInput): Promise<VoiceEvent> {
  try {
    const client = await getInstance();
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
 * @category Database
 */
export async function findVoiceEventsByGuildAndDateRange(
  guildId: string,
  startDate: Date,
  endDate: Date
): Promise<VoiceEvent[]> {
  try {
    const client = await getInstance();
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

/**
 * Create a member event
 * @param data - Member event data
 * @returns Created member event
 * @throws DatabaseQueryError if operation fails
 * @category Database
 */
export async function createMemberEvent(data: Prisma.MemberEventCreateInput): Promise<MemberEvent> {
  try {
    const client = await getInstance();
    return await client.memberEvent.create({ data });
  } catch (error) {
    throw new DatabaseQueryError(
      'Failed to create member event',
      { guildId: data.guildId },
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Create a presence event
 * @param data - Presence event data
 * @returns Created presence event
 * @throws DatabaseQueryError if operation fails
 * @category Database
 */
export async function createPresenceEvent(
  data: Prisma.PresenceEventCreateInput
): Promise<PresenceEvent> {
  try {
    const client = await getInstance();
    return await client.presenceEvent.create({ data });
  } catch (error) {
    throw new DatabaseQueryError(
      'Failed to create presence event',
      { guildId: data.guildId },
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Create a reaction event
 * @param data - Reaction event data
 * @returns Created reaction event
 * @throws DatabaseQueryError if operation fails
 * @category Database
 */
export async function createReactionEvent(
  data: Prisma.ReactionEventCreateInput
): Promise<ReactionEvent> {
  try {
    const client = await getInstance();
    return await client.reactionEvent.create({ data });
  } catch (error) {
    throw new DatabaseQueryError(
      'Failed to create reaction event',
      { guildId: data.guildId },
      error instanceof Error ? error : undefined
    );
  }
}
