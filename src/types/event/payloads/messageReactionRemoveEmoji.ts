import type { Emoji } from '../../api';

export type MessageReactionRemoveEmoji = {
  channel_id: string;
  guild_id?: string;
  message_id: string;
  emoji: Partial<Emoji>;
};
