import type { Library } from '../../conversion';
import type { APIApplicationCommandData } from '../application';
import type { APIAutoModRule } from '../autoModeration/autoModRule';
import type { APIChannel } from '../channel/channel';
import type { APIIntegration } from '../guild/integration';
import type { APIGuildScheduledEvent } from '../guildScheduledEvent/guildScheduledEvent';
import type { APIUser } from '../user/user';
import type { APIWebhook } from '../webhook/webhook';
import type { APIAuditLogEntry } from './auditLogEntry';

export type APIAuditLog = {
  application_commands: APIApplicationCommandData[];
  audit_log_entries: APIAuditLogEntry[];
  auto_moderation_rules: APIAutoModRule[];
  guild_scheduled_events: APIGuildScheduledEvent[];
  integrations: APIIntegration[];
  threads: APIChannel[];
  users: APIUser[];
  webhooks: APIWebhook[];
};

export type AuditLog = Library<APIAuditLog>;
