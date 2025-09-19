import { EventType, TriggerType } from "../../../enums";
import { Library } from "../../conversion";
import { APIAutoModerationAction } from "./autoModerationAction";
import { APITriggerMetadata } from "./triggerMetadata";

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

export type AutoModerationRule = Library<APIAutoModerationRule>;