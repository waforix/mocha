import type { Library } from '../../conversion';
import type { APIGuildMember } from '../guild/guildMember';

export type APITyping = {
  channel_id: string;
  guild_id?: string;
  user_id: string;
  timestamp: number;
  member?: APIGuildMember;
};

export type Typing = Library<APITyping>;
