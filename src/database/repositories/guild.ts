import type { Guild, Prisma } from '@prisma/client';
import { DatabaseClient } from '../client';
import { DatabaseQueryError } from '../../errors/database';

/**
 * Repository for Guild operations
 * @category Database
 */
export class GuildRepository {
  /**
   * Create or update a guild
   * @param data - Guild data
   * @returns Created or updated guild
   * @throws DatabaseQueryError if operation fails
   */
  static async upsert(data: Prisma.GuildUpsertArgs['data']): Promise<Guild> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.guild.upsert({
        where: { id: data.id as string },
        update: data,
        create: data as Prisma.GuildCreateInput,
      });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to upsert guild',
        { guildId: data.id },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Find a guild by ID
   * @param id - Guild ID
   * @returns Guild or null
   * @throws DatabaseQueryError if operation fails
   */
  static async findById(id: string): Promise<Guild | null> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.guild.findUnique({ where: { id } });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to find guild',
        { guildId: id },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Find all guilds
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Array of guilds
   * @throws DatabaseQueryError if operation fails
   */
  static async findAll(skip = 0, take = 100): Promise<Guild[]> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.guild.findMany({ skip, take });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to find guilds',
        { skip, take },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Delete a guild
   * @param id - Guild ID
   * @returns Deleted guild
   * @throws DatabaseQueryError if operation fails
   */
  static async delete(id: string): Promise<Guild> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.guild.delete({ where: { id } });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to delete guild',
        { guildId: id },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Count guilds
   * @returns Number of guilds
   * @throws DatabaseQueryError if operation fails
   */
  static async count(): Promise<number> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.guild.count();
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to count guilds',
        {},
        error instanceof Error ? error : undefined
      );
    }
  }
}

