export * from './base';
export * from './events';
export * from './guild';

import {
  MemberEventSchema,
  MessageEventSchema,
  PresenceEventSchema,
  ReactionEventSchema,
  VoiceEventSchema,
} from './events';
import { ChannelSchema, GuildSchema, MemberSchema, UserSchema } from './guild';

export const AllSchemas = {
  Guild: GuildSchema,
  Channel: ChannelSchema,
  User: UserSchema,
  Member: MemberSchema,
  MessageEvent: MessageEventSchema,
  VoiceEvent: VoiceEventSchema,
  MemberEvent: MemberEventSchema,
  PresenceEvent: PresenceEventSchema,
  ReactionEvent: ReactionEventSchema,
} as const;

export type SchemaName = keyof typeof AllSchemas;
