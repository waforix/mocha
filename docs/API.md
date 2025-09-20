# Waforix API Documentation

## StatsClient

The main client for interacting with Discord statistics.

### Constructor

```typescript
new StatsClient(database: DatabaseInstance, options?: StatsClientOptions)
```

### Methods

#### getUserStats(guildId, userId, options?)

Get statistics for a specific user in a guild.

**Parameters:**
- `guildId: string` - Discord guild ID (snowflake)
- `userId: string` - Discord user ID (snowflake)
- `options?: { days?: number }` - Optional parameters (days: 1-365)

**Returns:** `Promise<UserStats>`

**Throws:** 
- `Error` - Invalid guild ID or user ID
- `Error` - Invalid days parameter

#### getGuildStats(guildId, options?)

Get statistics for an entire guild.

**Parameters:**
- `guildId: string` - Discord guild ID (snowflake)
- `options?: { days?: number }` - Optional parameters (days: 1-365)

**Returns:** `Promise<GuildStats>`

#### getLeaderboard(guildId, options?)

Get user leaderboard for a guild.

**Parameters:**
- `guildId: string` - Discord guild ID (snowflake)
- `options?: { limit?: number, type?: string }` - Optional parameters (limit: 1-100)

**Returns:** `Promise<LeaderboardEntry[]>`

#### getActivityHeatmap(guildId, options?)

Get activity heatmap data for a guild.

**Parameters:**
- `guildId: string` - Discord guild ID (snowflake)
- `options?: { days?: number }` - Optional parameters (days: 1-365)

**Returns:** `Promise<ActivityHeatmap>`

#### close()

Close the client and clean up resources.

**Returns:** `Promise<void>`

## DatabaseManager

Manages database connections and lifecycle.

### Methods

#### initialize(config)

Initialize database connection.

**Parameters:**
- `config: DatabaseConfig` - Database configuration

**Returns:** `Promise<DatabaseInstance>`

#### getInstance()

Get the current database instance.

**Returns:** `DatabaseInstance`

**Throws:** `Error` - Database not initialized

#### close()

Close database connection.

**Returns:** `Promise<void>`

## LRUCache

Least Recently Used cache with TTL support.

### Constructor

```typescript
new LRUCache<T>(maxSize: number, ttl: number)
```

### Methods

#### set(key, value)

Store a value in the cache.

#### get(key)

Retrieve a value from the cache.

#### clear()

Clear all cached items.

#### destroy()

Destroy the cache and clean up resources.

## Validation

Input validation utilities for Discord data.

### Functions

#### validateGuildId(guildId)

Validate Discord guild ID format.

#### validateUserId(userId)

Validate Discord user ID format.

#### validateLimit(limit, max?)

Validate numeric limit parameter.

#### validateTimeRange(start?, end?)

Validate time range parameters.
