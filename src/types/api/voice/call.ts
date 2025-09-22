import type { Library } from '../../conversion';
import type { VoiceState } from './voiceState';

export type APICall = {
  channel_id: string;
  message_id: string;
  region: string;
  ringing: string[];
  voice_states: VoiceState[];
};

export type Call = Library<APICall>;
