# API Reference

Complete API documentation for Mocha.

## StatsClient

The main client class that provides all functionality for Discord statistics tracking.

### Constructor

```typescript
new StatsClient(options: StatsClientOptions)
```

#### StatsClientOptions

```typescript
interface StatsClientOptions extends GatewayOptions {
  dbPath?: string;         // SQLite database path (default: './data/stats.db')
  cache?: CacheConfig;     // Cache configuration
}

interface GatewayOptions {
  token: string;           // Discord bot token
  intents?: number;        // Discord gateway intents
  maxReconnects?: number;  // Max reconnection attempts (default: 5)
}

interface CacheConfig {
  userStatsSize?: number;    // User stats cache size (default: 1000)
  guildStatsSize?: number;   // Guild stats cache size (default: 100)
  leaderboardSize?: number;  // Leaderboard cache size (default: 500)
  ttlMs?: number;           // Cache TTL in milliseconds (default: 300000)
}
```

### Connection Methods

#### connect()

Connects to the Discord Gateway and starts event processing.

```typescript
await client.connect(): Promise<void>
```

**Example:**
```typescript
await client.connect();
console.log('Connected to Discord!');
```

#### disconnect()

Disconnects from the Discord Gateway.

```typescript
client.disconnect(): void
```

### Statistics Methods

#### getUserStats()

Get statistics for a specific user in a guild.

```typescript
await client.getUserStats(
  guildId: string,
  userId: string,
  days?: number = 30
): Promise<UserStats>
```

**Parameters:**
- `guildId` - Discord guild ID
- `userId` - Discord user ID
- `days` - Number of days to look back (default: 30)

**Returns:** `UserStats` object

**Example:**
```typescript
const stats = await client.getUserStats('123456789', '987654321', 7);
console.log(`Messages: ${stats.messageCount}, Voice: ${stats.voiceTime}ms`);
```

#### getGuildStats()

Get overall statistics for a guild.

```typescript
await client.getGuildStats(
  guildId: string,
  days?: number = 30
): Promise<GuildStats>
```

**Parameters:**
- `guildId` - Discord guild ID
- `days` - Number of days to look back (default: 30)

**Returns:** `GuildStats` object

#### getLeaderboard()

Get leaderboard for a specific metric.

```typescript
await client.getLeaderboard(
  guildId: string,
  type: 'messages' | 'voice',
  limit?: number = 10,
  days?: number = 30
): Promise<UserStats[]>
```

**Parameters:**
- `guildId` - Discord guild ID
- `type` - Leaderboard type ('messages' or 'voice')
- `limit` - Number of results to return (default: 10)
- `days` - Number of days to look back (default: 30)

**Returns:** Array of `UserStats` objects with rank information

#### getActivityHeatmap()

Get activity heatmap data for visualization.

```typescript
await client.getActivityHeatmap(
  guildId: string,
  userId?: string,
  days?: number = 7
): Promise<HeatmapData[]>
```

**Parameters:**
- `guildId` - Discord guild ID
- `userId` - Optional user ID for user-specific heatmap
- `days` - Number of days to include (default: 7)

**Returns:** Array of heatmap data points

### Cache Methods

#### getCacheStats()

Get current cache statistics and performance metrics.

```typescript
client.getCacheStats(): CacheStats
```

**Returns:** `CacheStats` object with cache utilization information

#### clearCache()

Clear all cached data.

```typescript
client.clearCache(): void
```

### Database Access

#### getDatabase()

Get direct access to the Drizzle database instance.

```typescript
client.getDatabase(): ReturnType<typeof getDb>
```

**Returns:** Drizzle database instance for advanced queries

## Data Types

### UserStats

```typescript
interface UserStats {
  userId: string;
  username?: string;
  messageCount: number;
  voiceTime: number;        // in milliseconds
  voiceSessions: number;
  attachments: number;
  embeds: number;
  rank?: number;           // Only present in leaderboard results
}
```

### GuildStats

```typescript
interface GuildStats {
  guildId: string;
  totalMessages: number;
  totalVoiceTime: number;   // in milliseconds
  activeUsers: number;
  topChannels: Array<{
    channelId: string;
    name?: string;
    messageCount: number;
    uniqueUsers: number;
  }>;
  memberGrowth: {
    joins: Array<{ date: string; joins: number }>;
    leaves: Array<{ date: string; leaves: number }>;
  };
}
```

### HeatmapData

```typescript
interface HeatmapData {
  hour: number;            // 0-23
  day: number;             // 0-6 (Sunday-Saturday)
  activity: number;        // Activity count
  date: string;           // ISO date string
}
```

### CacheStats

```typescript
interface CacheStats {
  userStats: number;       // Number of cached user stats
  guildStats: number;      // Number of cached guild stats
  leaderboards: number;    // Number of cached leaderboards
  queries: number;         // Number of cached query results
}
```

## Events

The StatsClient extends EventEmitter and emits the following events:

### eventProcessed

Emitted when a Discord event is successfully processed.

```typescript
client.on('eventProcessed', (eventType: string, data: any) => {
  console.log(`Processed ${eventType}`);
});
```

### processingError

Emitted when an error occurs while processing an event.

```typescript
client.on('processingError', (error: Error, eventType: string, data: any) => {
  console.error(`Error processing ${eventType}:`, error);
});
```

### gatewayError

Emitted when a Discord Gateway error occurs.

```typescript
client.on('gatewayError', (error: Error) => {
  console.error('Gateway error:', error);
});
```

## Constants

### INTENTS

Pre-defined intent combinations for common use cases.

```typescript
export const INTENTS = {
  GUILDS: 1 << 0,
  GUILD_MEMBERS: 1 << 1,
  GUILD_MESSAGES: 1 << 9,
  GUILD_VOICE_STATES: 1 << 7,
  GUILD_PRESENCES: 1 << 8,
  
  // Common combinations
  BASIC: (1 << 0) | (1 << 9) | (1 << 7),  // Guilds + Messages + Voice
  ALL: (1 << 0) | (1 << 1) | (1 << 9) | (1 << 7) | (1 << 8)  // All supported
};
```

## Error Handling

All async methods can throw errors. Always wrap in try-catch blocks:

```typescript
try {
  const stats = await client.getUserStats('guildId', 'userId');
  console.log(stats);
} catch (error) {
  console.error('Failed to get user stats:', error);
}
```

Common error types:
- **Database errors** - SQLite connection or query issues
- **Gateway errors** - Discord API connection problems
- **Validation errors** - Invalid parameters or missing data
