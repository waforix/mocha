import { boolean, int, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const guildTable = mysqlTable('guild', {
  id: varchar('id', { length: 255 }).primaryKey(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 255 }),
  ownerId: varchar('ownerId', { length: 255 })
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  memberCount: int('memberCount'),
});
export const channelTable = mysqlTable('channel', {
  id: varchar('id', { length: 255 }).primaryKey(),
  guildId: varchar('guildId', { length: 255 })
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }),
  type: int('type').notNull(),
  parentId: varchar('parentId', { length: 255 }),
  createdAt: timestamp('createdAt').notNull(),
});
export const userTable = mysqlTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  username: varchar('username', { length: 255 }).notNull(),
  discriminator: varchar('discriminator', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 255 }),
  bot: boolean('bot').notNull().default(false),
});
export const memberTable = mysqlTable('member', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guildId: varchar('guildId', { length: 255 })
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  nick: varchar('nick', { length: 255 }),
  joinedAt: timestamp('joinedAt').notNull(),
  leftAt: timestamp('leftAt'),
  roles: text('roles').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});
export const messageeventTable = mysqlTable('messageevent', {
  timestamp: timestamp('timestamp').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  id: varchar('id', { length: 255 }).primaryKey(),
  guildId: varchar('guildId', { length: 255 })
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  channelId: varchar('channelId', { length: 255 }).notNull(),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  content: varchar('content', { length: 255 }).notNull(),
  attachmentCount: int('attachmentCount').notNull().default(0),
  embedCount: int('embedCount').notNull().default(0),
});
export const voiceeventTable = mysqlTable('voiceevent', {
  timestamp: timestamp('timestamp').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guildId: varchar('guildId', { length: 255 })
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  channelId: varchar('channelId', { length: 255 }),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 255 }).notNull(),
  duration: int('duration'),
});
export const membereventTable = mysqlTable('memberevent', {
  timestamp: timestamp('timestamp').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guildId: varchar('guildId', { length: 255 })
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 255 }).notNull(),
  roles: text('roles').notNull(),
});
export const presenceeventTable = mysqlTable('presenceevent', {
  timestamp: timestamp('timestamp').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guildId: varchar('guildId', { length: 255 })
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 255 }).notNull(),
  activity: varchar('activity', { length: 255 }),
  activityType: int('activityType'),
});
export const reactioneventTable = mysqlTable('reactionevent', {
  timestamp: timestamp('timestamp').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guildId: varchar('guildId', { length: 255 })
    .notNull()
    .references(() => guildTable.id, { onDelete: 'cascade' }),
  channelId: varchar('channelId', { length: 255 }).notNull(),
  messageId: varchar('messageId', { length: 255 }).notNull(),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  emojiId: varchar('emojiId', { length: 255 }),
  emojiName: varchar('emojiName', { length: 255 }).notNull(),
  emojiAnimated: boolean('emojiAnimated').notNull().default(false),
  action: varchar('action', { length: 255 }).notNull(),
});
