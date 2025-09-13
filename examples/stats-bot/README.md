# Mocha Stats Bot Example

A complete Discord bot example using the Mocha statistics library.

## Features

- 📊 **User Statistics** - Personal message and voice activity stats
- 🏆 **Leaderboards** - Top users by messages or voice time
- 🏰 **Server Stats** - Guild-wide statistics and growth metrics
- ⚡ **Performance Monitoring** - Real-time metrics and cache management
- 🎯 **Admin Commands** - Cache control and performance insights

## Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your bot token and settings
nano .env
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Deploy Commands

```bash
# Deploy slash commands
bun run deploy

# Clean up guild commands (if needed)
bun run cleanup

# Clean up global commands (if needed)
bun run cleanup:global
```

### 4. Run the Bot

```bash
# Development mode (with hot reload)
bun run dev

# Production mode
bun run start
```

## Commands

### User Commands
- `!stats [days]` - Your personal statistics
- `!server [days]` - Server statistics  
- `!leaderboard [voice|messages] [limit] [days]` - Top users
- `!help` - Show all commands

### Admin Commands (Bot Owner Only)
- `!cache stats` - Cache statistics
- `!cache clear` - Clear all caches
- `!cache metrics` - Performance metrics

## Configuration

### Required Environment Variables

```env
DISCORD_TOKEN=your_bot_token_here
GUILD_ID=your_test_guild_id_here  # Optional - leave empty for all guilds
```

### Optional Configuration

```env
# Database
DB_PATH=./data/stats.db

# Bot Settings
BOT_PREFIX=!
OWNER_ID=your_user_id_here

# Cache Settings
CACHE_USER_STATS_SIZE=2000
CACHE_GUILD_STATS_SIZE=200
CACHE_TTL_MS=600000

# Features
ENABLE_METRICS=true
ENABLE_NOTIFICATIONS=false
ENABLE_RATE_LIMIT=true
```

## Bot Permissions

Your bot needs these Discord permissions:
- View Channels (1024)
- Send Messages (2048)
- Read Message History (65536)
- Connect (1048576)

**Permission Integer**: `1116672`

## Invite URL

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=1116672&scope=bot
```

## Architecture

```
examples/stats-bot/
├── bot.ts              # Main bot entry point
├── config.ts           # Configuration management
├── logger.ts           # Logging utility
├── commands/           # Command handlers
│   ├── index.ts       # Command router
│   ├── stats.ts       # User statistics
│   ├── leaderboard.ts # Leaderboards
│   ├── server.ts      # Server statistics
│   └── cache.ts       # Cache management
└── handlers/           # Event handlers
    ├── events.ts      # Event setup
    └── message.ts     # Message processing
```

## Development

### Code Quality

```bash
# Check code quality
bun run check

# Fix issues automatically
bun run check:fix

# Type checking
bun run type-check
```

### File Structure

- **Small files** - Each file under 50 lines when possible
- **Single responsibility** - One clear purpose per file
- **Modular design** - Easy to extend and maintain
- **Type safety** - Full TypeScript support

## Troubleshooting

### Bot Not Responding
1. Check bot token is correct
2. Verify bot has required permissions
3. Check console for error messages
4. Ensure bot is in the target guild

### Database Issues
1. Check DB_PATH directory exists
2. Verify write permissions
3. Check disk space

### Performance Issues
1. Monitor cache hit rates with `!cache stats`
2. Check memory usage with `!cache metrics`
3. Clear caches if needed with `!cache clear`

## Production Deployment

1. Set `NODE_ENV=production`
2. Use process manager (PM2, systemd)
3. Set up log rotation
4. Monitor performance metrics
5. Regular database backups

## License

MIT License - see main project for details.
