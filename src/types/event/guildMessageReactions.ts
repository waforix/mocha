import type { Emoji, MessageReaction } from '../api';
import type { Event } from './event';

export type MessageReactionAdd = Event<MessageReaction>;

export type MessageReactionRemove = Event<
  Omit<MessageReaction, 'member' | 'messageAuthorId' | 'burstColors'>
>;

export type MessageReactionRemoveAll = Event<{
  channelId: string;
  messageId: string;
  guildId?: string;
}>;

export type MessageReactionRemoveEmoji = Event<{
  channelId: string;
  guildId?: string;
  messageId: string;
  emoji: Partial<Emoji>;
}>;
