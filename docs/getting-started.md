# Getting Started

This guide will help you get up and running with Mocha quickly.

## Prerequisites

- **Node.js 18+** or **Bun 1.0+**
- **Discord Bot Token** - [Create a bot](https://discord.com/developers/applications)
- **Discord Bot Permissions** - `Read Messages`, `View Channels`, `Connect` (for voice tracking)

## Installation

We are not published to a package platform yet, so you will need to clone the repository and build from source.

## Basic Setup

### 1. Create Your Bot

```typescript
import { StatsClient, INTENTS } from 'mocha';

const client = new StatsClient({
  token: 'your-bot-token',
  intents: INTENTS.GUILDS | INTENTS.GUILD_MESSAGES | INTENTS.GUILD_VOICE_STATES,
  dbPath: './data/stats.db'
});

// Connect to Discord
await client.connect();

console.log('✅ Stats bot is online!');
```

### 2. Environment Variables

Create a `.env` file:

```env
DISCORD_TOKEN=your_bot_token_here
GUILD_ID=your_guild_id_here
DB_PATH=./data/stats.db
```

### 3. Basic Usage

```typescript
// Get user statistics
const userStats = await client.getUserStats('guild-id', 'user-id', 30);
console.log(`Messages: ${userStats.messageCount}`);

// Get guild statistics
const guildStats = await client.getGuildStats('guild-id', 30);
console.log(`Total messages: ${guildStats.totalMessages}`);

// Get leaderboards
const leaderboard = await client.getLeaderboard('guild-id', 'messages', 10, 30);
console.log('Top users:', leaderboard);
```

## Configuration Options

### Basic Configuration

```typescript
const client = new StatsClient({
  token: process.env.DISCORD_TOKEN!,
  intents: INTENTS.GUILDS | INTENTS.GUILD_MESSAGES | INTENTS.GUILD_VOICE_STATES,
  dbPath: './data/stats.db',
  maxReconnects: 5
});
```

### Advanced Configuration

```typescript
const client = new StatsClient({
  token: process.env.DISCORD_TOKEN!,
  intents: INTENTS.GUILDS | INTENTS.GUILD_MESSAGES | INTENTS.GUILD_VOICE_STATES,
  dbPath: './data/stats.db',
  maxReconnects: 10,
  cache: {
    userStatsSize: 2000,      // Cache 2000 user entries
    guildStatsSize: 100,      // Cache 100 guild entries
    leaderboardSize: 500,     // Cache 500 leaderboard entries
    ttlMs: 600000,           // 10 minute cache TTL
  }
});
```

## Discord Bot Setup

### 1. Create Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give your bot a name
4. Go to "Bot" section
5. Click "Add Bot"
6. Copy the token

### 2. Bot Permissions

Required permissions:
- `View Channels` (1024)
- `Read Message History` (65536)
- `Connect` (1048576) - for voice tracking

Permission integer: `1114112`

### 3. Invite Bot

Use this URL format:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=1114112&scope=bot
```

## Database Initialization

The library automatically creates and manages the SQLite database. On first run:

1. Database file is created at the specified path
2. Tables are automatically created with proper indexes
3. WAL mode is enabled for better performance

## Event Handling

```typescript
client.on('eventProcessed', (event, data) => {
  console.log(`✅ Processed ${event}`);
});

client.on('processingError', (error, event, data) => {
  console.error(`❌ Error processing ${event}:`, error);
});

client.on('gatewayError', (error) => {
  console.error('🔌 Gateway error:', error);
});
```

## Next Steps

- Read the [API Reference](./api-reference.md) for detailed method documentation
- Check out [Usage Examples](./examples.md) for more complex implementations
- Learn about [Performance Optimization](./performance.md) for production use
- Explore the [Architecture](./architecture.md) to understand how it works

## Common Issues

### Bot Not Receiving Events

1. Check bot permissions in Discord server
2. Verify intents are correctly set
3. Ensure bot is online and connected

### Database Errors

1. Check file permissions for database directory
2. Ensure sufficient disk space
3. Verify SQLite is available

### Memory Issues

1. Adjust cache sizes in configuration
2. Monitor cache statistics with `getCacheStats()`
3. Clear cache periodically with `clearCache()`

For more troubleshooting, see [Troubleshooting Guide](./troubleshooting.md).
