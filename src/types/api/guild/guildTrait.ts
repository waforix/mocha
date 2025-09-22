import type { Library } from '../../conversion';

export type APIGuildTrait = {
  emoji_id: string | null;
  emoji_name: string | null;
  emoji_animated: boolean;
  label: string;
  position: number;
};

export type GuildTrait = Library<APIGuildTrait>;
