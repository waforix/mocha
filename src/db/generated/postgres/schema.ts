import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const guildTable = pgTable('guild', {
  id: text('id').primaryKey(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
  name: text('name').notNull(),
  icon: text('icon'),
  ownerId: text('ownerId')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  memberCount: integer('memberCount'),
});
export const channelTable = pgTable('channel', {
  id: text('id').primaryKey(),
  guildId: text('guildId')
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  name: text('name'),
  type: integer('type').notNull(),
  parentId: text('parentId'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
});
export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
  username: text('username').notNull(),
  discriminator: text('discriminator').notNull(),
  avatar: text('avatar'),
  bot: boolean('bot').notNull().default(false),
});
export const memberTable = pgTable('member', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guildId: text('guildId')
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  nick: text('nick'),
  joinedAt: timestamp('joinedAt', { withTimezone: true }).notNull(),
  leftAt: timestamp('leftAt', { withTimezone: true }),
  roles: text('roles').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
});
export const messageeventTable = pgTable('messageevent', {
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  id: text('id').primaryKey(),
  guildId: text('guildId')
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  channelId: text('channelId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  attachmentCount: integer('attachmentCount').notNull().default(0),
  embedCount: integer('embedCount').notNull().default(0),
});
export const voiceeventTable = pgTable('voiceevent', {
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guildId: text('guildId')
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  channelId: text('channelId'),
  userId: text('userId')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  duration: integer('duration'),
});
export const membereventTable = pgTable('memberevent', {
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guildId: text('guildId')
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  roles: text('roles').notNull(),
});
export const presenceeventTable = pgTable('presenceevent', {
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guildId: text('guildId')
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  activity: text('activity'),
  activityType: integer('activityType'),
});
export const reactioneventTable = pgTable('reactionevent', {
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guildId: text('guildId')
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  channelId: text('channelId').notNull(),
  messageId: text('messageId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  emojiId: text('emojiId'),
  emojiName: text('emojiName').notNull(),
  emojiAnimated: boolean('emojiAnimated').notNull().default(false),
  action: text('action').notNull(),
});
