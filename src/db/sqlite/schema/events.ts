import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { channels, guilds, users } from './guilds';

export const messageEvents = sqliteTable(
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
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
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

export const voiceEvents = sqliteTable(
  'voice_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    channelId: text('channel_id').references(() => channels.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    action: text('action', { enum: ['join', 'leave', 'move'] }).notNull(),
    duration: integer('duration'),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildIdx: index('voice_guild_idx').on(table.guildId),
    userIdx: index('voice_user_idx').on(table.userId),
    timestampIdx: index('voice_timestamp_idx').on(table.timestamp),
    guildUserIdx: index('voice_guild_user_idx').on(table.guildId, table.userId),
  })
);

export const memberEvents = sqliteTable(
  'member_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    action: text('action', { enum: ['join', 'leave'] }).notNull(),
    roles: text('roles').notNull().default('[]'),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildIdx: index('member_guild_idx').on(table.guildId),
    userIdx: index('member_user_idx').on(table.userId),
    timestampIdx: index('member_timestamp_idx').on(table.timestamp),
  })
);

export const presenceEvents = sqliteTable(
  'presence_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: text('status', { enum: ['online', 'idle', 'dnd', 'offline'] }).notNull(),
    activity: text('activity'),
    activityType: integer('activity_type'),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildIdx: index('presence_guild_idx').on(table.guildId),
    userIdx: index('presence_user_idx').on(table.userId),
    timestampIdx: index('presence_timestamp_idx').on(table.timestamp),
  })
);

export const reactionEvents = sqliteTable(
  'reaction_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
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
    emojiAnimated: integer('emoji_animated', { mode: 'boolean' }).default(false),
    action: text('action', { enum: ['add', 'remove'] }).notNull(),
    threadId: text('thread_id'),
    parentChannelId: text('parent_channel_id'),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildIdx: index('reaction_guild_idx').on(table.guildId),
    messageIdx: index('reaction_message_idx').on(table.messageId),
    userIdx: index('reaction_user_idx').on(table.userId),
    timestampIdx: index('reaction_timestamp_idx').on(table.timestamp),
    threadIdx: index('reaction_thread_idx').on(table.threadId),
  })
);

export const channelEvents = sqliteTable(
  'channel_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    channelId: text('channel_id').notNull(),
    action: text('action', { enum: ['create', 'update', 'delete'] }).notNull(),
    channelType: integer('channel_type').notNull(),
    name: text('name'),
    parentId: text('parent_id'),
    threadId: text('thread_id'),
    isThread: integer('is_thread', { mode: 'boolean' }).default(false),
    threadMetadata: text('thread_metadata'),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildIdx: index('channel_guild_idx').on(table.guildId),
    channelIdx: index('channel_channel_idx').on(table.channelId),
    timestampIdx: index('channel_timestamp_idx').on(table.timestamp),
    threadIdx: index('channel_thread_idx').on(table.threadId),
  })
);

export const roleEvents = sqliteTable(
  'role_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    roleId: text('role_id').notNull(),
    action: text('action', { enum: ['create', 'update', 'delete'] }).notNull(),
    name: text('name'),
    color: integer('color'),
    permissions: text('permissions'),
    position: integer('position'),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildIdx: index('role_guild_idx').on(table.guildId),
    roleIdx: index('role_role_idx').on(table.roleId),
    timestampIdx: index('role_timestamp_idx').on(table.timestamp),
  })
);

export const guildEvents = sqliteTable(
  'guild_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    action: text('action', { enum: ['update', 'ban_add', 'ban_remove', 'emoji_update', 'sticker_update'] }).notNull(),
    targetUserId: text('target_user_id'),
    reason: text('reason'),
    changes: text('changes'),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildIdx: index('guild_event_guild_idx').on(table.guildId),
    targetUserIdx: index('guild_event_target_user_idx').on(table.targetUserId),
    timestampIdx: index('guild_event_timestamp_idx').on(table.timestamp),
  })
);

export const inviteEvents = sqliteTable(
  'invite_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    channelId: text('channel_id')
      .references(() => channels.id, { onDelete: 'cascade' }),
    inviteCode: text('invite_code').notNull(),
    inviterId: text('inviter_id')
      .references(() => users.id, { onDelete: 'cascade' }),
    action: text('action', { enum: ['create', 'delete'] }).notNull(),
    maxAge: integer('max_age'),
    maxUses: integer('max_uses'),
    temporary: integer('temporary', { mode: 'boolean' }).default(false),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildIdx: index('invite_guild_idx').on(table.guildId),
    inviterIdx: index('invite_inviter_idx').on(table.inviterId),
    timestampIdx: index('invite_timestamp_idx').on(table.timestamp),
  })
);

export const interactionEvents = sqliteTable(
  'interaction_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    guildId: text('guild_id')
      .references(() => guilds.id, { onDelete: 'cascade' }),
    channelId: text('channel_id')
      .references(() => channels.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    interactionType: integer('interaction_type').notNull(),
    commandName: text('command_name'),
    customId: text('custom_id'),
    threadId: text('thread_id'),
    parentChannelId: text('parent_channel_id'),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildIdx: index('interaction_guild_idx').on(table.guildId),
    userIdx: index('interaction_user_idx').on(table.userId),
    timestampIdx: index('interaction_timestamp_idx').on(table.timestamp),
    threadIdx: index('interaction_thread_idx').on(table.threadId),
  })
);

export const scheduledEvents = sqliteTable(
  'scheduled_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    eventId: text('event_id').notNull(),
    action: text('action', { enum: ['create', 'update', 'delete', 'user_add', 'user_remove'] }).notNull(),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name'),
    description: text('description'),
    scheduledStartTime: integer('scheduled_start_time', { mode: 'timestamp' }),
    scheduledEndTime: integer('scheduled_end_time', { mode: 'timestamp' }),
    entityType: integer('entity_type'),
    status: integer('status'),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildIdx: index('scheduled_event_guild_idx').on(table.guildId),
    eventIdx: index('scheduled_event_event_idx').on(table.eventId),
    userIdx: index('scheduled_event_user_idx').on(table.userId),
    timestampIdx: index('scheduled_event_timestamp_idx').on(table.timestamp),
  })
);

export const autoModerationEvents = sqliteTable(
  'auto_moderation_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    guildId: text('guild_id')
      .notNull()
      .references(() => guilds.id, { onDelete: 'cascade' }),
    ruleId: text('rule_id').notNull(),
    action: text('action', { enum: ['rule_create', 'rule_update', 'rule_delete', 'action_execution'] }).notNull(),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' }),
    channelId: text('channel_id')
      .references(() => channels.id, { onDelete: 'cascade' }),
    messageId: text('message_id'),
    ruleName: text('rule_name'),
    triggerType: integer('trigger_type'),
    actionType: integer('action_type'),
    content: text('content'),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildIdx: index('auto_mod_guild_idx').on(table.guildId),
    ruleIdx: index('auto_mod_rule_idx').on(table.ruleId),
    userIdx: index('auto_mod_user_idx').on(table.userId),
    timestampIdx: index('auto_mod_timestamp_idx').on(table.timestamp),
  })
);
