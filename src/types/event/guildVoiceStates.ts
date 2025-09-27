import type { VoiceChannelEffect, VoiceState } from '../api';
import type { Event } from './event';

export type VoiceChannelEffectSend = Event<VoiceChannelEffect>;

export type VoiceStateUpdate = Event<VoiceState>;
