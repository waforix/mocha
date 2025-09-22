import type { AnimationType } from '../../../enums';
import type { Library } from '../../conversion';
import type { Emoji } from '../emoji/emoji';

export type APIVoiceChannelEffect = {
  channel_id: string;
  guild_id: string;
  user_id: string;
  emoji?: Emoji | null;
  animation_type?: AnimationType | null;
  sound_id?: string | number;
  sound_volume?: number;
};

export type VoiceChannelEffect = Library<APIVoiceChannelEffect>;
