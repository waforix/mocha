import type { Prisma, User } from '@prisma/client';
import { DatabaseQueryError } from '../../errors/database';
import { DatabaseClient } from '../client';

/**
 * Repository for User operations
 * @category Database
 */
export class UserRepository {
  /**
   * Create or update a user
   * @param data - User data
   * @returns Created or updated user
   * @throws DatabaseQueryError if operation fails
   */
  static async upsert(data: Prisma.UserUpsertArgs['data']): Promise<User> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.user.upsert({
        where: { id: data.id as string },
        update: data,
        create: data as Prisma.UserCreateInput,
      });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to upsert user',
        { userId: data.id },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Find a user by ID
   * @param id - User ID
   * @returns User or null
   * @throws DatabaseQueryError if operation fails
   */
  static async findById(id: string): Promise<User | null> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.user.findUnique({ where: { id } });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to find user',
        { userId: id },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Find users by username
   * @param username - Username to search for
   * @returns Array of users
   * @throws DatabaseQueryError if operation fails
   */
  static async findByUsername(username: string): Promise<User[]> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.user.findMany({ where: { username } });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to find users by username',
        { username },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Find all users
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Array of users
   * @throws DatabaseQueryError if operation fails
   */
  static async findAll(skip = 0, take = 100): Promise<User[]> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.user.findMany({ skip, take });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to find users',
        { skip, take },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Delete a user
   * @param id - User ID
   * @returns Deleted user
   * @throws DatabaseQueryError if operation fails
   */
  static async delete(id: string): Promise<User> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.user.delete({ where: { id } });
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to delete user',
        { userId: id },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Count users
   * @returns Number of users
   * @throws DatabaseQueryError if operation fails
   */
  static async count(): Promise<number> {
    try {
      const client = await DatabaseClient.getInstance();
      return await client.user.count();
    } catch (error) {
      throw new DatabaseQueryError(
        'Failed to count users',
        {},
        error instanceof Error ? error : undefined
      );
    }
  }
}
