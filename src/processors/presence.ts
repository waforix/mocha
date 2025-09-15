import { schema } from '../db/index';
import type { APIPresenceUpdate } from '../types/index';
import { BaseProcessor } from './base';

export class PresenceProcessor extends BaseProcessor<APIPresenceUpdate> {
  private lastPresence = new Map<
    string,
    { status: string; activity?: string; activityType?: number }
  >();

  async process(presence: APIPresenceUpdate) {
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
      await this.db.insert(schema.presenceEvents).values({
        guildId: presence.guild_id,
        userId: presence.user.id || '',
        status: presence.status,
        activity: current.activity,
        activityType: current.activityType,
        timestamp: new Date(),
      });

      this.lastPresence.set(key, current);
    }
  }
}
