import { schema } from '../db/index';
import { BaseProcessor } from './base';

interface ScheduledEventData {
  id: string;
  guild_id: string;
  name?: string;
  description?: string;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  entity_type?: number;
  status?: number;
  creator?: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
  };
}

interface ScheduledEventUserData {
  guild_scheduled_event_id: string;
  guild_id: string;
  user_id: string;
}

export class ScheduledEventProcessor extends BaseProcessor<ScheduledEventData> {
  async process(data: ScheduledEventData): Promise<void> {
    if (!this.validateScheduledEventData(data)) {
      return;
    }

    try {
      await this.processUpdate(data);
    } catch (error) {
      throw new Error(`Failed to process scheduled event: ${error}`);
    }
  }

  async processCreate(data: ScheduledEventData): Promise<void> {
    if (!this.validateScheduledEventData(data)) {
      return;
    }

    try {
      if (data.creator) {
        await this.upsertUser(data.creator);
      }

      await this.db.insert(schema.scheduledEvents).values({
        guildId: data.guild_id,
        eventId: data.id,
        action: 'create',
        name: data.name,
        description: data.description,
        scheduledStartTime: data.scheduled_start_time ? new Date(data.scheduled_start_time) : null,
        scheduledEndTime: data.scheduled_end_time ? new Date(data.scheduled_end_time) : null,
        entityType: data.entity_type,
        status: data.status,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process scheduled event create: ${error}`);
    }
  }

  async processUpdate(data: ScheduledEventData): Promise<void> {
    if (!this.validateScheduledEventData(data)) {
      return;
    }

    try {
      if (data.creator) {
        await this.upsertUser(data.creator);
      }

      await this.db.insert(schema.scheduledEvents).values({
        guildId: data.guild_id,
        eventId: data.id,
        action: 'update',
        name: data.name,
        description: data.description,
        scheduledStartTime: data.scheduled_start_time ? new Date(data.scheduled_start_time) : null,
        scheduledEndTime: data.scheduled_end_time ? new Date(data.scheduled_end_time) : null,
        entityType: data.entity_type,
        status: data.status,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process scheduled event update: ${error}`);
    }
  }

  async processDelete(data: { id: string; guild_id: string }): Promise<void> {
    if (!data.id || !data.guild_id) {
      return;
    }

    try {
      await this.db.insert(schema.scheduledEvents).values({
        guildId: data.guild_id,
        eventId: data.id,
        action: 'delete',
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process scheduled event delete: ${error}`);
    }
  }

  async processUserAdd(data: ScheduledEventUserData): Promise<void> {
    if (!this.validateScheduledEventUserData(data)) {
      return;
    }

    try {
      await this.db.insert(schema.scheduledEvents).values({
        guildId: data.guild_id,
        eventId: data.guild_scheduled_event_id,
        action: 'user_add',
        userId: data.user_id,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process scheduled event user add: ${error}`);
    }
  }

  async processUserRemove(data: ScheduledEventUserData): Promise<void> {
    if (!this.validateScheduledEventUserData(data)) {
      return;
    }

    try {
      await this.db.insert(schema.scheduledEvents).values({
        guildId: data.guild_id,
        eventId: data.guild_scheduled_event_id,
        action: 'user_remove',
        userId: data.user_id,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process scheduled event user remove: ${error}`);
    }
  }

  private validateScheduledEventData(data: unknown): data is ScheduledEventData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;

    return !!(d.id && typeof d.id === 'string' && d.guild_id && typeof d.guild_id === 'string');
  }

  private validateScheduledEventUserData(data: unknown): data is ScheduledEventUserData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;

    return !!(
      d.guild_scheduled_event_id &&
      typeof d.guild_scheduled_event_id === 'string' &&
      d.guild_id &&
      typeof d.guild_id === 'string' &&
      d.user_id &&
      typeof d.user_id === 'string'
    );
  }
}
