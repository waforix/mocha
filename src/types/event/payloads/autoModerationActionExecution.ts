import type { TriggerType } from '../../../enums';
import type { AutoModerationAction } from '../../api';

export type AutoModerationActionExecution = {
  guild_id: string;
  action: AutoModerationAction;
  rule_id: string;
  rule_trigger_type: TriggerType;
  user_id: string;
  channel_id?: string;
  message_id?: string;
  alert_system_message_id?: string;
  content?: string;
  matched_keyword: string | null;
  matched_content?: string | null;
};
