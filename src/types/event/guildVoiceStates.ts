import { VoiceChannelEffect, VoiceState } from "../api";
import { Event } from "./event";

export type VoiceChannelEffectSend = Event<VoiceChannelEffect>;

export type VoiceStateUpdate = Event<VoiceState>;