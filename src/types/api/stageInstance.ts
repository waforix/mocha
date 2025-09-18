import { PrivacyLevel } from "../../enums";
import { Library } from "../conversion";

export type APIStageInstance = {
    id: string;
    guild_id: string;
    channel_id: string;
    topic: string;
    privacy_level: PrivacyLevel;
    /**
     * @deprecated
     */
    discoverable_disabled: boolean;
    guild_scheduled_event_id: string | null;
}

export type StageInstance = Library<APIStageInstance>;