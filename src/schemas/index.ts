export * from './base';
export * from './guild';
export * from './events';

import { 
  GuildSchema, 
  ChannelSchema, 
  UserSchema, 
  MemberSchema 
} from './guild';
import { 
  MessageEventSchema, 
  VoiceEventSchema, 
  MemberEventSchema, 
  PresenceEventSchema, 
  ReactionEventSchema 
} from './events';

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
