import type { ReactionType } from '../../../enums';
import type { Emoji, GuildMember } from '../../api';

export type MessageReactionAdd = {
  user_id: string;
  channel_id: string;
  message_id: string;
  guild_id?: string;
  member?: GuildMember;
  emoji: Partial<Emoji>;
  message_author_id?: string;
  burst: boolean;
  burst_colors?: string[];
  type: ReactionType;
};
