import type { Library } from '../../conversion';
import type { APIGuildMember } from '../guild/guildMember';

export type APIThreadMember = {
  id?: string;
  user_id?: string;
  join_timestamp: Date;
  flags: number;
  member?: APIGuildMember;
};

export type ThreadMember = Library<APIThreadMember>;
