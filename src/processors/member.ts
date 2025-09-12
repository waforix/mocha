import { and, eq, isNull } from 'drizzle-orm';
import { schema } from '../db/index';
import { BaseProcessor } from './base';

export class MemberProcessor extends BaseProcessor {
  async processJoin(data: { guild_id: string; user: unknown; roles: string[]; joined_at: string }) {
    await this.upsertUser(data.user);

    const userData = data.user as Record<string, unknown>;

    await this.db
      .insert(schema.members)
      .values({
        guildId: data.guild_id,
        userId: userData.id as string,
        roles: JSON.stringify(data.roles),
        joinedAt: new Date(data.joined_at),
      })
      .onConflictDoNothing();

    await this.db.insert(schema.memberEvents).values({
      guildId: data.guild_id,
      userId: userData.id as string,
      action: 'join',
      roles: JSON.stringify(data.roles),
      timestamp: new Date(),
    });
  }

  async processLeave(data: { guild_id: string; user: unknown }) {
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
  }

  async process() {}
}
