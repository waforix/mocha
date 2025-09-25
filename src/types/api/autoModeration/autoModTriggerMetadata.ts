import { AutoModKeywordPresetType } from '../../../enums/autoModeration';
import type { Library } from '../../conversion';

export type APIAutoModTriggerMetadata = {
  keyword_filter: string[];
  regex_patterns: string[];
  presets: AutoModKeywordPresetType[];
  allow_list: string[];
  mention_total_limit: number;
  mention_raid_protection_enabled: boolean;
};

export type AutoModTriggerMetadata = Library<APIAutoModTriggerMetadata>;
