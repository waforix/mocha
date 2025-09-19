import type { ClientStatus } from '../../../enums';
import type { Activity, User } from '../../api';

export type PresenceUpdate = {
  user: User;
  guild_id: string;
  status: string;
  activities: Activity[];
  client_status: ClientStatus;
};
