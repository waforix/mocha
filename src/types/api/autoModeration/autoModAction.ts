import type { AutoModActionType } from '../../../enums/autoModeration';
import type { Library } from '../../conversion';
import type { APIAutoModActionMetadata } from './autoModActionMetadata';

export type APIAutoModAction = {
  type: AutoModActionType;
  metadata?: APIAutoModActionMetadata;
};

export type AutoModAction = Library<APIAutoModAction>;
