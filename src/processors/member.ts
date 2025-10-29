import { BaseProcessor } from './base';

export class MemberProcessor extends BaseProcessor {
  /**
   * Process member join event
   */
  async processJoin(data: { guild_id: string; user: unknown; roles: string[]; joined_at: string }) {
    if (!this.validateJoinData(data)) {
      return;
    }

    try {
      await this.upsertUser(data.user);

      const userData = data.user as Record<string, unknown>;

      await this.db.member.upsert({
        where: {
          id: `${data.guild_id}-${userData.id}`,
        },
        create: {
          guildId: data.guild_id,
          userId: userData.id as string,
          roles: JSON.stringify(data.roles || []),
          joinedAt: new Date(data.joined_at),
        },
        update: {},
      });

      await this.db.memberEvent.create({
        data: {
          guildId: data.guild_id,
          userId: userData.id as string,
          action: 'join',
          roles: JSON.stringify(data.roles || []),
          timestamp: new Date(),
        },
      });
    } catch (error) {
      throw new Error(`Failed to process member join: ${error}`);
    }
  }

  /**
   * Process member leave event
   */
  async processLeave(data: { guild_id: string; user: unknown }) {
    if (!this.validateLeaveData(data)) {
      return;
    }

    try {
      const userData = data.user as Record<string, unknown>;

      await this.db.member.updateMany({
        where: {
          guildId: data.guild_id,
          userId: userData.id as string,
          leftAt: null,
        },
        data: {
          leftAt: new Date(),
        },
      });

      await this.db.memberEvent.create({
        data: {
          guildId: data.guild_id,
          userId: userData.id as string,
          action: 'leave',
          roles: JSON.stringify([]),
          timestamp: new Date(),
        },
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
