import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';

export const guildTable = sqliteTable('guild', {
  id: text('id').primaryKey(),
  createdAt: integer('createdAt').notNull(),
  updatedAt: integer('updatedAt').notNull(),
  name: text('name').notNull(),
  icon: text('icon'),
  ownerId: text('ownerId').notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  memberCount: integer('memberCount')
});
export const channelTable = sqliteTable('channel', {
  id: text('id').primaryKey(),
  guildId: text('guildId').notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  name: text('name'),
  type: integer('type').notNull(),
  parentId: text('parentId'),
  createdAt: integer('createdAt').notNull()
});
export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  createdAt: integer('createdAt').notNull(),
  updatedAt: integer('updatedAt').notNull(),
  username: text('username').notNull(),
  discriminator: text('discriminator').notNull(),
  avatar: text('avatar'),
  bot: integer('bot').notNull().default(0)
});
export const memberTable = sqliteTable('member', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  guildId: text('guildId').notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  nick: text('nick'),
  joinedAt: integer('joinedAt').notNull(),
  leftAt: integer('leftAt'),
  roles: text('roles').notNull(),
  createdAt: integer('createdAt').notNull()
});
export const messageeventTable = sqliteTable('messageevent', {
  timestamp: integer('timestamp').notNull(),
  createdAt: integer('createdAt').notNull(),
  id: text('id').primaryKey(),
  guildId: text('guildId').notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  channelId: text('channelId').notNull(),
  userId: text('userId').notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  attachmentCount: integer('attachmentCount').notNull().default(0),
  embedCount: integer('embedCount').notNull().default(0)
});
export const voiceeventTable = sqliteTable('voiceevent', {
  timestamp: integer('timestamp').notNull(),
  createdAt: integer('createdAt').notNull(),
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  guildId: text('guildId').notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  channelId: text('channelId'),
  userId: text('userId').notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  duration: integer('duration')
});
export const membereventTable = sqliteTable('memberevent', {
  timestamp: integer('timestamp').notNull(),
  createdAt: integer('createdAt').notNull(),
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  guildId: text('guildId').notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  roles: text('roles').notNull()
});
export const presenceeventTable = sqliteTable('presenceevent', {
  timestamp: integer('timestamp').notNull(),
  createdAt: integer('createdAt').notNull(),
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  guildId: text('guildId').notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  activity: text('activity'),
  activityType: integer('activityType')
});
export const reactioneventTable = sqliteTable('reactionevent', {
  timestamp: integer('timestamp').notNull(),
  createdAt: integer('createdAt').notNull(),
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  guildId: text('guildId').notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  channelId: text('channelId').notNull(),
  messageId: text('messageId').notNull(),
  userId: text('userId').notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  emojiId: text('emojiId'),
  emojiName: text('emojiName').notNull(),
  emojiAnimated: integer('emojiAnimated').notNull().default(0),
  action: text('action').notNull()
});