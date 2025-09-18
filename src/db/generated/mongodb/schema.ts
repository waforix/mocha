import { z } from 'zod';

const GuildMongoSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  icon: z.string().nullable(),
  ownerId: z.string(),
  memberCount: z.number().nullable(),
});
const ChannelMongoSchema = z.object({
  id: z.string(),
  guildId: z.string(),
  name: z.string().nullable(),
  type: z.number(),
  parentId: z.string().nullable(),
  createdAt: z.date(),
});
const UserMongoSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  username: z.string(),
  discriminator: z.string(),
  avatar: z.string().nullable(),
  bot: z.boolean(),
});
const MemberMongoSchema = z.object({
  id: z.string(),
  guildId: z.string(),
  userId: z.string(),
  nick: z.string().nullable(),
  joinedAt: z.date(),
  leftAt: z.date().nullable(),
  roles: z.array(z.string()),
  createdAt: z.date(),
});
const MessageEventMongoSchema = z.object({
  timestamp: z.date(),
  createdAt: z.date(),
  id: z.string(),
  guildId: z.string(),
  channelId: z.string(),
  userId: z.string(),
  content: z.string(),
  attachmentCount: z.number(),
  embedCount: z.number(),
});
const VoiceEventMongoSchema = z.object({
  timestamp: z.date(),
  createdAt: z.date(),
  id: z.string(),
  guildId: z.string(),
  channelId: z.string().nullable(),
  userId: z.string(),
  action: z.string(),
  duration: z.number().nullable(),
});
const MemberEventMongoSchema = z.object({
  timestamp: z.date(),
  createdAt: z.date(),
  id: z.string(),
  guildId: z.string(),
  userId: z.string(),
  action: z.string(),
  roles: z.array(z.string()),
});
const PresenceEventMongoSchema = z.object({
  timestamp: z.date(),
  createdAt: z.date(),
  id: z.string(),
  guildId: z.string(),
  userId: z.string(),
  status: z.string(),
  activity: z.string().nullable(),
  activityType: z.number().nullable(),
});
const ReactionEventMongoSchema = z.object({
  timestamp: z.date(),
  createdAt: z.date(),
  id: z.string(),
  guildId: z.string(),
  channelId: z.string(),
  messageId: z.string(),
  userId: z.string(),
  emojiId: z.string().nullable(),
  emojiName: z.string(),
  emojiAnimated: z.boolean(),
  action: z.string(),
});

export const guildSchema = GuildMongoSchema;
export const channelSchema = ChannelMongoSchema;
export const userSchema = UserMongoSchema;
export const memberSchema = MemberMongoSchema;
export const messageeventSchema = MessageEventMongoSchema;
export const voiceeventSchema = VoiceEventMongoSchema;
export const membereventSchema = MemberEventMongoSchema;
export const presenceeventSchema = PresenceEventMongoSchema;
export const reactioneventSchema = ReactionEventMongoSchema;
