import { z } from 'zod';
import {
  DiscordIdSchema,
  MemberActionSchema,
  PresenceStatusSchema,
  ReactionActionSchema,
  TimestampSchema,
  VoiceActionSchema,
} from './base';

export const MessageEventSchema = TimestampSchema.extend({
  id: DiscordIdSchema,
  guildId: DiscordIdSchema,
  channelId: DiscordIdSchema,
  userId: DiscordIdSchema,
  content: z.string(),
  attachmentCount: z.number().int().min(0).default(0),
  embedCount: z.number().int().min(0).default(0),
});

export const VoiceEventSchema = TimestampSchema.extend({
  id: z
    .string()
    .uuid()
    .default(() => crypto.randomUUID()),
  guildId: DiscordIdSchema,
  channelId: DiscordIdSchema.nullable(),
  userId: DiscordIdSchema,
  action: VoiceActionSchema,
  duration: z.number().int().positive().nullable(),
});

export const MemberEventSchema = TimestampSchema.extend({
  id: z
    .string()
    .uuid()
    .default(() => crypto.randomUUID()),
  guildId: DiscordIdSchema,
  userId: DiscordIdSchema,
  action: MemberActionSchema,
  roles: z.array(z.string()).default([]),
});

export const PresenceEventSchema = TimestampSchema.extend({
  id: z
    .string()
    .uuid()
    .default(() => crypto.randomUUID()),
  guildId: DiscordIdSchema,
  userId: DiscordIdSchema,
  status: PresenceStatusSchema,
  activity: z.string().nullable(),
  activityType: z.number().int().nullable(),
});

export const ReactionEventSchema = TimestampSchema.extend({
  id: z
    .string()
    .uuid()
    .default(() => crypto.randomUUID()),
  guildId: DiscordIdSchema,
  channelId: DiscordIdSchema,
  messageId: DiscordIdSchema,
  userId: DiscordIdSchema,
  emojiId: DiscordIdSchema.nullable(),
  emojiName: z.string(),
  emojiAnimated: z.boolean().default(false),
  action: ReactionActionSchema,
});

export type MessageEvent = z.infer<typeof MessageEventSchema>;
export type VoiceEvent = z.infer<typeof VoiceEventSchema>;
export type MemberEvent = z.infer<typeof MemberEventSchema>;
export type PresenceEvent = z.infer<typeof PresenceEventSchema>;
export type ReactionEvent = z.infer<typeof ReactionEventSchema>;
