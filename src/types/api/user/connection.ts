import type { IntegrationType, VisibilityType } from '../../../enums';
import type { Library } from '../../conversion';
import type { Integration } from '../guild/integration';

export type APIConnection = {
  id: string;
  name: string;
  type: IntegrationType;
  revoked?: boolean;
  integrations?: Partial<Integration>[];
  verified: boolean;
  friend_sync: boolean;
  show_activity: boolean;
  two_way_link: boolean;
  visibility: VisibilityType;
};

export type Connection = Library<APIConnection>;
