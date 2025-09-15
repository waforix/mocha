# Waforix Documentation

Welcome to the comprehensive documentation for Waforix, a powerful Discord bot statistics library with dual database support.

## 📚 Documentation Index

### Getting Started
- **[README](https://github.com/waforix/mocha/blob/main/README.md)** - Quick start guide and overview
- **[Getting Started Guide](https://github.com/waforix/mocha/wiki/Getting-Started)** - Installation and basic setup
- **[Quick Examples](https://github.com/waforix/mocha/wiki/Quick-Examples)** - Simple examples to get you started

### Core Documentation
- **[Database Configuration](https://github.com/waforix/mocha/wiki/Database-Configuration)** - SQLite and PostgreSQL setup and optimization
- **[Event Tracking](https://github.com/waforix/mocha/wiki/Event-Tracking)** - Comprehensive guide to tracking Discord events
- **[Analytics & Insights](https://github.com/waforix/mocha/wiki/Analytics-&-Insights)** - Advanced analytics and reporting features
- **[Data Export](https://github.com/waforix/mocha/wiki/Data-Export)** - Export data for backup, analysis, and compliance
- **[Performance Optimization](https://github.com/waforix/mocha/wiki/Performance-Optomization)** - Best practices for production deployments
- **[API Reference](https://github.com/waforix/mocha/wiki/API-Reference)** - Complete API documentation

### Advanced Topics
- **[Migration Guide](https://github.com/waforix/mocha/wiki/Migration-Guide)** - Upgrading from older versions
- **[Production Deployment](https://github.com/waforix/mocha/wiki/Production-Deployment)** - Production-ready configurations
- **[Troubleshooting](https://github.com/waforix/mocha/wiki/Troubleshooting)** - Common issues and solutions
- **[Contributing](https://github.com/waforix/mocha/wiki/Contributing)** - How to contribute to the project

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ or Bun
- TypeScript 5.0+
- SQLite 3.x or PostgreSQL 12+

### Package Installation
```bash
# Using Bun (recommended)
bun add waforix

# Using npm
npm install waforix

# Using yarn
yarn add waforix
```

### Database Setup

#### SQLite (Recommended for Development)
```typescript
import { StatsClient } from 'waforix';

const client = new StatsClient({
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  }
});

await client.initialize();
```

#### PostgreSQL (Recommended for Production)
```bash
# 1. Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# 2. Create database
sudo -u postgres createdb discord_stats

# 3. Create user
sudo -u postgres createuser --interactive stats_user
```

```typescript
import { StatsClient } from 'waforix';

const client = new StatsClient({
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'discord_stats',
    username: 'stats_user',
    password: 'your_password'
  }
});

await client.initialize();
```

## 📖 Basic Usage Examples

### Discord.js Integration
```typescript
import { Client, GatewayIntentBits } from 'discord.js';
import { StatsClient } from 'waforix';

// Initialize Discord client
const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ]
});

// Initialize Waforix
const stats = new StatsClient({
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  }
});

await stats.initialize();

// Track message events
discord.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  await stats.trackMessage({
    id: message.id,
    userId: message.author.id,
    guildId: message.guild?.id || '',
    channelId: message.channel.id,
    content: message.content,
    timestamp: message.createdTimestamp,
    attachmentCount: message.attachments.size,
    embedCount: message.embeds.length
  });
});

// Get server statistics
const serverStats = await stats.getServerStats('guild_id', 30);
console.log(`Total messages: ${serverStats.totalMessages}`);
console.log(`Active users: ${serverStats.activeUsers}`);
```

### Basic Analytics
```typescript
// Get user leaderboard
const leaderboard = await stats.getLeaderboard('guild_id', 'messages', {
  limit: 10,
  days: 30
});

leaderboard.forEach((user, index) => {
  console.log(`${index + 1}. ${user.username}: ${user.count} messages`);
});

// Get activity insights
const insights = await stats.getServerInsights('guild_id', {
  days: 30,
  includeHourlyActivity: true,
  includeGrowthTrend: true
});

console.log('Peak activity hour:', insights.hourlyActivity?.reduce((max, hour) => 
  hour.activity > max.activity ? hour : max
));
```

## 🔄 Migration Guide

See the complete [Migration Guide](https://github.com/waforix/mocha/wiki/Migration-Guide) for detailed instructions on upgrading between versions.

## 🏭 Production Deployment

See the complete [Production Deployment Guide](https://github.com/waforix/mocha/wiki/Production-Deployment) for Docker, environment variables, and scaling strategies.

## 🔧 Troubleshooting

See the complete [Troubleshooting Guide](https://github.com/waforix/mocha/wiki/Troubleshooting) for common issues, error codes, and solutions.

## 🤝 Contributing

See the complete [Contributing Guide](https://github.com/waforix/mocha/wiki/Contributing) for development setup, code style, and submission guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

## 🆘 Support

- **Documentation**: [GitHub Wiki](https://github.com/waforix/mocha/wiki)
- **Issues**: [GitHub Issues](https://github.com/waforix/mocha/issues)
- **Discussions**: [GitHub Discussions](https://github.com/waforix/mocha/discussions)
- **Discord**: [Community Server](https://discord.gg/your-invite)

## 📊 Project Status

- ✅ **Stable**: Core functionality is stable and production-ready
- ✅ **Active Development**: Regular updates and new features
- ✅ **Community Support**: Active community and maintainer support
- ✅ **Documentation**: Comprehensive documentation and examples

---

*Last updated: December 2023*
