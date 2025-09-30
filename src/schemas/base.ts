import { z } from 'zod';

export const AUTO_NOW_SYMBOL = Symbol('AUTO_NOW');
export const AUTO_UUID_SYMBOL = Symbol('AUTO_UUID');

export const AutoTimestamp = () => {
  const schema = z.date();
  // biome-ignore lint/suspicious/noExplicitAny: Need to attach symbol to schema
  (schema as any)[AUTO_NOW_SYMBOL] = true;
  return schema;
};

export const AutoUUID = () => {
  const schema = z.string().uuid();
  // biome-ignore lint/suspicious/noExplicitAny: Need to attach symbol to schema
  (schema as any)[AUTO_UUID_SYMBOL] = true;
  return schema;
};

export const BaseEntitySchema = z.object({
  id: z.string(),
  createdAt: AutoTimestamp(),
  updatedAt: z.date(),
});

export const TimestampSchema = z.object({
  timestamp: z.date(),
  createdAt: AutoTimestamp(),
});

export const DiscordIdSchema = z.string().regex(/^\d{17,19}$/);

export const VoiceActionSchema = z.enum(['join', 'leave', 'move']);
export const MemberActionSchema = z.enum(['join', 'leave']);
export const ReactionActionSchema = z.enum(['add', 'remove']);
export const PresenceStatusSchema = z.enum(['online', 'idle', 'dnd', 'offline']);

export type BaseEntity = z.infer<typeof BaseEntitySchema>;
export type Timestamp = z.infer<typeof TimestampSchema>;
export type VoiceAction = z.infer<typeof VoiceActionSchema>;
export type MemberAction = z.infer<typeof MemberActionSchema>;
export type ReactionAction = z.infer<typeof ReactionActionSchema>;
export type PresenceStatus = z.infer<typeof PresenceStatusSchema>;
