# API Reference

Complete API reference for Waforix Discord statistics library.

## StatsClient

The main client class for interacting with Waforix.

### Constructor

```typescript
new StatsClient(options: StatsClientOptions)
```

#### StatsClientOptions

```typescript
interface StatsClientOptions {
  database: DatabaseConfig;
  cache?: CacheConfig;
  processing?: ProcessingConfig;
  filters?: FilterConfig;
  privacy?: PrivacyConfig;
  monitoring?: MonitoringConfig;
  limits?: LimitConfig;
}
```

### Database Configuration

#### SQLite Configuration
```typescript
interface SQLiteConfig {
  type: 'sqlite';
  path: string;
  options?: {
    timeout?: number;
    verbose?: (message: string) => void;
    pragma?: Record<string, string | number>;
  };
}
```

#### PostgreSQL Configuration
```typescript
interface PostgreSQLConfig {
  type: 'postgres';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  pool?: {
    min?: number;
    max?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
    acquireTimeoutMillis?: number;
  };
  ssl?: boolean | object;
}
```

## Core Methods

### initialize()
Initialize the client and database connection.

```typescript
await client.initialize(): Promise<void>
```

### trackMessage()
Track a message event.

```typescript
await client.trackMessage(data: MessageEventData): Promise<void>

interface MessageEventData {
  id: string;
  userId: string;
  guildId: string;
  channelId: string;
  content: string;
  timestamp: number;
  attachmentCount: number;
  embedCount: number;
  messageType?: string;
  isBot?: boolean;
  isPinned?: boolean;
  referencedMessageId?: string;
  threadId?: string;
}
```

### trackVoice()
Track a voice event.

```typescript
await client.trackVoice(data: VoiceEventData): Promise<void>

interface VoiceEventData {
  id: string;
  userId: string;
  guildId: string;
  channelId: string;
  action: 'join' | 'leave' | 'move';
  timestamp: number;
  duration?: number;
  previousChannelId?: string;
}
```

### trackReaction()
Track a reaction event.

```typescript
await client.trackReaction(data: ReactionEventData): Promise<void>

interface ReactionEventData {
  id: string;
  userId: string;
  guildId: string;
  channelId: string;
  messageId: string;
  action: 'add' | 'remove';
  emojiId?: string;
  emojiName: string;
  emojiAnimated?: boolean;
  timestamp: number;
}
```

### trackMember()
Track a member event.

```typescript
await client.trackMember(data: MemberEventData): Promise<void>

interface MemberEventData {
  id: string;
  userId: string;
  guildId: string;
  action: 'join' | 'leave';
  timestamp: number;
}
```

## Analytics Methods

### getServerStats()
Get comprehensive server statistics.

```typescript
await client.getServerStats(
  guildId: string, 
  days?: number
): Promise<ServerStats>

interface ServerStats {
  totalMessages: number;
  totalVoiceTime: number;
  activeUsers: number;
  topChannels: ChannelStats[];
  memberCount: number;
  growthRate: number;
}
```

### getUserStats()
Get statistics for a specific user.

```typescript
await client.getUserStats(
  guildId: string, 
  userId: string, 
  days?: number
): Promise<UserStats>

interface UserStats {
  messages: number;
  voiceTime: number;
  reactions: number;
  joinDate: number;
  lastActive: number;
  rank: number;
}
```

### getLeaderboard()
Get user leaderboard.

```typescript
await client.getLeaderboard(
  guildId: string,
  type: 'messages' | 'voice' | 'reactions',
  options?: LeaderboardOptions
): Promise<LeaderboardEntry[]>

interface LeaderboardOptions {
  limit?: number;
  days?: number;
  channelId?: string;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  count: number;
  percentage: number;
}
```

### getServerInsights()
Get detailed server insights and analytics.

```typescript
await client.getServerInsights(
  guildId: string,
  options?: InsightOptions
): Promise<ServerInsights>

interface InsightOptions {
  days?: number;
  includeHourlyActivity?: boolean;
  includeGrowthTrend?: boolean;
  includeChannelBreakdown?: boolean;
}

interface ServerInsights {
  hourlyActivity?: HourlyActivity[];
  dailyActivity?: DailyActivity[];
  memberGrowth?: GrowthData[];
  engagementTrend?: EngagementData[];
  channelActivity?: ChannelActivity[];
}
```

## Query Methods

### getMessages()
Query message events.

```typescript
await client.getMessages(
  guildId: string,
  options?: QueryOptions
): Promise<MessageEvent[]>

interface QueryOptions {
  userId?: string;
  channelId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
}
```

### getVoiceEvents()
Query voice events.

```typescript
await client.getVoiceEvents(
  guildId: string,
  options?: QueryOptions
): Promise<VoiceEvent[]>
```

### getReactions()
Query reaction events.

```typescript
await client.getReactions(
  guildId: string,
  options?: QueryOptions
): Promise<ReactionEvent[]>
```

### getMemberEvents()
Query member events.

```typescript
await client.getMemberEvents(
  guildId: string,
  options?: QueryOptions
): Promise<MemberEvent[]>
```

## Export Methods

### exportData()
Export server data.

```typescript
await client.exportData(
  guildId: string,
  options?: ExportOptions
): Promise<ExportResult>

interface ExportOptions {
  format?: 'json' | 'csv' | 'sql';
  startDate?: Date;
  endDate?: Date;
  days?: number;
  includeMessages?: boolean;
  includeVoice?: boolean;
  includeReactions?: boolean;
  includeMembers?: boolean;
  compress?: boolean;
  pretty?: boolean;
}

interface ExportResult {
  totalRecords: number;
  fileSize: number;
  data: any;
  metadata: ExportMetadata;
}
```

### exportUserData()
Export data for a specific user (GDPR compliance).

```typescript
await client.exportUserData(
  userId: string,
  options?: UserExportOptions
): Promise<UserExportResult>
```

### createExportStream()
Create a streaming export for large datasets.

```typescript
client.createExportStream(
  guildId: string,
  options?: ExportOptions
): ExportStream
```

## Utility Methods

### healthCheck()
Check system health.

```typescript
await client.healthCheck(): Promise<HealthStatus>

interface HealthStatus {
  database: 'healthy' | 'degraded' | 'unhealthy';
  cache: 'healthy' | 'degraded' | 'unhealthy';
  queue: 'healthy' | 'degraded' | 'unhealthy';
  memory: 'healthy' | 'degraded' | 'unhealthy';
}
```

### getPerformanceMetrics()
Get performance metrics.

```typescript
await client.getPerformanceMetrics(): Promise<PerformanceMetrics>

interface PerformanceMetrics {
  avgQueryTime: number;
  slowQueries: number;
  cacheHitRate: number;
  memoryUsage: number;
  queueSize: number;
}
```

### optimizeDatabase()
Optimize database performance.

```typescript
await client.optimizeDatabase(options?: OptimizeOptions): Promise<void>

interface OptimizeOptions {
  vacuum?: boolean;
  analyze?: boolean;
  reindex?: boolean;
}
```

## Event Emitter

StatsClient extends EventEmitter and emits the following events:

### Events

```typescript
// Connection events
client.on('connected', () => void);
client.on('disconnected', () => void);
client.on('reconnecting', () => void);

// Error events
client.on('error', (error: Error) => void);
client.on('databaseError', (error: Error) => void);
client.on('cacheError', (error: Error) => void);

// Performance events
client.on('slowQuery', (query: SlowQuery) => void);
client.on('memoryUsage', (usage: MemoryUsage) => void);

// Activity events
client.on('activityUpdate', (data: ActivityUpdate) => void);
```

## Type Definitions

### Core Types

```typescript
type DatabaseType = 'sqlite' | 'postgres';
type EventType = 'message' | 'voice' | 'reaction' | 'member';
type ExportFormat = 'json' | 'csv' | 'sql';
type CacheType = 'memory' | 'redis';
```

### Configuration Types

```typescript
interface CacheConfig {
  type: CacheType;
  size?: number;
  ttl?: number;
  host?: string;
  port?: number;
  keyPrefix?: string;
}

interface ProcessingConfig {
  batchSize?: number;
  batchTimeout?: number;
  maxBatches?: number;
  async?: boolean;
}

interface FilterConfig {
  allowedChannels?: string[];
  excludedChannels?: string[];
  excludedUsers?: string[];
  excludeBots?: boolean;
}

interface PrivacyConfig {
  storeContent?: boolean;
  hashUserIds?: boolean;
  retentionDays?: number;
}
```

### Data Types

```typescript
interface MessageEvent {
  id: string;
  userId: string;
  guildId: string;
  channelId: string;
  content: string;
  timestamp: number;
  attachmentCount: number;
  embedCount: number;
  messageType?: string;
  isBot?: boolean;
  isPinned?: boolean;
  referencedMessageId?: string;
  threadId?: string;
}

interface VoiceEvent {
  id: string;
  userId: string;
  guildId: string;
  channelId: string;
  action: 'join' | 'leave' | 'move';
  timestamp: number;
  duration?: number;
  previousChannelId?: string;
}

interface ReactionEvent {
  id: string;
  userId: string;
  guildId: string;
  channelId: string;
  messageId: string;
  action: 'add' | 'remove';
  emojiId?: string;
  emojiName: string;
  emojiAnimated?: boolean;
  timestamp: number;
}

interface MemberEvent {
  id: string;
  userId: string;
  guildId: string;
  action: 'join' | 'leave';
  timestamp: number;
}
```

## Error Types

```typescript
class WaforixError extends Error {
  code: string;
  details?: any;
}

class DatabaseError extends WaforixError {
  query?: string;
  params?: any[];
}

class ValidationError extends WaforixError {
  field: string;
  value: any;
}

class ConfigurationError extends WaforixError {
  option: string;
}
```

## Constants

```typescript
// Default values
export const DEFAULT_CACHE_SIZE = 10000;
export const DEFAULT_CACHE_TTL = 300000; // 5 minutes
export const DEFAULT_BATCH_SIZE = 1000;
export const DEFAULT_QUERY_LIMIT = 1000;

// Limits
export const MAX_BATCH_SIZE = 10000;
export const MAX_QUERY_LIMIT = 100000;
export const MAX_EXPORT_RECORDS = 1000000;

// Time constants
export const HOUR_MS = 60 * 60 * 1000;
export const DAY_MS = 24 * HOUR_MS;
export const WEEK_MS = 7 * DAY_MS;
export const MONTH_MS = 30 * DAY_MS;
```
