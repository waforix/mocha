import { KeywordPresetType } from "../../../enums";
import { Library } from "../../conversion";

export type APITriggerMetadata = {
    keyword_filter: string[];
    regex_patterns: string[];
    presets: KeywordPresetType[];
    allow_list: string[];
    mention_total_limit: number;
    mention_raid_protection_enabled: boolean;
}

export type TriggerMetadata = Library<APITriggerMetadata>;