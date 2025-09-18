import { z } from 'zod';
import { BaseEntitySchema, DiscordIdSchema } from './base';

export const GuildSchema = BaseEntitySchema.extend({
  id: DiscordIdSchema,
  name: z.string(),
  icon: z.string().nullable(),
  ownerId: DiscordIdSchema,
  memberCount: z.number().int().positive().nullable(),
});

export const ChannelSchema = z.object({
  id: DiscordIdSchema,
  guildId: DiscordIdSchema,
  name: z.string().nullable(),
  type: z.number().int(),
  parentId: DiscordIdSchema.nullable(),
  createdAt: z.date().default(() => new Date()),
});

export const UserSchema = BaseEntitySchema.extend({
  id: DiscordIdSchema,
  username: z.string(),
  discriminator: z.string(),
  avatar: z.string().nullable(),
  bot: z.boolean().default(false),
});

export const MemberSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => crypto.randomUUID()),
  guildId: DiscordIdSchema,
  userId: DiscordIdSchema,
  nick: z.string().nullable(),
  joinedAt: z.date(),
  leftAt: z.date().nullable(),
  roles: z.array(z.string()).default([]),
  createdAt: z.date().default(() => new Date()),
});

export type Guild = z.infer<typeof GuildSchema>;
export type Channel = z.infer<typeof ChannelSchema>;
export type User = z.infer<typeof UserSchema>;
export type Member = z.infer<typeof MemberSchema>;
