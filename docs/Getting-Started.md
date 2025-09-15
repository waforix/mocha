# Getting Started

Welcome to Waforix! This guide will help you get up and running with the Discord bot statistics library.

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
SQLite is perfect for getting started quickly with zero configuration required.

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

**Advantages of SQLite:**
- Zero configuration required
- Single file database
- Perfect for development and small servers
- Automatic schema creation

#### PostgreSQL (Recommended for Production)
PostgreSQL offers better performance and scalability for larger Discord servers.

**Step 1: Install PostgreSQL**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows - Download from https://www.postgresql.org/download/windows/
```

**Step 2: Create Database and User**
```bash
# Connect as postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE discord_stats;

# Create user
CREATE USER stats_user WITH PASSWORD 'your_secure_password';

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE discord_stats TO stats_user;

# Exit
\q
```

**Step 3: Configure Waforix**
```typescript
import { StatsClient } from 'waforix';

const client = new StatsClient({
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'discord_stats',
    username: 'stats_user',
    password: 'your_secure_password'
  }
});

await client.initialize();
```

**Advantages of PostgreSQL:**
- Better performance for large datasets
- Superior concurrent access
- Advanced query capabilities
- Horizontal scaling support

## 🔧 Basic Configuration

### Environment Variables (Recommended)
For security and flexibility, use environment variables:

```bash
# .env file
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=discord_stats
DB_USER=stats_user
DB_PASSWORD=your_secure_password
```

```typescript
import { StatsClient } from 'waforix';

const client = new StatsClient({
  database: {
    type: process.env.DB_TYPE as 'sqlite' | 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // For SQLite
    path: process.env.DB_PATH || './data/stats.db'
  }
});
```

### Optional Configuration
```typescript
const client = new StatsClient({
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  },
  // Optional: Enable caching for better performance
  cache: {
    size: 10000,        // Cache 10k items
    ttl: 300000         // 5 minute TTL
  },
  // Optional: Configure batch processing
  processing: {
    batchSize: 1000,    // Process 1000 events at once
    batchTimeout: 5000  // Flush batch every 5 seconds
  }
});
```

## 🎯 First Steps

### 1. Initialize the Client
```typescript
import { StatsClient } from 'waforix';

const stats = new StatsClient({
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  }
});

// Initialize the database connection
await stats.initialize();
console.log('Waforix initialized successfully!');
```

### 2. Track Your First Event
```typescript
// Track a message event
await stats.trackMessage({
  id: 'message_123',
  userId: 'user_456',
  guildId: 'guild_789',
  channelId: 'channel_101',
  content: 'Hello, world!',
  timestamp: Date.now(),
  attachmentCount: 0,
  embedCount: 0
});

console.log('Message tracked successfully!');
```

### 3. Get Your First Statistics
```typescript
// Get server statistics for the last 30 days
const stats = await client.getServerStats('guild_789', 30);

console.log(`Total messages: ${stats.totalMessages}`);
console.log(`Active users: ${stats.activeUsers}`);
console.log(`Total voice time: ${Math.round(stats.totalVoiceTime / 3600000)} hours`);
```

## 🔍 Verification

### Test Database Connection
```typescript
// Check if everything is working
const health = await client.healthCheck();

if (health.database === 'healthy') {
  console.log('✅ Database connection is healthy');
} else {
  console.error('❌ Database connection issues:', health);
}
```

### Test Data Insertion
```typescript
// Insert test data and verify
await stats.trackMessage({
  id: 'test_message',
  userId: 'test_user',
  guildId: 'test_guild',
  channelId: 'test_channel',
  content: 'Test message',
  timestamp: Date.now(),
  attachmentCount: 0,
  embedCount: 0
});

// Verify the data was inserted
const testStats = await stats.getServerStats('test_guild', 1);
console.log('Test message count:', testStats.totalMessages);
```

## 🚨 Common Setup Issues

### SQLite Issues
**Problem**: `SQLITE_CANTOPEN: unable to open database file`
**Solution**: Ensure the directory exists and has write permissions
```bash
mkdir -p ./data
chmod 755 ./data
```

**Problem**: `database is locked`
**Solution**: Ensure no other processes are accessing the database file

### PostgreSQL Issues
**Problem**: `connection refused`
**Solution**: Check if PostgreSQL is running
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql  # if not running
```

**Problem**: `authentication failed`
**Solution**: Verify username and password
```bash
# Test connection manually
psql -h localhost -U stats_user -d discord_stats
```

**Problem**: `database does not exist`
**Solution**: Create the database
```bash
sudo -u postgres createdb discord_stats
```

## 📚 Next Steps

Once you have Waforix set up and running:

1. **[Quick Examples](https://github.com/waforix/mocha/wiki/Quick-Examples)** - See practical usage examples
2. **[Event Tracking](https://github.com/waforix/mocha/wiki/Event-Tracking)** - Learn about tracking different Discord events
3. **[Database Configuration](https://github.com/waforix/mocha/wiki/Database-Configuration)** - Advanced database setup and optimization
4. **[Analytics & Insights](https://github.com/waforix/mocha/wiki/Analytics-&-Insights)** - Explore analytics capabilities

## 💡 Tips for Success

- **Start with SQLite** for development and testing
- **Use environment variables** for sensitive configuration
- **Enable debug logging** during setup: `debug: true` in client options
- **Test with small datasets** before processing large amounts of data
- **Monitor performance** as your data grows

## 🆘 Need Help?

If you run into issues:
- Check the [Troubleshooting Guide](https://github.com/waforix/mocha/wiki/Troubleshooting)
- Open an [Issue](https://github.com/waforix/mocha/issues) on GitHub
- Join our [Discord Community](https://discord.gg/your-invite) for real-time help

---

**Ready to start tracking?** Head over to [Quick Examples](https://github.com/waforix/mocha/wiki/Quick-Examples) to see Waforix in action!
