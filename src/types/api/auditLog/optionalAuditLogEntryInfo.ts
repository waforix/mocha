import { IntegrationType, OverwriteType } from '../../../enums';
import type { Library } from '../../conversion';

export type APIOptionalAuditLogEntryInfo = {
  application_id: string;
  auto_moderation_rule_name: string;
  auto_moderation_rule_trigger_type: string;
  channel_id: string;
  count?: string;
  delete_member_days?: string;
  event_exception_id: string;
  id: string;
  integration_type?: IntegrationType;
  members_removed?: string;
  message_id: string;
  role_name?: string;
  type: OverwriteType;
};

export type OptionalAuditLogEntryInfo = Library<APIOptionalAuditLogEntryInfo>;
