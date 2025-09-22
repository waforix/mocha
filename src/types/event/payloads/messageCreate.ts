import type { GuildMember, Message, User } from '../../api';

type Mention = User & {
  member: Partial<GuildMember>;
};

export type MessageCreate = Message & {
  guild_id?: string;
  member?: Partial<GuildMember>;
  mentions: Mention[];
};
