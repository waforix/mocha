import type { InteractionContextType, InteractionType } from '../../../enums';
import type { Library } from '../../conversion';
import type { APIUser } from '../user/user';

export type APIMessageInteractionMetadata = {
  id: string;
  type: InteractionType;
  user: APIUser;
  authorizing_integration_owners: Record<InteractionContextType, string>;
  original_response_message?: string;
  target_user?: APIUser;
  target_message_id?: string;
};

export type MessageInteractionMetadata = Library<APIMessageInteractionMetadata>;
