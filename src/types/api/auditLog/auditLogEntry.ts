import { AuditLogEvent } from "../../../enums";
import { Library } from "../../conversion";
import { APIAuditLogChange } from "./auditLogChange";
import { APIOptionalAuditEntryInfo } from "./optionalAuditLogEntryInfo";

export type APIAuditLogEntry = {
    target_id: string | null;
    changes: APIAuditLogChange<Object>[];
    user_id: string | null;
    id: string;
    action_type: AuditLogEvent;
    options?: APIOptionalAuditEntryInfo;
    reason?: string;
}

export type AuditLogEntry = Library<APIAuditLogEntry>;