import { schema } from '../db/index';
import { BaseProcessor } from './base';

interface AutoModerationRuleData {
  id: string;
  guild_id: string;
  name: string;
  creator_id: string;
  event_type: number;
  trigger_type: number;
  trigger_metadata?: Record<string, unknown>;
  actions: Array<{
    type: number;
    metadata?: Record<string, unknown>;
  }>;
  enabled?: boolean;
}

interface AutoModerationActionData {
  guild_id: string;
  action: {
    type: number;
    metadata?: Record<string, unknown>;
  };
  rule_id: string;
  rule_trigger_type: number;
  user_id: string;
  channel_id?: string;
  message_id?: string;
  alert_system_message_id?: string;
  content?: string;
  matched_keyword?: string;
  matched_content?: string;
}

export class AutoModerationProcessor extends BaseProcessor<AutoModerationRuleData | AutoModerationActionData> {
  async process(data: AutoModerationRuleData | AutoModerationActionData): Promise<void> {
    if (this.isRuleData(data)) {
      await this.processRuleUpdate(data);
    } else if (this.isActionData(data)) {
      await this.processActionExecution(data);
    }
  }

  async processRuleCreate(data: AutoModerationRuleData): Promise<void> {
    if (!this.validateRuleData(data)) {
      return;
    }

    try {
      await this.db.insert(schema.autoModerationEvents).values({
        guildId: data.guild_id,
        ruleId: data.id,
        action: 'rule_create',
        userId: data.creator_id,
        ruleName: data.name,
        triggerType: data.trigger_type,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process auto moderation rule create: ${error}`);
    }
  }

  async processRuleUpdate(data: AutoModerationRuleData): Promise<void> {
    if (!this.validateRuleData(data)) {
      return;
    }

    try {
      await this.db.insert(schema.autoModerationEvents).values({
        guildId: data.guild_id,
        ruleId: data.id,
        action: 'rule_update',
        userId: data.creator_id,
        ruleName: data.name,
        triggerType: data.trigger_type,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process auto moderation rule update: ${error}`);
    }
  }

  async processRuleDelete(data: { id: string; guild_id: string }): Promise<void> {
    if (!data.id || !data.guild_id) {
      return;
    }

    try {
      await this.db.insert(schema.autoModerationEvents).values({
        guildId: data.guild_id,
        ruleId: data.id,
        action: 'rule_delete',
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process auto moderation rule delete: ${error}`);
    }
  }

  async processActionExecution(data: AutoModerationActionData): Promise<void> {
    if (!this.validateActionData(data)) {
      return;
    }

    try {
      if (data.channel_id) {
        await this.upsertChannel({
          id: data.channel_id,
          guild_id: data.guild_id,
          type: 0,
        });
      }

      await this.db.insert(schema.autoModerationEvents).values({
        guildId: data.guild_id,
        ruleId: data.rule_id,
        action: 'action_execution',
        userId: data.user_id,
        channelId: data.channel_id,
        messageId: data.message_id,
        triggerType: data.rule_trigger_type,
        actionType: data.action.type,
        content: data.content || data.matched_content || data.matched_keyword,
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to process auto moderation action execution: ${error}`);
    }
  }

  private isRuleData(data: unknown): data is AutoModerationRuleData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;
    return !!(d.name && d.creator_id && d.trigger_type);
  }

  private isActionData(data: unknown): data is AutoModerationActionData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;
    return !!(d.action && d.rule_id && d.user_id);
  }

  private validateRuleData(data: unknown): data is AutoModerationRuleData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;

    return !!(
      d.id &&
      typeof d.id === 'string' &&
      d.guild_id &&
      typeof d.guild_id === 'string' &&
      d.name &&
      typeof d.name === 'string' &&
      d.creator_id &&
      typeof d.creator_id === 'string' &&
      typeof d.trigger_type === 'number'
    );
  }

  private validateActionData(data: unknown): data is AutoModerationActionData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const d = data as Record<string, unknown>;

    return !!(
      d.guild_id &&
      typeof d.guild_id === 'string' &&
      d.rule_id &&
      typeof d.rule_id === 'string' &&
      d.user_id &&
      typeof d.user_id === 'string' &&
      d.action &&
      typeof d.action === 'object'
    );
  }
}
