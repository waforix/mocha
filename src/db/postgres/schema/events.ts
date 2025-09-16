import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { channels, guilds, users } from './guilds';

export const messageEvents = pgTable(
  'message_events',
  {
    id: text('id').primaryKey(),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    channelId: text('channel_id')
      .notNull()
      .references(() => channels.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    attachmentCount: integer('attachment_count').notNull().default(0),
    embedCount: integer('embed_count').notNull().default(0),
    threadId: text('thread_id'),
    parentChannelId: text('parent_channel_id'),
    messageType: integer('message_type').default(0),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('msg_guild_idx').on(table.guildId),
    userIdx: index('msg_user_idx').on(table.userId),
    timestampIdx: index('msg_timestamp_idx').on(table.timestamp),
    guildUserIdx: index('msg_guild_user_idx').on(table.guildId, table.userId),
    threadIdx: index('msg_thread_idx').on(table.threadId),
    parentChannelIdx: index('msg_parent_channel_idx').on(table.parentChannelId),
  })
);

export const voiceEvents = pgTable(
  'voice_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    channelId: text('channel_id').references(() => channels.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    action: text('action', { enum: ['join', 'leave', 'move'] }).notNull(),
    duration: integer('duration'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('voice_guild_idx').on(table.guildId),
    userIdx: index('voice_user_idx').on(table.userId),
    timestampIdx: index('voice_timestamp_idx').on(table.timestamp),
    guildUserIdx: index('voice_guild_user_idx').on(table.guildId, table.userId),
  })
);

export const memberEvents = pgTable(
  'member_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    action: text('action', { enum: ['join', 'leave'] }).notNull(),
    roles: text('roles').notNull().default('[]'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('member_guild_idx').on(table.guildId),
    userIdx: index('member_user_idx').on(table.userId),
    timestampIdx: index('member_timestamp_idx').on(table.timestamp),
  })
);

export const presenceEvents = pgTable(
  'presence_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: text('status', { enum: ['online', 'idle', 'dnd', 'offline'] }).notNull(),
    activity: text('activity'),
    activityType: integer('activity_type'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('presence_guild_idx').on(table.guildId),
    userIdx: index('presence_user_idx').on(table.userId),
    timestampIdx: index('presence_timestamp_idx').on(table.timestamp),
  })
);

export const reactionEvents = pgTable(
  'reaction_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    channelId: text('channel_id')
      .notNull()
      .references(() => channels.id, { onDelete: 'cascade' }),
    messageId: text('message_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    emojiId: text('emoji_id'),
    emojiName: text('emoji_name').notNull(),
    emojiAnimated: integer('emoji_animated').default(0),
    action: text('action', { enum: ['add', 'remove'] }).notNull(),
    threadId: text('thread_id'),
    parentChannelId: text('parent_channel_id'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('reaction_guild_idx').on(table.guildId),
    messageIdx: index('reaction_message_idx').on(table.messageId),
    userIdx: index('reaction_user_idx').on(table.userId),
    timestampIdx: index('reaction_timestamp_idx').on(table.timestamp),
    threadIdx: index('reaction_thread_idx').on(table.threadId),
  })
);

export const channelEvents = pgTable(
  'channel_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    channelId: text('channel_id').notNull(),
    action: text('action', { enum: ['create', 'update', 'delete'] }).notNull(),
    channelType: integer('channel_type').notNull(),
    name: text('name'),
    parentId: text('parent_id'),
    threadId: text('thread_id'),
    isThread: integer('is_thread').default(0),
    threadMetadata: text('thread_metadata'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('channel_guild_idx').on(table.guildId),
    channelIdx: index('channel_channel_idx').on(table.channelId),
    timestampIdx: index('channel_timestamp_idx').on(table.timestamp),
    threadIdx: index('channel_thread_idx').on(table.threadId),
  })
);

export const roleEvents = pgTable(
  'role_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    roleId: text('role_id').notNull(),
    action: text('action', { enum: ['create', 'update', 'delete'] }).notNull(),
    name: text('name'),
    color: integer('color'),
    permissions: text('permissions'),
    position: integer('position'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('role_guild_idx').on(table.guildId),
    roleIdx: index('role_role_idx').on(table.roleId),
    timestampIdx: index('role_timestamp_idx').on(table.timestamp),
  })
);

export const guildEvents = pgTable(
  'guild_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    action: text('action', {
      enum: ['update', 'ban_add', 'ban_remove', 'emoji_update', 'sticker_update'],
    }).notNull(),
    targetUserId: text('target_user_id'),
    reason: text('reason'),
    changes: text('changes'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('guild_event_guild_idx').on(table.guildId),
    targetUserIdx: index('guild_event_target_user_idx').on(table.targetUserId),
    timestampIdx: index('guild_event_timestamp_idx').on(table.timestamp),
  })
);

export const inviteEvents = pgTable(
  'invite_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    channelId: text('channel_id').references(() => channels.id, { onDelete: 'cascade' }),
    inviteCode: text('invite_code').notNull(),
    inviterId: text('inviter_id').references(() => users.id, { onDelete: 'cascade' }),
    action: text('action', { enum: ['create', 'delete'] }).notNull(),
    maxAge: integer('max_age'),
    maxUses: integer('max_uses'),
    temporary: integer('temporary').default(0),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('invite_guild_idx').on(table.guildId),
    inviterIdx: index('invite_inviter_idx').on(table.inviterId),
    timestampIdx: index('invite_timestamp_idx').on(table.timestamp),
  })
);

export const interactionEvents = pgTable(
  'interaction_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guildId: text('guild_id').references(() => guilds.id, { onDelete: 'cascade' }),
    channelId: text('channel_id').references(() => channels.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    interactionType: integer('interaction_type').notNull(),
    commandName: text('command_name'),
    customId: text('custom_id'),
    threadId: text('thread_id'),
    parentChannelId: text('parent_channel_id'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('interaction_guild_idx').on(table.guildId),
    userIdx: index('interaction_user_idx').on(table.userId),
    timestampIdx: index('interaction_timestamp_idx').on(table.timestamp),
    threadIdx: index('interaction_thread_idx').on(table.threadId),
  })
);

export const scheduledEvents = pgTable(
  'scheduled_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    eventId: text('event_id').notNull(),
    action: text('action', {
      enum: ['create', 'update', 'delete', 'user_add', 'user_remove'],
    }).notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
    name: text('name'),
    description: text('description'),
    scheduledStartTime: timestamp('scheduled_start_time', { withTimezone: true }),
    scheduledEndTime: timestamp('scheduled_end_time', { withTimezone: true }),
    entityType: integer('entity_type'),
    status: integer('status'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('scheduled_event_guild_idx').on(table.guildId),
    eventIdx: index('scheduled_event_event_idx').on(table.eventId),
    userIdx: index('scheduled_event_user_idx').on(table.userId),
    timestampIdx: index('scheduled_event_timestamp_idx').on(table.timestamp),
  })
);

export const autoModerationEvents = pgTable(
  'auto_moderation_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    ruleId: text('rule_id').notNull(),
    action: text('action', {
      enum: ['rule_create', 'rule_update', 'rule_delete', 'action_execution'],
    }).notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
    channelId: text('channel_id').references(() => channels.id, { onDelete: 'cascade' }),
    messageId: text('message_id'),
    ruleName: text('rule_name'),
    triggerType: integer('trigger_type'),
    actionType: integer('action_type'),
    content: text('content'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('auto_mod_guild_idx').on(table.guildId),
    ruleIdx: index('auto_mod_rule_idx').on(table.ruleId),
    userIdx: index('auto_mod_user_idx').on(table.userId),
    timestampIdx: index('auto_mod_timestamp_idx').on(table.timestamp),
  })
);
