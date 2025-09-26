import type { ActivityType } from '../../../enums/presence';
import type { Library } from '../../conversion';
import type { APIActivityTimestamps } from './activityTimestamps';

export type APIActivity = {
  id?: string;
  name: string;
  type: ActivityType;
  url?: string | null;
  created_at: number;
  session_id?: string;
  platform?: string;
  supported_platforms?: string[];
  timestamps?: APIActivityTimestamps;
};

export type Activity = Library<APIActivity>;
