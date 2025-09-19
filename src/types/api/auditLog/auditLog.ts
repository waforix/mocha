import { APIAutoModerationRule } from "../autoModeration/autoModerationRule";
import { APIChannel } from "../channel/channel";
import { APIIntegration } from "../guild/integration";
import { APIGuildScheduledEvent } from "../guildScheduledEvent/guildScheduledEvent";
import { APIApplicationCommandData } from "../message/applicationCommandData";
import { APIUser } from "../user/user";
import { APIWebhook } from "../webhook/webhook";
import { APIAuditLogEntry } from "./auditLogEntry";

export type APIAuditLog = {
    application_commands: APIApplicationCommandData[];
    audit_log_entries: APIAuditLogEntry[];
    auto_moderation_rules: APIAutoModerationRule[];
    guild_scheduled_events: APIGuildScheduledEvent[];
    integrations: APIIntegration[];
    threads: APIChannel[];
    users: APIUser[];
    webhooks: APIWebhook[];
}