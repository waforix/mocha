import type { Library } from '../../conversion';

export type APIWelcomeScreenChannel = {
  channel_id: string;
  description: string;
  emoji_id: string | null;
  emoji_name: string | null;
};

export type WelcomeScreenChannel = Library<APIWelcomeScreenChannel>;
