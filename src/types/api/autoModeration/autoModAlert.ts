import type { AutoModDecisionOutcome } from '../../../enums';
import type {
  AutoModInteractionCallbackType,
  AutoModProfileUpdate,
  AutoModQuarantineEventType,
  AutoModQuarantineUserAction,
  AutoModQuarantineUserReason,
} from '../../../enums/autoModeration';
import type { Library } from '../../conversion';
import type { APIAutoModAlertActionsExecution } from './autoModAlertActionsExecution';

export type APIAutoModAlert = {
  rule_name: string;
  decision_id: string;
  decision_reason?: string;
  decision_outcome: AutoModDecisionOutcome;
  channel_id?: string;
  flagged_message_id?: string;
  keyword: string;
  keyword_matched_content: string;
  blocked_profile_update_type?: AutoModProfileUpdate;
  quarantine_user?: AutoModQuarantineUserReason;
  quarantine_user_action?: AutoModQuarantineUserAction;
  quarantine_event?: AutoModQuarantineEventType;
  voice_channel_status_outcome?: AutoModDecisionOutcome;
  application_name?: string;
  interaction_user_id?: string;
  interaction_callback_type?: AutoModInteractionCallbackType;
  timeout_duration?: number;
  alert_actions_execution?: APIAutoModAlertActionsExecution[];
};

export type AutoModAlert = Library<APIAutoModAlert>;
