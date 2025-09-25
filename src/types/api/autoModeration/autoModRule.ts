import { AutoModEventType, AutoModTriggerType } from '../../../enums/autoModeration';
import type { Library } from '../../conversion';
import { APIAutoModAction } from './autoModAction';
import { APIAutoModTriggerMetadata } from './autoModTriggerMetadata';

export type APIAutoModRule = {
  id: string;
  guild_id: string;
  name: string;
  creator_id: string;
  event_type: AutoModEventType;
  trigger_type: AutoModTriggerType;
  trigger_metadata: APIAutoModTriggerMetadata;
  actions: APIAutoModAction[];
  enabled: boolean;
  exempt_roles: string[];
  exempt_channels: string[];
};

export type AutoModRule = Library<APIAutoModRule>;
