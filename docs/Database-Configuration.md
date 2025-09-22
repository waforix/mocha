# Database Configuration

@waforix/mocha supports multiple database systems: SQLite, PostgreSQL, and MySQL. This guide covers setup, configuration, and optimization for each database type.

## Overview

The database system handles:
- Event storage (messages, voice, reactions, etc.)
- User and guild statistics
- Configuration data
- Analytics and metrics
- Automatic migrations

## SQLite Configuration

SQLite is perfect for development and small to medium deployments.

### Basic Setup

```typescript
import { Client } from '@waforix/mocha';

const client = new Client({
  token: process.env.DISCORD_TOKEN!,
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  }
});
```

### Advanced SQLite Options

```typescript
database: {
  type: 'sqlite',
  path: './data/stats.db',
  // Optional SQLite-specific options
  options: {
    busyTimeout: 30000,
    journal: 'WAL', // Write-Ahead Logging for better performance
    synchronous: 'NORMAL',
    cacheSize: 2000,
    tempStore: 'MEMORY'
  }
}
```

### SQLite Best Practices

- Use WAL mode for better concurrent access
- Place database file on fast storage (SSD)
- Regular VACUUM operations for maintenance
- Consider file-based backups

## PostgreSQL Configuration

PostgreSQL is recommended for production deployments with high load.

### Installation

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql postgresql-server postgresql-contrib

# macOS
brew install postgresql
```

### Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

-- Create database
CREATE DATABASE mocha_stats;

-- Create user
CREATE USER mocha_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mocha_stats TO mocha_user;

-- Exit
\q
```

### Basic Configuration

```typescript
database: {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'mocha_stats',
  username: 'mocha_user',
  password: 'secure_password'
}
```

### Advanced PostgreSQL Options

```typescript
database: {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'mocha_stats',
  username: process.env.DB_USER || 'mocha_user',
  password: process.env.DB_PASSWORD!,
  
  // SSL Configuration
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  
  // Connection Pool Settings
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000
  },
  
  // Additional options
  options: {
    connectTimeout: 60000,
    commandTimeout: 30000,
    requestTimeout: 30000
  }
}
```

### PostgreSQL Performance Tuning

```sql
-- Recommended postgresql.conf settings
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

## MySQL Configuration

MySQL is supported for organizations already using MySQL infrastructure.

### Installation

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# CentOS/RHEL
sudo yum install mysql-server

# macOS
brew install mysql
```

### Database Setup

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE mocha_stats CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'mocha_user'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON mocha_stats.* TO 'mocha_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

### Basic Configuration

```typescript
database: {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'mocha_stats',
  username: 'mocha_user',
  password: 'secure_password'
}
```

### Advanced MySQL Options

```typescript
database: {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'mocha_stats',
  username: process.env.DB_USER || 'mocha_user',
  password: process.env.DB_PASSWORD!,
  
  // SSL Configuration
  ssl: process.env.NODE_ENV === 'production' ? {
    ca: process.env.DB_SSL_CA,
    cert: process.env.DB_SSL_CERT,
    key: process.env.DB_SSL_KEY
  } : undefined,
  
  // Connection Pool Settings
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000
  },
  
  // MySQL-specific options
  options: {
    charset: 'utf8mb4',
    timezone: 'Z',
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
  }
}
```

## Environment-Based Configuration

Use environment variables for different environments:

```typescript
// .env file
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mocha_stats
DB_USER=mocha_user
DB_PASSWORD=secure_password
DB_SSL=true

// Configuration
database: {
  type: process.env.DB_TYPE as 'sqlite' | 'postgres' | 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME!,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  path: process.env.DB_PATH, // For SQLite
  ssl: process.env.DB_SSL === 'true'
}
```

## Migrations

@waforix/mocha automatically handles database migrations:

```typescript
const client = new Client({
  token: process.env.DISCORD_TOKEN!,
  database: {
    type: 'postgres',
    // ... connection details
  }
});

// Migrations run automatically on client initialization
await client.connect();
```

### Manual Migration Control

```typescript
// Get database instance for advanced operations
const db = await client.getDatabase();

// Migrations are handled automatically by the client
// For manual database operations, use the database instance directly
```

## Backup and Maintenance

### SQLite Backup

```bash
# Simple file copy (when database is not in use)
cp ./data/stats.db ./backups/stats-$(date +%Y%m%d).db

# Online backup using SQLite command
sqlite3 ./data/stats.db ".backup ./backups/stats-$(date +%Y%m%d).db"
```

### PostgreSQL Backup

```bash
# Full database backup
pg_dump -h localhost -U mocha_user mocha_stats > backup-$(date +%Y%m%d).sql

# Compressed backup
pg_dump -h localhost -U mocha_user mocha_stats | gzip > backup-$(date +%Y%m%d).sql.gz

# Restore
psql -h localhost -U mocha_user mocha_stats < backup.sql
```

### MySQL Backup

```bash
# Full database backup
mysqldump -h localhost -u mocha_user -p mocha_stats > backup-$(date +%Y%m%d).sql

# Compressed backup
mysqldump -h localhost -u mocha_user -p mocha_stats | gzip > backup-$(date +%Y%m%d).sql.gz

# Restore
mysql -h localhost -u mocha_user -p mocha_stats < backup.sql
```

## Performance Monitoring

### Database Statistics

```typescript
// Get database statistics
const stats = await client.getDatabaseStats();

console.log('Database Statistics:', {
  totalEvents: stats.totalEvents,
  totalUsers: stats.totalUsers,
  totalGuilds: stats.totalGuilds,
  databaseSize: stats.databaseSize,
  lastOptimized: stats.lastOptimized
});
```

### Query Performance

```typescript
// Enable query logging (development only)
const client = new Client({
  database: {
    // ... connection details
    options: {
      logging: process.env.NODE_ENV === 'development'
    }
  }
});
```

## Troubleshooting

### Common Issues

**Connection Timeout:**
```typescript
database: {
  // ... other options
  options: {
    connectTimeout: 60000,
    acquireTimeout: 60000
  }
}
```

**Too Many Connections:**
```typescript
database: {
  // ... other options
  pool: {
    min: 1,
    max: 5 // Reduce max connections
  }
}
```

**SSL Certificate Issues:**
```typescript
database: {
  // ... other options
  ssl: {
    rejectUnauthorized: false // Only for development
  }
}
```

### Health Checks

```typescript
// Check database connectivity
async function checkDatabaseHealth() {
  try {
    const db = await client.getDatabase();
    await db.select().from('users').limit(1);
    console.log('Database connection: OK');
    return true;
  } catch (error) {
    console.error('Database connection: FAILED', error);
    return false;
  }
}

// Run health check periodically
setInterval(checkDatabaseHealth, 60000); // Every minute
```

## Best Practices

1. **Use Environment Variables** - Never hardcode credentials
2. **Enable SSL in Production** - Encrypt database connections
3. **Configure Connection Pooling** - Optimize connection usage
4. **Regular Backups** - Implement automated backup strategies
5. **Monitor Performance** - Track query performance and database size
6. **Use Appropriate Database** - SQLite for development, PostgreSQL/MySQL for production
7. **Keep Updated** - Regularly update database software
8. **Security** - Use strong passwords and limit access

For more information on client configuration, see [Client Configuration](https://github.com/waforix/mocha/wiki/Client-Configuration).
