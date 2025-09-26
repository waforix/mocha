import type { StatusType } from '../../../enums/presence';
import type { Library } from '../../conversion';
import type { APIUser } from '../user/user';
import type { APIActivity } from './activity';
import type { APIClientStatus } from './clientStatus';

export type APIPresence = {
  user: Partial<APIUser>;
  guild_id?: string;
  status: StatusType;
  activities: APIActivity[];
  hidden_activities: APIActivity[];
  client_status: APIClientStatus;
  has_played_game?: boolean;
};

export type Presence = Library<APIPresence>;
