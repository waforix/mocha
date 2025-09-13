# Database Schema

This document describes the database schema used by Mocha for storing Discord statistics.

## Overview

Mocha uses SQLite with Drizzle ORM for data persistence. The schema is designed for:

- **Performance** - Optimized indexes for common query patterns
- **Scalability** - Efficient storage and retrieval of large datasets
- **Flexibility** - Support for various statistics and analytics

## Database Configuration

### SQLite Settings

```sql
PRAGMA journal_mode = WAL;           -- Write-Ahead Logging for concurrency
PRAGMA synchronous = NORMAL;         -- Balance safety and performance
PRAGMA cache_size = 10000;          -- 40MB cache
PRAGMA temp_store = MEMORY;          -- Temporary data in memory
PRAGMA mmap_size = 268435456;       -- 256MB memory-mapped I/O
PRAGMA foreign_keys = ON;            -- Enable foreign key constraints
```

### File Structure

```
data/
├── stats.db          # Main database file
├── stats.db-wal      # Write-Ahead Log file
└── stats.db-shm      # Shared memory file
```

## Core Tables

### guilds

Stores Discord guild (server) information.

```typescript
export const guilds = sqliteTable('guilds', {
  id: text('id').primaryKey(),                    // Discord guild ID
  name: text('name'),                             // Guild name
  icon: text('icon'),                             // Guild icon hash
  memberCount: integer('member_count'),           // Total member count
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
```

**Indexes:**
- Primary key on `id`
- Index on `created_at` for temporal queries

### users

Stores Discord user information.

```typescript
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),                    // Discord user ID
  username: text('username'),                     // Current username
  discriminator: text('discriminator'),           // User discriminator
  avatar: text('avatar'),                         // Avatar hash
  bot: integer('bot', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
```

**Indexes:**
- Primary key on `id`
- Index on `bot` for filtering

### channels

Stores Discord channel information.

```typescript
export const channels = sqliteTable('channels', {
  id: text('id').primaryKey(),                    // Discord channel ID
  guildId: text('guild_id').notNull(),            // Parent guild ID
  name: text('name'),                             // Channel name
  type: integer('type').notNull(),                // Channel type (0=text, 2=voice, etc.)
  parentId: text('parent_id'),                    // Parent category ID
  position: integer('position'),                  // Channel position
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  guildIdIdx: index('idx_channels_guild_id').on(table.guildId),
}));
```

**Indexes:**
- Primary key on `id`
- Index on `guild_id` for guild-specific queries
- Index on `type` for channel type filtering

### members

Stores guild membership information.

```typescript
export const members = sqliteTable('members', {
  id: text('id').primaryKey(),                    // Composite: guild_id:user_id
  guildId: text('guild_id').notNull(),            // Guild ID
  userId: text('user_id').notNull(),              // User ID
  nickname: text('nickname'),                     // Guild nickname
  joinedAt: integer('joined_at', { mode: 'timestamp' }),
  premiumSince: integer('premium_since', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  guildIdIdx: index('idx_members_guild_id').on(table.guildId),
  userIdIdx: index('idx_members_user_id').on(table.userId),
  joinedAtIdx: index('idx_members_joined_at').on(table.joinedAt),
}));
```

**Indexes:**
- Primary key on `id` (composite)
- Index on `guild_id` for guild member queries
- Index on `user_id` for user membership queries
- Index on `joined_at` for member growth analysis

## Event Tables

### message_events

Stores message statistics and events.

```typescript
export const messageEvents = sqliteTable('message_events', {
  id: text('id').primaryKey(),                    // Message ID or generated ID
  guildId: text('guild_id').notNull(),            // Guild where message was sent
  channelId: text('channel_id').notNull(),        // Channel where message was sent
  userId: text('user_id').notNull(),              // Message author
  messageType: integer('message_type').default(0), // Message type
  hasAttachment: integer('has_attachment', { mode: 'boolean' }).default(false),
  hasEmbed: integer('has_embed', { mode: 'boolean' }).default(false),
  characterCount: integer('character_count').default(0),
  wordCount: integer('word_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  guildTimeIdx: index('idx_message_events_guild_time').on(table.guildId, table.createdAt),
  userTimeIdx: index('idx_message_events_user_time').on(table.userId, table.createdAt),
  channelTimeIdx: index('idx_message_events_channel_time').on(table.channelId, table.createdAt),
  guildUserIdx: index('idx_message_events_guild_user').on(table.guildId, table.userId),
}));
```

**Indexes:**
- Primary key on `id`
- Composite index on `guild_id, created_at` for guild statistics
- Composite index on `user_id, created_at` for user statistics
- Composite index on `channel_id, created_at` for channel statistics
- Composite index on `guild_id, user_id` for leaderboards

### voice_events

Stores voice activity events and sessions.

```typescript
export const voiceEvents = sqliteTable('voice_events', {
  id: text('id').primaryKey(),                    // Generated session ID
  guildId: text('guild_id').notNull(),            // Guild ID
  channelId: text('channel_id'),                  // Voice channel ID (null for disconnect)
  userId: text('user_id').notNull(),              // User ID
  eventType: text('event_type').notNull(),        // 'join', 'leave', 'move'
  sessionStart: integer('session_start', { mode: 'timestamp' }),
  sessionEnd: integer('session_end', { mode: 'timestamp' }),
  duration: integer('duration').default(0),       // Session duration in milliseconds
  muted: integer('muted', { mode: 'boolean' }).default(false),
  deafened: integer('deafened', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  guildTimeIdx: index('idx_voice_events_guild_time').on(table.guildId, table.createdAt),
  userTimeIdx: index('idx_voice_events_user_time').on(table.userId, table.createdAt),
  channelTimeIdx: index('idx_voice_events_channel_time').on(table.channelId, table.createdAt),
  sessionIdx: index('idx_voice_events_session').on(table.sessionStart, table.sessionEnd),
}));
```

**Indexes:**
- Primary key on `id`
- Composite index on `guild_id, created_at` for guild voice statistics
- Composite index on `user_id, created_at` for user voice statistics
- Composite index on `channel_id, created_at` for channel voice statistics
- Composite index on `session_start, session_end` for session analysis

### member_events

Stores member join/leave events for growth tracking.

```typescript
export const memberEvents = sqliteTable('member_events', {
  id: text('id').primaryKey(),                    // Generated event ID
  guildId: text('guild_id').notNull(),            // Guild ID
  userId: text('user_id').notNull(),              // User ID
  eventType: text('event_type').notNull(),        // 'join' or 'leave'
  memberCount: integer('member_count'),           // Guild member count at time of event
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  guildTimeIdx: index('idx_member_events_guild_time').on(table.guildId, table.createdAt),
  typeTimeIdx: index('idx_member_events_type_time').on(table.eventType, table.createdAt),
}));
```

**Indexes:**
- Primary key on `id`
- Composite index on `guild_id, created_at` for guild growth analysis
- Composite index on `event_type, created_at` for join/leave analysis

### presence_events

Stores user presence and activity updates.

```typescript
export const presenceEvents = sqliteTable('presence_events', {
  id: text('id').primaryKey(),                    // Generated event ID
  guildId: text('guild_id').notNull(),            // Guild ID
  userId: text('user_id').notNull(),              // User ID
  status: text('status'),                         // online, idle, dnd, offline
  activityType: integer('activity_type'),         // Activity type (0=playing, 1=streaming, etc.)
  activityName: text('activity_name'),            // Activity name
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  guildTimeIdx: index('idx_presence_events_guild_time').on(table.guildId, table.createdAt),
  userTimeIdx: index('idx_presence_events_user_time').on(table.userId, table.createdAt),
  statusIdx: index('idx_presence_events_status').on(table.status),
}));
```

**Indexes:**
- Primary key on `id`
- Composite index on `guild_id, created_at` for guild presence analysis
- Composite index on `user_id, created_at` for user presence tracking
- Index on `status` for status distribution analysis

## Relationships

### Foreign Key Constraints

```sql
-- Channels belong to guilds
ALTER TABLE channels ADD CONSTRAINT fk_channels_guild 
  FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE;

-- Members link users to guilds
ALTER TABLE members ADD CONSTRAINT fk_members_guild 
  FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE;
ALTER TABLE members ADD CONSTRAINT fk_members_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Events reference their respective entities
ALTER TABLE message_events ADD CONSTRAINT fk_message_events_guild 
  FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE;
ALTER TABLE message_events ADD CONSTRAINT fk_message_events_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE message_events ADD CONSTRAINT fk_message_events_channel 
  FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE;
```

## Query Patterns

### Common Queries

**User Statistics:**
```sql
SELECT 
  COUNT(*) as message_count,
  SUM(character_count) as total_characters,
  COUNT(CASE WHEN has_attachment = 1 THEN 1 END) as attachments
FROM message_events 
WHERE guild_id = ? AND user_id = ? AND created_at >= ?;
```

**Guild Leaderboard:**
```sql
SELECT 
  user_id,
  COUNT(*) as message_count,
  RANK() OVER (ORDER BY COUNT(*) DESC) as rank
FROM message_events 
WHERE guild_id = ? AND created_at >= ?
GROUP BY user_id 
ORDER BY message_count DESC 
LIMIT ?;
```

**Voice Activity:**
```sql
SELECT 
  user_id,
  SUM(duration) as total_voice_time,
  COUNT(*) as session_count
FROM voice_events 
WHERE guild_id = ? AND created_at >= ? AND event_type = 'leave'
GROUP BY user_id;
```

### Performance Considerations

**Index Usage:**
- Always include `guild_id` in WHERE clauses for guild-specific queries
- Use `created_at` ranges for time-based filtering
- Combine `guild_id` and `user_id` for user-specific queries within guilds

**Query Optimization:**
- Use LIMIT for large result sets
- Prefer COUNT(*) over COUNT(column) when possible
- Use appropriate date ranges to limit data scanned

## Maintenance

### Data Cleanup

Implement automatic cleanup for old data:

```sql
-- Clean up old events (older than 1 year)
DELETE FROM message_events WHERE created_at < datetime('now', '-1 year');
DELETE FROM voice_events WHERE created_at < datetime('now', '-1 year');
DELETE FROM member_events WHERE created_at < datetime('now', '-1 year');
DELETE FROM presence_events WHERE created_at < datetime('now', '-1 year');
```

### Database Maintenance

Regular maintenance tasks:

```sql
-- Analyze tables for query optimization
ANALYZE;

-- Rebuild indexes if needed
REINDEX;

-- Vacuum to reclaim space (use with caution in production)
VACUUM;
```

### Backup Strategy

Recommended backup approach:

```bash
# Create backup with WAL checkpoint
sqlite3 stats.db ".backup backup_$(date +%Y%m%d_%H%M%S).db"

# Or use file system backup (ensure WAL is checkpointed)
sqlite3 stats.db "PRAGMA wal_checkpoint(FULL);"
cp stats.db backup_$(date +%Y%m%d_%H%M%S).db
```
