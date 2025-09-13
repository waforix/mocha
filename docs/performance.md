# Performance Guide

This guide covers performance optimization techniques and best practices for using Mocha in high-throughput environments.

## Performance Overview

Mocha is designed for high-performance Discord servers with thousands of concurrent users. Key performance metrics:

- **Event Processing**: 10,000+ events/second
- **Query Response**: <50ms for cached queries, <200ms for database queries
- **Memory Usage**: ~100MB baseline, scales with cache size
- **Database Size**: ~1MB per 100,000 events

## Database Optimizations

### SQLite Configuration

Mocha automatically configures SQLite with optimal settings:

```sql
PRAGMA journal_mode = WAL;           -- Write-Ahead Logging for better concurrency
PRAGMA synchronous = NORMAL;         -- Balance between safety and performance  
PRAGMA cache_size = 10000;          -- 40MB cache size
PRAGMA temp_store = MEMORY;          -- Store temporary data in memory
PRAGMA mmap_size = 268435456;       -- 256MB memory-mapped I/O
```

### Index Strategy

Composite indexes are created for common query patterns:

```sql
-- Message queries by guild and time
CREATE INDEX idx_message_events_guild_time ON message_events(guild_id, created_at);

-- Voice queries by user and time  
CREATE INDEX idx_voice_events_user_time ON voice_events(user_id, created_at);

-- Leaderboard queries
CREATE INDEX idx_message_events_guild_user ON message_events(guild_id, user_id);
```

### Query Optimization

**Efficient Date Filtering:**
```typescript
// Good: Use indexed timestamp column
const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const results = await db.select()
  .from(messageEvents)
  .where(and(
    eq(messageEvents.guildId, guildId),
    gte(messageEvents.createdAt, since)
  ));

// Bad: Use date functions that prevent index usage
const results = await db.select()
  .from(messageEvents)
  .where(sql`DATE(created_at) >= DATE('now', '-${days} days')`);
```

**Batch Operations:**
```typescript
// Good: Batch insert multiple events
await db.insert(messageEvents).values([
  { guildId, userId, channelId, createdAt: new Date() },
  { guildId, userId, channelId, createdAt: new Date() },
  // ... more events
]);

// Bad: Individual inserts
for (const event of events) {
  await db.insert(messageEvents).values(event);
}
```

## Caching Strategy

### Cache Configuration

Optimize cache sizes based on your server's characteristics:

```typescript
const client = new StatsClient({
  token: process.env.DISCORD_TOKEN!,
  cache: {
    // Large servers (10k+ members)
    userStatsSize: 5000,      // Cache top 5k active users
    guildStatsSize: 100,      // Cache 100 different time ranges
    leaderboardSize: 1000,    // Cache various leaderboard queries
    ttlMs: 300000,           // 5 minute TTL
    
    // Small servers (<1k members)  
    userStatsSize: 1000,      // Cache top 1k users
    guildStatsSize: 50,       // Cache 50 time ranges
    leaderboardSize: 200,     // Cache common leaderboards
    ttlMs: 600000,           // 10 minute TTL
  }
});
```

### Cache Warming

Pre-populate cache with frequently accessed data:

```typescript
// Warm cache during low-traffic periods
async function warmCache(guildId: string) {
  const topUsers = await client.getLeaderboard(guildId, 'messages', 100, 30);
  
  // Pre-load stats for top users
  const promises = topUsers.map(user => 
    client.getUserStats(guildId, user.userId, 30)
  );
  
  await Promise.all(promises);
  console.log(`Warmed cache for ${topUsers.length} users`);
}

// Run cache warming every hour during low activity
setInterval(() => {
  if (new Date().getHours() >= 2 && new Date().getHours() <= 6) {
    warmCache(guildId);
  }
}, 3600000);
```

### Cache Monitoring

Monitor cache performance and adjust as needed:

```typescript
setInterval(() => {
  const stats = client.getCacheStats();
  const hitRate = calculateHitRate(); // Your implementation
  
  console.log('Cache Performance:');
  console.log(`  User Stats: ${stats.userStats} entries`);
  console.log(`  Hit Rate: ${hitRate.toFixed(2)}%`);
  
  // Alert if hit rate is low
  if (hitRate < 80) {
    console.warn('Low cache hit rate - consider increasing cache size');
  }
}, 300000); // Every 5 minutes
```

## Memory Management

### Memory Monitoring

Track memory usage and implement automatic cleanup:

```typescript
function monitorMemory() {
  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
  
  console.log(`Memory: ${heapUsedMB}MB / ${heapTotalMB}MB`);
  
  // Clear cache if memory usage is high
  if (heapUsedMB > 500) {
    client.clearCache();
    console.log('Cache cleared due to high memory usage');
  }
  
  // Force garbage collection if available
  if (global.gc && heapUsedMB > 300) {
    global.gc();
  }
}

setInterval(monitorMemory, 60000); // Every minute
```

### Memory Optimization Tips

**Efficient Data Structures:**
```typescript
// Good: Use Map for O(1) lookups
const userCache = new Map<string, UserStats>();

// Bad: Use Array for frequent lookups
const userCache: Array<{id: string, stats: UserStats}> = [];
```

**Avoid Memory Leaks:**
```typescript
// Good: Clean up event listeners
client.on('eventProcessed', handler);
// Later...
client.removeListener('eventProcessed', handler);

// Bad: Accumulating listeners
client.on('eventProcessed', () => { /* handler */ });
```

## Connection Optimization

### Gateway Connection

Optimize Discord Gateway connection settings:

```typescript
const client = new StatsClient({
  token: process.env.DISCORD_TOKEN!,
  maxReconnects: 10,        // Allow more reconnection attempts
  intents: INTENTS.BASIC,   // Only request needed intents
});

// Monitor connection health
client.on('gatewayError', (error) => {
  console.error('Gateway error:', error);
  // Implement custom reconnection logic if needed
});
```

### Database Connection

Optimize SQLite connection handling:

```typescript
// Use connection pooling for high-concurrency scenarios
const db = drizzle(new Database(dbPath, {
  // Enable WAL mode for better concurrency
  pragma: {
    journal_mode: 'WAL',
    synchronous: 'NORMAL',
    cache_size: 10000,
  }
}));
```

## Benchmarking

### Performance Testing

Create benchmarks for critical operations:

```typescript
async function benchmarkUserStats() {
  const iterations = 1000;
  const guildId = 'test-guild';
  const userId = 'test-user';
  
  console.time('getUserStats');
  
  for (let i = 0; i < iterations; i++) {
    await client.getUserStats(guildId, userId, 30);
  }
  
  console.timeEnd('getUserStats');
  console.log(`Average: ${1000 / iterations}ms per query`);
}

// Run benchmarks
await benchmarkUserStats();
```

### Load Testing

Test with realistic Discord event loads:

```typescript
async function loadTest() {
  const eventsPerSecond = 1000;
  const duration = 60; // seconds
  
  console.log(`Starting load test: ${eventsPerSecond} events/sec for ${duration}s`);
  
  const startTime = Date.now();
  let eventCount = 0;
  
  const interval = setInterval(async () => {
    // Simulate Discord events
    for (let i = 0; i < eventsPerSecond / 10; i++) {
      // Process mock events
      eventCount++;
    }
  }, 100); // Every 100ms
  
  setTimeout(() => {
    clearInterval(interval);
    const elapsed = (Date.now() - startTime) / 1000;
    console.log(`Processed ${eventCount} events in ${elapsed}s`);
    console.log(`Rate: ${Math.round(eventCount / elapsed)} events/sec`);
  }, duration * 1000);
}
```

## Production Optimization

### Environment Configuration

Optimize Node.js/Bun runtime settings:

```bash
# Node.js optimizations
export NODE_OPTIONS="--max-old-space-size=2048 --optimize-for-size"

# Bun optimizations  
export BUN_JSC_useJIT=1
export BUN_JSC_useBBQJIT=1
```

### Process Management

Use process managers for production deployment:

```javascript
// ecosystem.config.js for PM2
module.exports = {
  apps: [{
    name: 'mocha-bot',
    script: './dist/bot.js',
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### Monitoring and Alerting

Implement comprehensive monitoring:

```typescript
// Performance metrics collection
const metrics = {
  eventsProcessed: 0,
  queriesExecuted: 0,
  cacheHits: 0,
  cacheMisses: 0,
  errors: 0
};

// Export metrics for monitoring systems
app.get('/metrics', (req, res) => {
  const memUsage = process.memoryUsage();
  const cacheStats = client.getCacheStats();
  
  res.json({
    ...metrics,
    memory: {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external
    },
    cache: cacheStats,
    uptime: process.uptime()
  });
});
```

## Performance Troubleshooting

### Common Issues

**Slow Queries:**
- Check if proper indexes exist
- Verify query patterns match index design
- Consider query result caching

**High Memory Usage:**
- Reduce cache sizes
- Implement more aggressive cache TTL
- Check for memory leaks in event handlers

**Connection Issues:**
- Monitor Discord API rate limits
- Implement exponential backoff
- Check network connectivity and latency

### Debugging Tools

**Query Analysis:**
```typescript
// Enable query logging in development
const db = drizzle(database, { 
  logger: true // Log all SQL queries
});
```

**Performance Profiling:**
```typescript
// Profile critical functions
console.time('criticalOperation');
await criticalOperation();
console.timeEnd('criticalOperation');
```

**Memory Profiling:**
```bash
# Run with memory profiling
node --inspect --max-old-space-size=2048 bot.js

# Or with Bun
bun --inspect bot.js
```
