import { ActionType, EventType, KeywordPresetType, TriggerType } from "../../enums";

export type APIAutoModerationRule = {
    id: string;
    guild_id: string;
    name: string;
    creator_id: string;
    event_type: EventType;
    trigger_type: TriggerType;
    trigger_metadata: APITriggerMetadata;
    actions: APIAutoModerationAction;
    enabled: boolean;
    exempt_roles: string[];
    exempt_channels: string[];
}

export type APITriggerMetadata = {
    keyword_filter: string[];
    regex_patterns: string[];
    presets: KeywordPresetType[];
    allow_list: string[];
    mention_total_limit: number;
    mention_raid_protection_enabled: boolean;
}

export type APIAutoModerationAction = {
    type: ActionType;
    metadata?: APIActionMetaData;
}

export type APIActionMetaData = {
    channel_id: string;
    duration_seconds: number;
    custom_message?: string;
}