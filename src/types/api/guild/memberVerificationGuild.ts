import type { GuildFeature } from '../../../enums';
import type { Library } from '../../conversion';
import type { Emoji } from '../emoji/emoji';

export type APIMemberVerificationGuild = {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  splash: string | null;
  discovery_splash: string | null;
  home_header: string | null;
  verification_level: number;
  features: GuildFeature[];
  emojis: Emoji[];
  approximate_member_count: number;
  approximate_presence_count: number;
};

export type MemberVerificationGuild = Library<APIMemberVerificationGuild>;
