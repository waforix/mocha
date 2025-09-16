import { and, eq, isNull } from 'drizzle-orm';
import { schema } from '../db/index';
import { BaseProcessor } from './base';

export class MemberProcessor extends BaseProcessor {
  async processJoin(data: { guild_id: string; user: unknown; roles: string[]; joined_at: string }) {
    if (!this.validateJoinData(data)) {
      return;
    }

    try {
      await this.upsertUser(data.user);

      const userData = data.user as Record<string, unknown>;

      await this.db
        .insert(schema.members)
        .values({
          guildId: data.guild_id,
          userId: userData.id as string,
          roles: JSON.stringify(data.roles || []),
          joinedAt: new Date(data.joined_at),
        })
        .onConflictDoNothing();

      await this.db.insert(schema.memberEvents).values({
        guildId: data.guild_id,
        userId: userData.id as string,
        action: 'join',
        roles: JSON.stringify(data.roles || []),
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process member join: ${error}`);
    }
  }

  async processLeave(data: { guild_id: string; user: unknown }) {
    if (!this.validateLeaveData(data)) {
      return;
    }

    try {
      const userData = data.user as Record<string, unknown>;

      await this.db
        .update(schema.members)
        .set({ leftAt: new Date() })
        .where(
          and(
            eq(schema.members.guildId, data.guild_id),
            eq(schema.members.userId, userData.id as string),
            isNull(schema.members.leftAt)
          )
        );

      await this.db.insert(schema.memberEvents).values({
        guildId: data.guild_id,
        userId: userData.id as string,
        action: 'leave',
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process member leave: ${error}`);
    }
  }

  async process() {}

  private validateJoinData(
    data: unknown
  ): data is { guild_id: string; user: unknown; roles: string[]; joined_at: string } {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;

    return !!(
      d.guild_id &&
      typeof d.guild_id === 'string' &&
      d.user &&
      typeof d.user === 'object' &&
      d.joined_at &&
      typeof d.joined_at === 'string' &&
      Array.isArray(d.roles)
    );
  }

  private validateLeaveData(data: unknown): data is { guild_id: string; user: unknown } {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;

    return !!(d.guild_id && typeof d.guild_id === 'string' && d.user && typeof d.user === 'object');
  }
}
