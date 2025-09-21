import type { AuditLogEvent } from '../../../enums';
import type { Library } from '../../conversion';
import type { APIAuditLogChange } from './auditLogChange';
import type { APIOptionalAuditEntryInfo } from './optionalAuditLogEntryInfo';

export type APIAuditLogEntry = {
  target_id: string | null;
  changes: APIAuditLogChange<Record<string, unknown>>[];
  user_id: string | null;
  id: string;
  action_type: AuditLogEvent;
  options?: APIOptionalAuditEntryInfo;
  reason?: string;
};

export type AuditLogEntry = Library<APIAuditLogEntry>;
