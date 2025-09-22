import type { AnimationType } from '../../../enums';
import type { Emoji } from '../../api';

export type VoiceChannelEffectSend = {
  channel_id: string;
  guild_id: string;
  user_id: string;
  emoji?: Emoji | null;
  animation_type?: AnimationType;
  sound_id?: string | number;
  sound_volume?: number;
};
