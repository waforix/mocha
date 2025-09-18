import { AuditLogEvent } from "../../enums";
import { APIChannel, APIThreadMetadata, APIUser, APIWebhook } from "../api";

export type APIAuditLog = {
    application_commands: APIApplicationCommand[];
    audit_log_entries: APIAuditLogEntry[];
    auto_moderation_rules: APIAutoModerationRules[];
    guild_scheduled_events: APIGuildScheduledEvent[];
    integrations: APIIntegration[];
    threads: APIChannel[];
    users: APIUser[];
    webhooks: APIWebhook[];
}

export type APIAuditLogEntry = {
    target_id: string | null;
    changes: APIAuditLogChange<T>[];
    user_id: string | null;
    id: string;
    action_type: AuditLogEvent;
    options?: APIOptionalAuditEntryInfo;
    reason?: string;
}

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
    role_name: string; /* CHANNEL_OVERWRITE_*/
    type: string; /* CHANNEL_OVERWRITE_CREATE, CHANNEL_OVERWRITE_UPDATE, CHANNEL_OVERWRITE_DELETE */
    integration_type: string; /* MEMBER_KICK, MEMBER_ROLE_UPDATE */
}

export type APIAuditLogChange<T> = {
    new_value?: T;
    old_value?: T;
    key: string;
}

export type APIAuditLogEvent = {

}