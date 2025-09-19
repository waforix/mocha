import type { GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, GuildScheduledEventStatus } from "../../../enums";
import type { Library } from "../../conversion";
import type { APIUser } from "../user/user";
import type { APIGuildScheduledEventEntityMetadata } from "./guildScheduledEventEntityMetadata";
import type { APIGuildScheduledEventRecurrenceRule } from "./guildScheduledEventRecurrenceRule";

export type APIGuildScheduledEvent = {
    id: string;
    guild_id: string;
    channel_id: string | null;
    creator_id?: string | null;
    name: string;
    description?: string | null;
    scheduled_start_time: Date;
    scheduled_end_time: Date | null;
    privacy_level: GuildScheduledEventPrivacyLevel;
    status: GuildScheduledEventStatus;
    entity_type: GuildScheduledEventEntityType;
    entity_id: string | null;
    entity_metadata: APIGuildScheduledEventEntityMetadata;
    creator?: APIUser;
    user_count?: number;
    image?: string | null;
    recurrence_rule: APIGuildScheduledEventRecurrenceRule;
}

export type GuildScheduledEvent = Library<APIGuildScheduledEvent>;