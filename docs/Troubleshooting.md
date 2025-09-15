# Troubleshooting

Common issues and solutions when using Waforix.

## 🔧 Database Issues

### SQLite Problems

#### Database Locked Error
**Error**: `SQLITE_BUSY: database is locked`

**Causes**:
- Another process is accessing the database
- Previous connection wasn't properly closed
- File system permissions issue

**Solutions**:
```typescript
// Enable WAL mode for better concurrency
const client = new StatsClient({
  database: {
    type: 'sqlite',
    path: './stats.db',
    options: {
      pragma: {
        journal_mode: 'WAL',
        busy_timeout: 30000
      }
    }
  }
});
```

#### Cannot Open Database File
**Error**: `SQLITE_CANTOPEN: unable to open database file`

**Solutions**:
```bash
# Check directory exists and has permissions
mkdir -p ./data
chmod 755 ./data

# Check file permissions
chmod 644 ./data/stats.db
```

#### Disk Full Error
**Error**: `SQLITE_FULL: database or disk is full`

**Solutions**:
- Free up disk space
- Move database to larger partition
- Enable auto-vacuum:
```typescript
const client = new StatsClient({
  database: {
    type: 'sqlite',
    path: './stats.db',
    options: {
      pragma: {
        auto_vacuum: 'INCREMENTAL'
      }
    }
  }
});
```

### PostgreSQL Problems

#### Connection Refused
**Error**: `ECONNREFUSED: Connection refused`

**Solutions**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql
sudo systemctl start postgresql

# Check if port is correct
netstat -an | grep 5432

# Test connection manually
psql -h localhost -U stats_user -d discord_stats
```

#### Authentication Failed
**Error**: `password authentication failed for user`

**Solutions**:
```bash
# Reset user password
sudo -u postgres psql
ALTER USER stats_user PASSWORD 'new_password';

# Check pg_hba.conf authentication method
sudo nano /etc/postgresql/15/main/pg_hba.conf
# Change 'peer' to 'md5' for local connections
```

#### Too Many Connections
**Error**: `FATAL: too many connections for role`

**Solutions**:
```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity WHERE usename = 'stats_user';

-- Increase connection limit
ALTER USER stats_user CONNECTION LIMIT 50;

-- Or adjust pool settings
```

```typescript
const client = new StatsClient({
  database: {
    type: 'postgres',
    // ... other config
    pool: {
      min: 2,
      max: 10, // Reduce max connections
      idleTimeoutMillis: 30000
    }
  }
});
```

## ⚡ Performance Issues

### Slow Queries
**Symptoms**: High response times, timeouts

**Diagnosis**:
```typescript
// Enable slow query logging
client.on('slowQuery', (query) => {
  console.warn(`Slow query: ${query.sql}`);
  console.warn(`Duration: ${query.duration}ms`);
  console.warn(`Parameters:`, query.params);
});
```

**Solutions**:
```typescript
// Add indexes for common queries
await client.executeQuery(`
  CREATE INDEX IF NOT EXISTS idx_message_events_guild_timestamp 
  ON message_events(guildId, timestamp);
`);

// Use pagination for large results
const messages = await client.getMessages('guild_id', {
  limit: 1000,
  offset: 0
});

// Enable query result caching
const stats = await client.getServerStats('guild_id', 30, {
  cache: true,
  cacheTTL: 300000 // 5 minutes
});
```

### High Memory Usage
**Symptoms**: Out of memory errors, slow performance

**Diagnosis**:
```typescript
// Monitor memory usage
client.on('memoryUsage', (usage) => {
  console.log(`Heap used: ${usage.heapUsed / 1024 / 1024}MB`);
  console.log(`Cache size: ${usage.cacheSize}`);
});
```

**Solutions**:
```typescript
// Reduce cache size
const client = new StatsClient({
  database: { /* ... */ },
  cache: {
    size: 10000, // Reduce from default
    ttl: 300000
  },
  limits: {
    maxMemoryUsage: '512MB',
    maxCacheSize: 50000
  }
});

// Enable garbage collection
if (global.gc) {
  setInterval(() => {
    global.gc();
  }, 300000); // Every 5 minutes
}
```

### Cache Issues
**Symptoms**: Inconsistent data, cache misses

**Solutions**:
```typescript
// Clear cache manually
await client.clearCache();

// Check cache statistics
const cacheStats = await client.getCacheStats();
console.log(`Hit rate: ${cacheStats.hitRate}%`);
console.log(`Size: ${cacheStats.size}`);

// Adjust cache settings
const client = new StatsClient({
  cache: {
    type: 'redis', // Use Redis for better reliability
    host: 'localhost',
    port: 6379,
    ttl: 600000 // 10 minutes
  }
});
```

## 🚨 Error Codes

### WAFORIX_DB_CONNECTION_FAILED
**Description**: Database connection failed

**Solutions**:
- Check database server is running
- Verify connection parameters
- Test network connectivity
- Check firewall settings

### WAFORIX_INVALID_CONFIG
**Description**: Invalid configuration provided

**Solutions**:
```typescript
// Validate configuration
const config = {
  database: {
    type: 'postgres', // Must be 'sqlite' or 'postgres'
    host: 'localhost', // Required for postgres
    port: 5432,        // Must be number
    database: 'discord_stats', // Required
    username: 'user',  // Required for postgres
    password: 'pass'   // Required for postgres
  }
};
```

### WAFORIX_QUERY_TIMEOUT
**Description**: Query execution timeout

**Solutions**:
```typescript
// Increase timeout
const client = new StatsClient({
  database: { /* ... */ },
  limits: {
    queryTimeout: 60000 // 60 seconds
  }
});

// Optimize slow queries
// Add appropriate indexes
// Use pagination for large results
```

### WAFORIX_CACHE_ERROR
**Description**: Cache operation failed

**Solutions**:
- Check Redis server status
- Verify Redis connection parameters
- Monitor Redis memory usage
- Check Redis logs for errors

### WAFORIX_VALIDATION_ERROR
**Description**: Data validation failed

**Solutions**:
```typescript
// Check required fields
await client.trackMessage({
  id: 'required',
  userId: 'required',
  guildId: 'required',
  channelId: 'required',
  content: 'required',
  timestamp: Date.now(), // Must be number
  attachmentCount: 0,    // Must be number
  embedCount: 0          // Must be number
});
```

## 🔍 Debugging

### Enable Debug Logging
```typescript
const client = new StatsClient({
  database: { /* ... */ },
  debug: true, // Enable debug logging
  logger: console // Use custom logger
});
```

### Health Checks
```typescript
// Check system health
const health = await client.healthCheck();
console.log('Database:', health.database);
console.log('Cache:', health.cache);
console.log('Queue:', health.queue);
console.log('Memory:', health.memory);
```

### Performance Metrics
```typescript
// Get performance metrics
const metrics = await client.getPerformanceMetrics();
console.log('Average query time:', metrics.avgQueryTime);
console.log('Slow queries:', metrics.slowQueries);
console.log('Cache hit rate:', metrics.cacheHitRate);
console.log('Memory usage:', metrics.memoryUsage);
```

## 🔧 Common Fixes

### Reset Database Connection
```typescript
// Reconnect to database
await client.disconnect();
await client.initialize();
```

### Clear All Caches
```typescript
// Clear memory cache
await client.clearCache();

// Clear Redis cache (if using Redis)
await client.executeQuery('FLUSHDB'); // Redis command
```

### Rebuild Indexes
```typescript
// For SQLite
await client.executeQuery('REINDEX;');

// For PostgreSQL
await client.executeQuery('REINDEX DATABASE discord_stats;');
```

### Vacuum Database
```typescript
// For SQLite
await client.optimizeDatabase({
  vacuum: true,
  analyze: true
});

// For PostgreSQL
await client.executeQuery('VACUUM ANALYZE;');
```

## 📊 Monitoring

### Set Up Alerts
```typescript
// Monitor for errors
client.on('error', (error) => {
  console.error('Waforix error:', error);
  // Send to monitoring service
  sendAlert('Waforix Error', error.message);
});

// Monitor slow queries
client.on('slowQuery', (query) => {
  if (query.duration > 5000) { // 5 seconds
    sendAlert('Very Slow Query', `${query.sql} took ${query.duration}ms`);
  }
});

// Monitor memory usage
client.on('memoryUsage', (usage) => {
  if (usage.heapUsed > 1024 * 1024 * 1024) { // 1GB
    sendAlert('High Memory Usage', `${usage.heapUsed / 1024 / 1024}MB`);
  }
});
```

### Log Analysis
```bash
# Search for errors in logs
grep -i "error" logs/waforix.log

# Find slow queries
grep "slow query" logs/waforix.log | tail -10

# Monitor memory usage
grep "memory usage" logs/waforix.log | tail -10
```

## 🆘 Getting Help

### Before Asking for Help
1. Check this troubleshooting guide
2. Enable debug logging
3. Check system health
4. Review error logs
5. Test with minimal configuration

### Information to Include
- Waforix version
- Node.js/Bun version
- Database type and version
- Operating system
- Error messages and stack traces
- Configuration (remove sensitive data)
- Steps to reproduce

### Where to Get Help
- [GitHub Issues](https://github.com/waforix/mocha/issues)
- [GitHub Discussions](https://github.com/waforix/mocha/discussions)
- [Discord Community](https://discord.gg/your-invite)
- [Documentation](https://github.com/waforix/mocha/wiki)

### Creating a Good Issue Report
```markdown
## Bug Report

**Waforix Version**: 2.1.0
**Node.js Version**: 18.17.0
**Database**: PostgreSQL 15.3
**OS**: Ubuntu 22.04

**Description**:
Brief description of the issue

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Error Messages**:
```
Paste error messages here
```

**Configuration**:
```typescript
// Your configuration (remove sensitive data)
```

**Additional Context**:
Any other relevant information
```

## 🔄 Recovery Procedures

### Database Recovery
```typescript
// Backup before recovery
const backup = await client.exportData('guild_id', {
  format: 'json',
  includeAll: true
});

// Save backup
fs.writeFileSync('./emergency-backup.json', JSON.stringify(backup));

// Restore from backup if needed
await client.importData('guild_id', backup);
```

### Cache Recovery
```typescript
// Rebuild cache from database
await client.rebuildCache('guild_id');

// Or clear and let it rebuild naturally
await client.clearCache();
```

### Connection Recovery
```typescript
// Implement automatic reconnection
client.on('disconnected', async () => {
  console.log('Database disconnected, attempting reconnection...');
  
  let retries = 0;
  const maxRetries = 5;
  
  while (retries < maxRetries) {
    try {
      await client.initialize();
      console.log('Reconnected successfully');
      break;
    } catch (error) {
      retries++;
      console.log(`Reconnection attempt ${retries} failed`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
});
```
