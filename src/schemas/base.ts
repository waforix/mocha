import { z } from 'zod';

export const BaseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const TimestampSchema = z.object({
  timestamp: z.date(),
  createdAt: z.date().default(() => new Date()),
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
