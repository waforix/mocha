import type { Library } from "../../conversion";

export type APIOptionalAuditEntryInfo = {
    application_id: string;
    auto_moderation_rule_name: string;
    auto_moderation_rule_trigger_type: string;
    channel_id: string;
    count: string;
    delete_member_days: string;
    id: string;
    members_removed: string;
    message_id: string;
    role_name: string;
    type: string;
    integration_type: string;
}

export type OptionalAuditEntryInfo = Library<APIOptionalAuditEntryInfo>;