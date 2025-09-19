import type {
  Channel,
  Guild,
  GuildScheduledEvent,
  SoundboardSound,
  StageInstance,
  VoiceState,
} from '../../api';
import type { GuildMember } from '../../api/guild/guildMember';

export type GuildCreate = Guild & {
  joined_at: Date;
  large: boolean;
  unavailable?: boolean;
  member_count: number;
  voice_states: Partial<VoiceState>[];
  members: GuildMember[];
  channels: Channel[];
  threads: Channel[];
  presences: undefined;
  stage_instances: StageInstance[];
  guild_scheduled_events: GuildScheduledEvent[];
  soundboard_sounds: SoundboardSound[];
};
