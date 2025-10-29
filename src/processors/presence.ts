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
      const key = `${presence.guild_id}:${presence.user.id}`;
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
            userId: presence.user.id || '',
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

    return !!(
      p.guild_id &&
      typeof p.guild_id === 'string' &&
      p.user &&
      typeof p.user === 'object' &&
      p.status &&
      typeof p.status === 'string'
    );
  }
}
