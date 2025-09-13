# Code Style Guide

This document outlines the coding standards and conventions for Mocha.

## Core Principles

### 1. Component-Based Architecture
- **Small files** - Maximum 50 lines per file when possible
- **Single responsibility** - Each file should have one clear purpose
- **Focused modules** - Break functionality into specialized components
- **Clear boundaries** - Well-defined interfaces between components

### 2. Self-Documenting Code
- **Minimal comments** - Code should be readable without extensive comments
- **Descriptive names** - Use clear, descriptive variable and function names
- **Consistent patterns** - Follow established patterns throughout the codebase
- **Logical structure** - Organize code in a logical, predictable manner

### 3. Performance First
- **Efficient algorithms** - Choose optimal data structures and algorithms
- **Memory conscious** - Avoid unnecessary object creation and memory leaks
- **Database optimized** - Write efficient queries and use proper indexing
- **Cache friendly** - Design for effective caching strategies

## TypeScript Standards

### Type Safety

```typescript
// ✅ Good: Explicit types and strict mode
interface UserStats {
  userId: string;
  messageCount: number;
  voiceTime: number;
}

async function getUserStats(guildId: string, userId: string): Promise<UserStats> {
  // Implementation
}

// ❌ Bad: Any types and implicit returns
function getUserStats(guildId: any, userId: any) {
  // Implementation
}
```

### Interface Design

```typescript
// ✅ Good: Use interfaces for object shapes
interface CacheConfig {
  userStatsSize?: number;
  guildStatsSize?: number;
  ttlMs?: number;
}

// ✅ Good: Extend interfaces for related types
interface StatsClientOptions extends GatewayOptions {
  dbPath?: string;
  cache?: CacheConfig;
}

// ❌ Bad: Use type aliases for simple object shapes
type CacheConfig = {
  userStatsSize?: number;
  guildStatsSize?: number;
  ttlMs?: number;
};
```

### Error Handling

```typescript
// ✅ Good: Specific error types and proper handling
class DatabaseError extends Error {
  constructor(message: string, public readonly query?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

async function executeQuery(query: string): Promise<unknown[]> {
  try {
    return await db.execute(query);
  } catch (error) {
    throw new DatabaseError(`Query failed: ${error.message}`, query);
  }
}

// ❌ Bad: Generic error handling
async function executeQuery(query: string) {
  try {
    return await db.execute(query);
  } catch (error) {
    throw error;
  }
}
```

## File Organization

### Directory Structure

```
src/
├── cache/              # Caching components
│   ├── index.ts       # Public exports
│   ├── lru.ts         # LRU cache implementation
│   ├── manager.ts     # Cache manager
│   ├── keys.ts        # Key generation utilities
│   └── types.ts       # Cache-related types
├── db/                # Database components
│   ├── index.ts       # Database connection and exports
│   ├── connection.ts  # Connection management
│   └── schema/        # Database schemas
└── ...
```

### File Naming

- **kebab-case** for file names: `cache-manager.ts`, `user-stats.ts`
- **PascalCase** for class files: `StatsClient.ts`, `EventDispatcher.ts`
- **camelCase** for utility files: `dateUtils.ts`, `keyGenerator.ts`
- **index.ts** for directory exports

### Export Patterns

```typescript
// ✅ Good: Named exports with re-exports in index.ts
// cache/manager.ts
export class CacheManager {
  // Implementation
}

// cache/index.ts
export * from './manager';
export * from './lru';
export * from './types';

// ❌ Bad: Default exports
export default class CacheManager {
  // Implementation
}
```

## Code Formatting

### Biome Configuration

We use Biome for consistent code formatting:

```json
{
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error"
      },
      "style": {
        "useConst": "error",
        "useTemplate": "error"
      }
    }
  }
}
```

### Code Style Rules

**Indentation:**
```typescript
// ✅ Good: 2 spaces
if (condition) {
  doSomething();
}

// ❌ Bad: 4 spaces or tabs
if (condition) {
    doSomething();
}
```

**Line Length:**
```typescript
// ✅ Good: Under 100 characters
const result = await client.getUserStats(guildId, userId, days);

// ✅ Good: Break long lines logically
const result = await client.getUserStats(
  guildId,
  userId,
  days
);

// ❌ Bad: Over 100 characters
const result = await client.getUserStats(guildId, userId, days, includeVoice, includeMessages, includePresence);
```

**Object and Array Formatting:**
```typescript
// ✅ Good: Consistent formatting
const config = {
  userStatsSize: 1000,
  guildStatsSize: 100,
  ttlMs: 300000,
};

const users = [
  'user1',
  'user2',
  'user3',
];

// ❌ Bad: Inconsistent formatting
const config = { userStatsSize: 1000, guildStatsSize: 100,
  ttlMs: 300000 };
```

## Naming Conventions

### Variables and Functions

```typescript
// ✅ Good: Descriptive camelCase
const userStatsCache = new Map();
const messageCount = await getMessageCount();

function calculateVoiceTime(sessions: VoiceSession[]): number {
  // Implementation
}

// ❌ Bad: Abbreviated or unclear names
const usrCache = new Map();
const msgCnt = await getMsgCnt();

function calcVT(sessions: any[]): number {
  // Implementation
}
```

### Classes and Interfaces

```typescript
// ✅ Good: PascalCase with descriptive names
class StatsAggregator {
  // Implementation
}

interface UserStatistics {
  userId: string;
  messageCount: number;
}

// ❌ Bad: Unclear or abbreviated names
class SA {
  // Implementation
}

interface UsrStats {
  id: string;
  msgs: number;
}
```

### Constants

```typescript
// ✅ Good: SCREAMING_SNAKE_CASE for constants
const MAX_CACHE_SIZE = 1000;
const DEFAULT_TTL_MS = 300000;

const INTENTS = {
  GUILDS: 1 << 0,
  GUILD_MESSAGES: 1 << 9,
} as const;

// ❌ Bad: camelCase for constants
const maxCacheSize = 1000;
const defaultTtl = 300000;
```

## Performance Guidelines

### Efficient Iterations

```typescript
// ✅ Good: Direct iteration for cache invalidation
for (const key of cache.keys()) {
  if (key.startsWith(prefix)) {
    cache.delete(key);
  }
}

// ❌ Bad: Array methods that create temporary arrays
const keysToDelete = Array.from(cache.keys()).filter(key => 
  key.startsWith(prefix)
);
keysToDelete.forEach(key => cache.delete(key));
```

### Memory Management

```typescript
// ✅ Good: Reuse objects and avoid unnecessary allocations
const dateCache = new Map<number, Date>();

function getDateSince(days: number): Date {
  if (!dateCache.has(days)) {
    dateCache.set(days, new Date(Date.now() - days * 24 * 60 * 60 * 1000));
  }
  return dateCache.get(days)!;
}

// ❌ Bad: Create new objects unnecessarily
function getDateSince(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}
```

### Database Queries

```typescript
// ✅ Good: Use proper indexes and batch operations
const results = await db.select()
  .from(messageEvents)
  .where(and(
    eq(messageEvents.guildId, guildId),
    gte(messageEvents.createdAt, since)
  ));

// ❌ Bad: Inefficient queries without proper indexing
const results = await db.select()
  .from(messageEvents)
  .where(sql`guild_id = ${guildId} AND DATE(created_at) >= DATE('now', '-30 days')`);
```

## Error Handling Patterns

### Async Error Handling

```typescript
// ✅ Good: Proper error handling with specific types
async function getUserStats(guildId: string, userId: string): Promise<UserStats> {
  try {
    const result = await db.query.getUserStats(guildId, userId);
    return result;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw new Error(`Failed to get user stats: ${error.message}`);
    }
    throw error;
  }
}

// ❌ Bad: Generic error handling
async function getUserStats(guildId: string, userId: string) {
  try {
    return await db.query.getUserStats(guildId, userId);
  } catch (error) {
    console.error(error);
    return null;
  }
}
```

### Validation

```typescript
// ✅ Good: Input validation with clear error messages
function validateGuildId(guildId: string): void {
  if (!guildId || typeof guildId !== 'string') {
    throw new Error('Guild ID must be a non-empty string');
  }
  if (!/^\d+$/.test(guildId)) {
    throw new Error('Guild ID must contain only digits');
  }
}

// ❌ Bad: No validation or unclear errors
function validateGuildId(guildId: any): void {
  if (!guildId) {
    throw new Error('Invalid guild ID');
  }
}
```

## Testing Patterns

### Test Structure

```typescript
// ✅ Good: Clear test structure with descriptive names
describe('CacheManager', () => {
  describe('getUserStats', () => {
    it('should return cached user stats when available', async () => {
      // Arrange
      const manager = new CacheManager();
      const expectedStats = { userId: '123', messageCount: 100 };
      manager.setUserStats('guild1', '123', 30, expectedStats);

      // Act
      const result = manager.getUserStats('guild1', '123', 30);

      // Assert
      expect(result).toEqual(expectedStats);
    });
  });
});

// ❌ Bad: Unclear test structure
describe('Cache', () => {
  it('works', () => {
    const cache = new CacheManager();
    cache.setUserStats('g1', 'u1', 30, { userId: 'u1', messageCount: 1 });
    expect(cache.getUserStats('g1', 'u1', 30)).toBeTruthy();
  });
});
```

## Documentation Standards

### JSDoc Comments

Use JSDoc only for complex public APIs:

```typescript
/**
 * Retrieves user statistics for a specific guild and time period.
 * 
 * @param guildId - Discord guild ID
 * @param userId - Discord user ID  
 * @param days - Number of days to look back (default: 30)
 * @returns Promise resolving to user statistics
 * @throws {Error} When guild or user ID is invalid
 */
async getUserStats(guildId: string, userId: string, days = 30): Promise<UserStats> {
  // Implementation
}
```

### README Documentation

Keep README concise and link to detailed docs:

```markdown
## Quick Start

```typescript
import { StatsClient } from 'mocha';

const client = new StatsClient({ token: 'your-token' });
await client.connect();
```

For detailed documentation, see [docs/](./docs/).
```
