# Client Configuration

The `Client` class is the main entry point for @waforix/mocha. This guide covers all configuration options and how to use them effectively.

## Basic Configuration

```typescript
import { Client } from '@waforix/mocha';

const client = new Client({
  token: 'your-discord-bot-token',
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  }
});
```

## Configuration Options

### Required Options

#### `token: string`

Your Discord bot token. Keep this secure and never commit it to version control.

```typescript
const client = new Client({
  token: process.env.DISCORD_TOKEN!,
  // ... other options
});
```

### Database Configuration

#### `database: DatabaseConfig`

Database configuration object. See [Database Configuration](https://github.com/waforix/mocha/wiki/Database-Configuration) for detailed options.

```typescript
// SQLite
database: {
  type: 'sqlite',
  path: './data/stats.db'
}

// PostgreSQL
database: {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'mocha_stats',
  username: 'user',
  password: 'password'
}

// MySQL
database: {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'mocha_stats',
  username: 'user',
  password: 'password'
}
```

### Optional Configuration

#### `cache?: CacheConfig`

Configure caching behavior for improved performance.

```typescript
cache: {
  strategy: 'lru',
  maxSize: 1000,
  ttl: 300000, // 5 minutes in milliseconds
  enableHeatmap: true
}
```

**Cache Options:**

- `strategy`: Cache strategy (`'lru'` or `'memory'`)
- `maxSize`: Maximum number of cached items
- `ttl`: Time to live in milliseconds
- `enableHeatmap`: Enable heatmap generation for analytics

#### `enableMetrics?: boolean`

Enable metrics collection for performance monitoring.

```typescript
enableMetrics: true
```

#### `enableNotifications?: boolean`

Enable the notification system for alerts and events.

```typescript
enableNotifications: true
```

#### `enableRateLimit?: boolean`

Enable rate limiting to prevent API abuse.

```typescript
enableRateLimit: true
```

#### `intents?: number[]`

Discord gateway intents. If not specified, default intents will be used.

```typescript
import { INTENTS } from '@waforix/mocha';

intents: [
  INTENTS.GUILDS,
  INTENTS.GUILD_MESSAGES,
  INTENTS.GUILD_VOICE_STATES,
  INTENTS.GUILD_MESSAGE_REACTIONS
]
```

#### `shards?: number | number[] | 'auto'`

Sharding configuration for large bots.

```typescript
// Auto-sharding
shards: 'auto'

// Specific shard count
shards: 4

// Specific shard IDs
shards: [0, 1, 2, 3]
```

## Complete Configuration Example

```typescript
import { Client, INTENTS } from '@waforix/mocha';

const client = new Client({
  // Required
  token: process.env.DISCORD_TOKEN!,
  
  // Database
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'mocha_stats',
    username: process.env.DB_USER || 'mocha_user',
    password: process.env.DB_PASSWORD!,
    ssl: process.env.NODE_ENV === 'production'
  },
  
  // Cache configuration
  cache: {
    strategy: 'lru',
    maxSize: 5000,
    ttl: 600000, // 10 minutes
    enableHeatmap: true
  },
  
  // Feature flags
  enableMetrics: true,
  enableNotifications: true,
  enableRateLimit: true,
  
  // Discord configuration
  intents: [
    INTENTS.GUILDS,
    INTENTS.GUILD_MESSAGES,
    INTENTS.GUILD_VOICE_STATES,
    INTENTS.GUILD_MESSAGE_REACTIONS,
    INTENTS.GUILD_MEMBERS
  ],
  
  // Sharding for large bots
  shards: 'auto'
});
```

## Client Methods

### Connection Management

#### `connect(): Promise<void>`

Connect to Discord and initialize all systems.

```typescript
await client.connect();
```

#### `disconnect(): Promise<void>`

Gracefully disconnect from Discord.

```typescript
await client.disconnect();
```

### Manager Access

#### `getAutocompleteManager(): AutocompleteManager`

Get the autocomplete manager for registering autocomplete handlers.

```typescript
const autocomplete = client.getAutocompleteManager();
autocomplete.register('command', 'option', handler);
```

#### `getCommandHandlerManager(): CommandHandlerManager`

Get the command handler manager for registering command handlers.

```typescript
const commands = client.getCommandHandlerManager();
commands.register('command', handler);
```

#### `getDatabase(): Promise<DatabaseInstance>`

Get direct database access (advanced usage).

```typescript
const db = await client.getDatabase();
```

### Statistics Methods

#### `getUserStats(guildId: string, userId: string, days?: number): Promise<UserStats>`

Get statistics for a specific user.

```typescript
const stats = await client.getUserStats('guild123', 'user456', 30);
console.log(`Messages: ${stats.messageCount}`);
```

#### `getGuildStats(guildId: string, days?: number): Promise<GuildStats>`

Get statistics for a guild.

```typescript
const stats = await client.getGuildStats('guild123', 7);
console.log(`Total messages: ${stats.totalMessages}`);
```

#### `getLeaderboard(guildId: string, type: 'messages' | 'voice', limit?: number, days?: number): Promise<LeaderboardEntry[]>`

Get leaderboard data for a guild.

```typescript
const leaderboard = await client.getLeaderboard('guild123', 'messages', 10, 30);
console.log(`Top user: ${leaderboard[0].username}`);
```

#### `getActivityHeatmap(guildId: string, userId?: string, days?: number): Promise<HeatmapData>`

Get activity heatmap data.

```typescript
const heatmap = await client.getActivityHeatmap('guild123', 'user456', 7);
console.log(`Peak activity: ${heatmap.peakHour}`);
```

### Data Export

#### `exportData(options: ExportOptions): Promise<ExportData>`

Export data in various formats.

```typescript
const data = await client.exportData({
  format: 'json',
  guildId: 'guild123',
  dateRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31')
  },
  includeUsers: true,
  includeMessages: true
});
```

## Events

The Client extends EventEmitter and emits various events:

```typescript
client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('error', (error) => {
  console.error('Client error:', error);
});

client.on('guildCreate', (guild) => {
  console.log(`Joined guild: ${guild.name}`);
});

client.on('messageCreate', (message) => {
  // Message tracking is automatic
});
```

## Environment-Based Configuration

Use environment variables for different deployment environments:

```typescript
const client = new Client({
  token: process.env.DISCORD_TOKEN!,
  database: {
    type: process.env.DB_TYPE as 'sqlite' | 'postgres' | 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME!,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    path: process.env.DB_PATH // For SQLite
  },
  enableMetrics: process.env.NODE_ENV === 'production',
  enableRateLimit: process.env.NODE_ENV === 'production',
  cache: {
    strategy: 'lru',
    maxSize: parseInt(process.env.CACHE_SIZE || '1000'),
    ttl: parseInt(process.env.CACHE_TTL || '300000')
  }
});
```

## Best Practices

1. **Use Environment Variables** - Never hardcode sensitive information
2. **Enable Features Gradually** - Start with basic features and add more as needed
3. **Monitor Performance** - Use metrics in production
4. **Handle Errors** - Always add error event listeners
5. **Graceful Shutdown** - Properly disconnect on process termination

```typescript
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await client.disconnect();
  process.exit(0);
});
```

For more advanced configuration options, see the [API Reference](https://github.com/waforix/mocha/wiki/API-Reference).
