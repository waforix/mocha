import type { StatusType } from '../../enums/presence';
import type { Activity } from '../api';
import type { Event } from './event';

export type PresenceUpdate = Event<{
  since?: number | null;
  activities?: Activity[];
  status?: StatusType;
  afk?: boolean;
}>;
