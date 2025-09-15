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
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('msg_guild_idx').on(table.guildId),
    userIdx: index('msg_user_idx').on(table.userId),
    timestampIdx: index('msg_timestamp_idx').on(table.timestamp),
    guildUserIdx: index('msg_guild_user_idx').on(table.guildId, table.userId),
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
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdx: index('reaction_guild_idx').on(table.guildId),
    messageIdx: index('reaction_message_idx').on(table.messageId),
    userIdx: index('reaction_user_idx').on(table.userId),
    timestampIdx: index('reaction_timestamp_idx').on(table.timestamp),
  })
);
