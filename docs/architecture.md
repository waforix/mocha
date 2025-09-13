# Architecture

This document explains the internal architecture and design principles of Mocha.

## Design Philosophy

Mocha is built around three core principles:

1. **Component-Based Architecture** - Small, focused modules with single responsibilities
2. **Performance First** - Optimized for high-throughput Discord servers
3. **Developer Experience** - Clean APIs with full TypeScript support

## System Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Discord API   │    │   StatsClient   │    │   Application   │
│                 │    │                 │    │                 │
│  Gateway Events │◄──►│  Main Interface │◄──►│  Your Bot Code  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
        ┌─────────────────────────────────────────────────────┐
        │                Core Components                      │
        ├─────────────────┬─────────────────┬─────────────────┤
        │   GatewayClient │  EventDispatcher│  CacheManager   │
        │                 │                 │                 │
        │ WebSocket Conn. │ Event Routing   │ LRU Caching     │
        └─────────────────┴─────────────────┴─────────────────┘
                                │
                                ▼
        ┌─────────────────────────────────────────────────────┐
        │              Processing Layer                       │
        ├─────────────────┬─────────────────┬─────────────────┤
        │ MessageProcessor│ VoiceProcessor  │ MemberProcessor │
        │                 │                 │                 │
        │ Message Events  │ Voice Events    │ Member Events   │
        └─────────────────┴─────────────────┴─────────────────┘
                                │
                                ▼
        ┌─────────────────────────────────────────────────────┐
        │               Data Layer                            │
        ├─────────────────┬─────────────────┬─────────────────┤
        │   SQLite DB     │ StatsAggregator │  Query Modules  │
        │                 │                 │                 │
        │ Persistent Data │ Data Analysis   │ Specialized     │
        │                 │                 │ Queries         │
        └─────────────────┴─────────────────┴─────────────────┘
```

## Core Components

### StatsClient (`src/lib/client.ts`)

The main interface that orchestrates all components. Responsibilities:

- Initialize and manage all subsystems
- Provide public API methods
- Handle high-level error management
- Coordinate caching and database operations

**Key Features:**
- Event-driven architecture with EventEmitter
- Automatic connection management
- Integrated caching layer
- Type-safe method signatures

### GatewayClient (`src/gateway/client.ts`)

Manages the WebSocket connection to Discord's Gateway API.

**Features:**
- Automatic reconnection with exponential backoff
- Heartbeat management
- Rate limit handling
- Connection state management

**Error Handling:**
- Fatal error detection (invalid token, etc.)
- Automatic retry for transient failures
- Graceful degradation on connection issues

### EventDispatcher (`src/events/dispatcher.ts`)

Routes Discord events to appropriate processors based on event type.

**Design:**
- Event type mapping to processor classes
- Parallel processing for independent events
- Error isolation (one event failure doesn't affect others)
- Performance monitoring and metrics

### Event Processors (`src/processors/`)

Specialized classes for handling different Discord event types:

- **MessageProcessor** - Handles MESSAGE_CREATE events
- **VoiceProcessor** - Handles VOICE_STATE_UPDATE events  
- **MemberProcessor** - Handles GUILD_MEMBER_ADD/REMOVE events
- **PresenceProcessor** - Handles PRESENCE_UPDATE events
- **GuildProcessor** - Handles GUILD_CREATE/UPDATE/DELETE events

**Common Pattern:**
```typescript
export class MessageProcessor extends BaseProcessor {
  async process(data: GatewayMessageCreateDispatchData): Promise<void> {
    // Extract relevant data
    // Validate and sanitize
    // Store in database
    // Update cache if needed
  }
}
```

### Database Layer (`src/db/`)

Uses Drizzle ORM with SQLite for data persistence.

**Schema Design:**
- Normalized tables with proper relationships
- Composite indexes for query optimization
- WAL mode for better concurrent access
- Optimized pragmas for performance

**Tables:**
- `guilds` - Guild information and settings
- `users` - User profiles and metadata
- `channels` - Channel information
- `members` - Guild membership data
- `message_events` - Message statistics
- `voice_events` - Voice activity tracking
- `member_events` - Join/leave events
- `presence_events` - Status/activity changes

### Cache Layer (`src/cache/`)

Multi-level LRU caching system for performance optimization.

**Cache Types:**
- **User Stats Cache** - Individual user statistics
- **Guild Stats Cache** - Guild-wide statistics
- **Leaderboard Cache** - Pre-computed leaderboards
- **Query Cache** - Generic query result caching

**Features:**
- Configurable TTL per cache type
- Type-safe key generation
- Intelligent cache invalidation
- Memory usage monitoring

### Statistics Engine (`src/stats/`)

High-performance query engine with specialized query modules.

**Query Modules:**
- **MessageQueries** - Message-related statistics
- **VoiceQueries** - Voice activity analysis
- **UserQueries** - User leaderboards and rankings
- **ChannelQueries** - Channel-specific statistics
- **MemberQueries** - Member growth tracking

**Optimization Techniques:**
- Pre-computed aggregations
- Efficient date range queries
- Composite index utilization
- Result set pagination

## Data Flow

### Event Processing Flow

```
Discord Event → GatewayClient → EventDispatcher → Processor → Database
                                                      ↓
                                               Cache Invalidation
```

1. **Event Reception** - GatewayClient receives WebSocket message
2. **Event Parsing** - Raw data parsed into typed structures
3. **Event Routing** - EventDispatcher routes to appropriate processor
4. **Data Processing** - Processor extracts and validates relevant data
5. **Database Storage** - Data persisted to SQLite database
6. **Cache Management** - Related cache entries invalidated

### Query Processing Flow

```
API Request → StatsClient → Cache Check → Query Module → Database → Cache Store → Response
```

1. **Request Validation** - Parameters validated and sanitized
2. **Cache Lookup** - Check if result exists in cache
3. **Query Execution** - If cache miss, execute database query
4. **Result Processing** - Format and enrich query results
5. **Cache Storage** - Store result in appropriate cache
6. **Response** - Return formatted data to caller

## Performance Optimizations

### Database Optimizations

- **WAL Mode** - Better concurrent read/write performance
- **Composite Indexes** - Optimized for common query patterns
- **Query Planning** - Efficient JOIN operations and filtering
- **Batch Operations** - Reduce database round trips

### Caching Strategy

- **Multi-Level Caching** - Different cache sizes for different data types
- **Smart Invalidation** - Only invalidate affected cache entries
- **TTL Management** - Prevent stale data while maintaining performance
- **Memory Monitoring** - Automatic cache clearing on high memory usage

### Connection Management

- **Connection Pooling** - Reuse database connections
- **Exponential Backoff** - Intelligent retry logic for failed connections
- **Heartbeat Optimization** - Minimal overhead for connection health checks
- **Graceful Degradation** - Continue operating during temporary failures

## Scalability Considerations

### Horizontal Scaling

- **Stateless Design** - No shared state between instances
- **Database Sharding** - Partition data by guild ID
- **Cache Distribution** - Redis cluster for shared caching
- **Load Balancing** - Distribute Discord connections across instances

### Vertical Scaling

- **Memory Optimization** - Efficient data structures and garbage collection
- **CPU Optimization** - Minimize processing overhead per event
- **I/O Optimization** - Batch database operations and async processing
- **Resource Monitoring** - Track and optimize resource usage

## Error Handling Strategy

### Error Categories

1. **Transient Errors** - Network issues, temporary API failures
2. **Permanent Errors** - Invalid tokens, missing permissions
3. **Data Errors** - Malformed events, validation failures
4. **System Errors** - Database failures, memory issues

### Error Recovery

- **Automatic Retry** - For transient failures with exponential backoff
- **Circuit Breaker** - Prevent cascade failures
- **Graceful Degradation** - Continue core functionality during partial failures
- **Error Reporting** - Comprehensive logging and monitoring

## Security Considerations

### Data Protection

- **Token Security** - Secure storage and transmission of Discord tokens
- **Data Sanitization** - Validate and sanitize all input data
- **Access Control** - Proper permissions for database and file access
- **Audit Logging** - Track all data access and modifications

### Privacy Compliance

- **Data Minimization** - Only collect necessary data
- **Retention Policies** - Automatic cleanup of old data
- **User Rights** - Support for data deletion requests
- **Anonymization** - Remove personally identifiable information when possible

## Testing Strategy

### Test Types

- **Unit Tests** - Individual component testing
- **Integration Tests** - Component interaction testing
- **Performance Tests** - Load and stress testing
- **End-to-End Tests** - Full system workflow testing

### Test Coverage

- **Core Logic** - 100% coverage for critical paths
- **Error Handling** - Test all error scenarios
- **Edge Cases** - Boundary conditions and unusual inputs
- **Performance** - Benchmark critical operations
