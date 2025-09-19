import type { AvatarDecorationData, User } from '../../api';

export type GuildMemberUpdate = {
  guild_id: string;
  roles: string[];
  user: User;
  nick: string | null;
  avatar: string | null;
  banneer: string | null;
  joined_at: Date | null;
  premium_since: Date | null;
  deaf?: boolean;
  mute?: boolean;
  pending?: boolean;
  communication_disabled_until?: Date | null;
  flags?: number;
  avatar_decoration_data?: AvatarDecorationData | null;
};
