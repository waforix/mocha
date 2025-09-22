# Performance Optimization

This guide covers best practices and optimization techniques for maximizing Waforix performance in production environments.

## Database Optimization

### SQLite Optimization

#### Configuration
```typescript
const client = new StatsClient({
  database: {
    type: 'sqlite',
    path: './stats.db',
    options: {
      // Enable WAL mode for better concurrency
      pragma: {
        journal_mode: 'WAL',
        synchronous: 'NORMAL',
        cache_size: -64000,  // 64MB cache
        temp_store: 'MEMORY',
        mmap_size: 268435456 // 256MB memory map
      }
    }
  }
});
```

#### Indexing Strategy
```sql
-- Automatically created by Waforix, but shown for reference
CREATE INDEX idx_message_events_guild_timestamp ON message_events(guildId, timestamp);
CREATE INDEX idx_message_events_user_timestamp ON message_events(userId, timestamp);
CREATE INDEX idx_voice_events_guild_timestamp ON voice_events(guildId, timestamp);
CREATE INDEX idx_reaction_events_message ON reaction_events(messageId);
```

#### Maintenance
```typescript
// Periodic database maintenance
await client.optimizeDatabase({
  vacuum: true,        // Reclaim space
  analyze: true,       // Update statistics
  reindex: true        // Rebuild indexes
});
```

### PostgreSQL Optimization

#### Connection Pooling
```typescript
const client = new StatsClient({
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'discord_stats',
    username: 'stats_user',
    password: 'password',
    pool: {
      min: 5,                    // Minimum connections
      max: 20,                   // Maximum connections
      idleTimeoutMillis: 30000,  // Close idle connections
      connectionTimeoutMillis: 2000,
      acquireTimeoutMillis: 60000
    }
  }
});
```

#### Database Configuration
```sql
-- postgresql.conf optimizations
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

#### Partitioning
```sql
-- Partition large tables by date (handled automatically in future versions)
CREATE TABLE message_events_2023_12 PARTITION OF message_events
FOR VALUES FROM ('2023-12-01') TO ('2024-01-01');
```

## Caching Strategies

### Memory Caching
```typescript
const client = new StatsClient({
  database: { /* ... */ },
  cache: {
    type: 'memory',
    size: 50000,        // Cache 50k items
    ttl: 300000,        // 5 minute TTL
    checkPeriod: 60000  // Check for expired items every minute
  }
});
```

### Redis Caching
```typescript
const client = new StatsClient({
  database: { /* ... */ },
  cache: {
    type: 'redis',
    host: 'localhost',
    port: 6379,
    db: 0,
    ttl: 600000,        // 10 minute TTL
    keyPrefix: 'waforix:'
  }
});
```

### Query Result Caching
```typescript
// Cache expensive analytics queries
const stats = await client.getServerStats('guild_id', 30, {
  cache: true,
  cacheTTL: 300000  // Cache for 5 minutes
});

// Cache user leaderboards
const leaderboard = await client.getLeaderboard('guild_id', 'messages', {
  limit: 100,
  days: 30,
  cache: true,
  cacheTTL: 600000  // Cache for 10 minutes
});
```

## Batch Processing

### Event Batching
```typescript
const client = new StatsClient({
  database: { /* ... */ },
  processing: {
    batchSize: 1000,      // Process 1000 events at once
    batchTimeout: 5000,   // Flush batch every 5 seconds
    maxBatches: 10        // Maximum concurrent batches
  }
});

// Manual batch processing
const events = [
  { type: 'message', data: messageData1 },
  { type: 'message', data: messageData2 },
  { type: 'voice', data: voiceData1 }
];

await client.batchProcess(events);
```

### Bulk Operations
```typescript
// Bulk insert messages
const messages = [/* array of message objects */];
await client.bulkTrackMessages(messages);

// Bulk update user data
const users = [/* array of user objects */];
await client.bulkUpdateUsers(users);
```

## Asynchronous Processing

### Queue-Based Processing
```typescript
const client = new StatsClient({
  database: { /* ... */ },
  queue: {
    type: 'memory',     // or 'redis' for distributed
    concurrency: 5,     // Process 5 jobs concurrently
    maxRetries: 3,      // Retry failed jobs 3 times
    retryDelay: 1000    // Wait 1 second between retries
  }
});

// Events are automatically queued
await client.trackMessage(messageData); // Returns immediately
```

### Background Processing
```typescript
// Enable background processing for analytics
const client = new StatsClient({
  database: { /* ... */ },
  analytics: {
    backgroundProcessing: true,
    processingInterval: 3600000,  // Process every hour
    precomputeStats: true         // Pre-compute common statistics
  }
});

// Get pre-computed results (much faster)
const stats = await client.getCachedServerStats('guild_id');
```

## Memory Management

### Memory Monitoring
```typescript
// Monitor memory usage
client.on('memoryUsage', (usage) => {
  console.log(`Memory usage: ${usage.heapUsed / 1024 / 1024}MB`);
  console.log(`Cache size: ${usage.cacheSize}`);
  console.log(`Queue size: ${usage.queueSize}`);
});

// Set memory limits
const client = new StatsClient({
  database: { /* ... */ },
  limits: {
    maxMemoryUsage: '512MB',
    maxCacheSize: 100000,
    maxQueueSize: 50000
  }
});
```

### Garbage Collection
```typescript
// Manual garbage collection for long-running processes
setInterval(() => {
  if (global.gc) {
    global.gc();
  }
  client.clearExpiredCache();
}, 300000); // Every 5 minutes
```

## Query Optimization

### Efficient Queries
```typescript
// Use specific date ranges instead of open-ended queries
const stats = await client.getServerStats('guild_id', 30); // Good
// const stats = await client.getServerStats('guild_id'); // Avoid

// Use pagination for large result sets
const messages = await client.getMessages('guild_id', {
  limit: 1000,
  offset: 0,
  orderBy: 'timestamp',
  order: 'DESC'
});

// Use indexes effectively
const userStats = await client.getUserStats('guild_id', 'user_id', 30);
```

### Query Planning
```typescript
// Analyze query performance
const queryPlan = await client.explainQuery(`
  SELECT COUNT(*) FROM message_events 
  WHERE guildId = ? AND timestamp >= ?
`, ['guild_id', Date.now() - 30 * 24 * 60 * 60 * 1000]);

console.log('Query plan:', queryPlan);
```

## Network Optimization

### Connection Pooling
```typescript
// Optimize database connections
const client = new StatsClient({
  database: {
    type: 'postgres',
    // ... connection details
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 60000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200
    }
  }
});
```

### Request Batching
```typescript
// Batch multiple requests
const batchResults = await client.batchQuery([
  { method: 'getServerStats', args: ['guild_id', 30] },
  { method: 'getUserStats', args: ['guild_id', 'user_id', 30] },
  { method: 'getLeaderboard', args: ['guild_id', 'messages', { limit: 10 }] }
]);
```

## Monitoring & Profiling

### Performance Metrics
```typescript
// Enable performance monitoring
const client = new StatsClient({
  database: { /* ... */ },
  monitoring: {
    enabled: true,
    metricsInterval: 60000,  // Collect metrics every minute
    slowQueryThreshold: 1000 // Log queries taking > 1 second
  }
});

// Access performance metrics
const metrics = await client.getPerformanceMetrics();
console.log({
  avgQueryTime: metrics.avgQueryTime,
  slowQueries: metrics.slowQueries,
  cacheHitRate: metrics.cacheHitRate,
  memoryUsage: metrics.memoryUsage
});
```

### Query Logging
```typescript
// Log slow queries for optimization
client.on('slowQuery', (query) => {
  console.warn(`Slow query detected: ${query.sql}`);
  console.warn(`Execution time: ${query.duration}ms`);
  console.warn(`Parameters:`, query.params);
});
```

### Health Checks
```typescript
// Implement health checks
const healthCheck = await client.healthCheck();
console.log({
  database: healthCheck.database,     // 'healthy' | 'degraded' | 'unhealthy'
  cache: healthCheck.cache,
  queue: healthCheck.queue,
  memory: healthCheck.memory
});
```

## Scaling Strategies

### Horizontal Scaling
```typescript
// Multiple instances with shared cache
const client1 = new StatsClient({
  database: { /* ... */ },
  cache: {
    type: 'redis',
    host: 'redis-cluster.example.com'
  },
  instanceId: 'worker-1'
});

const client2 = new StatsClient({
  database: { /* ... */ },
  cache: {
    type: 'redis',
    host: 'redis-cluster.example.com'
  },
  instanceId: 'worker-2'
});
```

### Read Replicas
```typescript
// Use read replicas for analytics queries
const client = new StatsClient({
  database: {
    type: 'postgres',
    // Write database
    master: {
      host: 'master-db.example.com',
      database: 'discord_stats',
      username: 'write_user',
      password: 'password'
    },
    // Read replicas
    replicas: [
      {
        host: 'replica1-db.example.com',
        database: 'discord_stats',
        username: 'read_user',
        password: 'password'
      },
      {
        host: 'replica2-db.example.com',
        database: 'discord_stats',
        username: 'read_user',
        password: 'password'
      }
    ]
  }
});
```

## Production Deployment

### Environment Configuration
```typescript
// Production-optimized configuration
const client = new StatsClient({
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    pool: {
      min: 5,
      max: 20,
      idleTimeoutMillis: 30000
    },
    ssl: process.env.NODE_ENV === 'production'
  },
  cache: {
    type: 'redis',
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    ttl: 600000
  },
  processing: {
    batchSize: 1000,
    batchTimeout: 5000,
    maxBatches: 10
  },
  monitoring: {
    enabled: true,
    metricsInterval: 60000
  }
});
```

### Resource Limits
```typescript
// Set appropriate resource limits
const client = new StatsClient({
  database: { /* ... */ },
  limits: {
    maxMemoryUsage: '1GB',
    maxCacheSize: 500000,
    maxQueueSize: 100000,
    maxConcurrentQueries: 50,
    queryTimeout: 30000
  }
});
```

### Error Handling
```typescript
// Robust error handling
client.on('error', (error) => {
  console.error('Waforix error:', error);
  // Send to error tracking service
  errorTracker.captureException(error);
});

client.on('databaseError', (error) => {
  console.error('Database error:', error);
  // Implement fallback or retry logic
});

client.on('cacheError', (error) => {
  console.warn('Cache error:', error);
  // Cache errors shouldn't break functionality
});
```
