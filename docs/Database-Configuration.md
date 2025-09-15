# Database Configuration

Waforix supports both SQLite and PostgreSQL databases, allowing you to choose the best option for your use case.

## Overview

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| **Setup Complexity** | Zero config | Requires server setup |
| **Performance** | Good for small-medium servers | Excellent for large servers |
| **Concurrent Users** | Limited | High concurrency |
| **Storage** | Single file | Server-based |
| **Backup** | Copy file | Database dumps |
| **Scaling** | Vertical only | Horizontal + Vertical |

## SQLite Configuration

### Basic Setup
```typescript
import { StatsClient } from 'waforix';

const client = new StatsClient({
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  }
});
```

### Advanced SQLite Options
```typescript
const client = new StatsClient({
  database: {
    type: 'sqlite',
    path: './data/stats.db',
    // Optional: Custom SQLite options
    options: {
      timeout: 5000,
      verbose: console.log // Enable query logging
    }
  }
});
```

### SQLite Best Practices
- **File Location**: Store database files outside your application directory
- **Backups**: Regularly copy the `.db` file to backup location
- **Permissions**: Ensure proper file system permissions
- **WAL Mode**: Enabled by default for better concurrent access

## PostgreSQL Configuration

### Basic Setup
```typescript
import { StatsClient } from 'waforix';

const client = new StatsClient({
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'discord_stats',
    username: 'stats_user',
    password: 'secure_password'
  }
});
```

### Advanced PostgreSQL Options
```typescript
const client = new StatsClient({
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'discord_stats',
    username: 'stats_user',
    password: 'secure_password',
    // Connection pool settings
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    },
    // SSL configuration
    ssl: {
      rejectUnauthorized: false
    }
  }
});
```

### Environment Variables
For production deployments, use environment variables:

```typescript
const client = new StatsClient({
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'discord_stats',
    username: process.env.DB_USER || 'stats_user',
    password: process.env.DB_PASSWORD || 'password'
  }
});
```

### PostgreSQL Setup Guide

#### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### 2. Create Database and User
```sql
-- Connect as postgres user
sudo -u postgres psql

-- Create database
CREATE DATABASE discord_stats;

-- Create user
CREATE USER stats_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE discord_stats TO stats_user;

-- Exit
\q
```

#### 3. Initialize Schema
```bash
# Run the initialization script
bun run db:init

# Or manually run migrations
bunx drizzle-kit push:pg --config=drizzle.postgres.config.ts
```

## Migration Between Databases

### SQLite to PostgreSQL
```typescript
import { StatsClient } from 'waforix';

// Export from SQLite
const sqliteClient = new StatsClient({
  database: { type: 'sqlite', path: './old-stats.db' }
});

const data = await sqliteClient.exportData('guild_id', {
  format: 'json',
  includeAll: true
});

// Import to PostgreSQL
const pgClient = new StatsClient({
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'discord_stats',
    username: 'stats_user',
    password: 'password'
  }
});

// Manual data import would be required
// (Automatic migration tools coming in future versions)
```

## Performance Optimization

### SQLite Optimizations
```typescript
const client = new StatsClient({
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  },
  cache: {
    size: 10000,        // Increase cache size
    ttl: 300000         // 5 minute TTL
  }
});
```

### PostgreSQL Optimizations
```typescript
const client = new StatsClient({
  database: {
    type: 'postgres',
    // ... connection details
    pool: {
      min: 5,             // Minimum connections
      max: 20,            // Maximum connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    }
  },
  cache: {
    size: 50000,        // Larger cache for PostgreSQL
    ttl: 600000         // 10 minute TTL
  }
});
```

## Troubleshooting

### Common SQLite Issues
- **Database locked**: Ensure no other processes are accessing the file
- **Permission denied**: Check file system permissions
- **Disk full**: Monitor available disk space

### Common PostgreSQL Issues
- **Connection refused**: Check if PostgreSQL service is running
- **Authentication failed**: Verify username/password
- **Too many connections**: Adjust `max_connections` in postgresql.conf

### Debug Mode
Enable debug logging to troubleshoot issues:

```typescript
const client = new StatsClient({
  database: {
    // ... your config
  },
  debug: true  // Enable debug logging
});
```

## Schema Management

Both database types use the same logical schema but with different implementations:

### Tables Created
- `users` - Discord user information
- `guilds` - Discord server information  
- `channels` - Channel information
- `message_events` - Message tracking data
- `voice_events` - Voice activity data
- `reaction_events` - Reaction tracking data
- `member_events` - Member join/leave events

### Automatic Migrations
Waforix automatically handles schema creation and updates. No manual migration is required when upgrading versions.
