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
  })
);
