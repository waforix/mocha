import type { APIPresenceUpdate } from '../types/index';
import { BaseProcessor } from './base';

export class PresenceProcessor extends BaseProcessor<APIPresenceUpdate> {
  private lastPresence = new Map<
    string,
    { status: string; activity?: string; activityType?: number }
  >();

  /**
   * Process a presence update event
   */
  async process(presence: APIPresenceUpdate) {
    if (!this.validatePresence(presence)) {
      return;
    }

    try {
      const userId = presence.user.id;

      // Validate userId is a non-empty string
      if (typeof userId !== 'string' || userId.trim().length === 0) {
        return;
      }

      const key = `${presence.guild_id}:${userId}`;
      const last = this.lastPresence.get(key);

      const activity = presence.activities?.[0];
      const current = {
        status: presence.status,
        activity: activity?.name,
        activityType: activity?.type,
      };

      if (
        !last ||
        last.status !== current.status ||
        last.activity !== current.activity ||
        last.activityType !== current.activityType
      ) {
        await this.db.presenceEvent.create({
          data: {
            guildId: presence.guild_id,
            userId,
            status: presence.status,
            activity: current.activity,
            activityType: current.activityType,
            timestamp: new Date(),
          },
        });

        this.lastPresence.set(key, current);
      }
    } catch (error) {
      throw new Error(`Failed to process presence: ${error}`);
    }
  }

  private validatePresence(presence: unknown): presence is APIPresenceUpdate {
    if (!presence || typeof presence !== 'object') {
      return false;
    }

    const p = presence as Record<string, unknown>;

    if (!p.user || typeof p.user !== 'object') {
      return false;
    }

    const u = p.user as Record<string, unknown>;

    return !!(
      p.guild_id &&
      typeof p.guild_id === 'string' &&
      u.id &&
      typeof u.id === 'string' &&
      p.status &&
      typeof p.status === 'string'
    );
  }
}
