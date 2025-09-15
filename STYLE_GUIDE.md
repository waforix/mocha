# Waforix Style Guide

This document establishes consistent naming conventions and coding standards for the Waforix Discord bot library.

## Table of Contents

- [General Principles](#general-principles)
- [Naming Conventions](#naming-conventions)
- [Type Definitions](#type-definitions)
- [Constants and Enums](#constants-and-enums)
- [Class Design](#class-design)
- [File Organization](#file-organization)
- [API Integration](#api-integration)
- [Code Quality](#code-quality)

## General Principles

- **Consistency over personal preference** - Follow established patterns in the codebase
- **Clarity over brevity** - Use descriptive names that make code self-documenting
- **TypeScript-first** - Leverage TypeScript's type system for better developer experience
- **Strict linting** - Use Biome with strict rules for code quality enforcement

## Naming Conventions

### Variables and Functions
- **camelCase** for all variables, functions, and methods
- **Descriptive names** that clearly indicate purpose

```typescript
// ✅ Good
const userStatsCache = new LRUCache<UserStats>();
const createUserStatsKey = (guildId: string, userId: string) => `${guildId}:${userId}`;
async function getUserStats(guildId: string, userId: string): Promise<UserStats> {}

// ❌ Avoid
const cache = new LRUCache();
const key = (g: string, u: string) => `${g}:${u}`;
async function getStats(g: string, u: string) {}
```

### Classes and Types
- **PascalCase** for classes, interfaces, types, and enums
- **Descriptive names** that indicate the entity's purpose

```typescript
// ✅ Good
export class StatsClient extends EventEmitter {}
export interface NotificationRule {}
export type StatsEvent = MessageEvent | VoiceEvent;
export enum SlashCommandOptionType {}

// ❌ Avoid
export class Client {}
export interface Rule {}
export type Event = Msg | Voice;
```

### Files and Directories
- **camelCase** for file names (following existing pattern)
- **kebab-case** for multi-word concepts when needed
- **Descriptive names** that indicate file contents

```
// ✅ Current pattern
src/
  cache/
    manager.ts
    types.ts
    keys.ts
  builders/
    command.ts
    embed.ts
    message.ts
  notifications/
    engine.ts
    types.ts
```

### Constants
- **SCREAMING_SNAKE_CASE** for module-level constants
- **PascalCase** for constant objects with `as const` assertion

```typescript
// ✅ Good
export const GATEWAY_URL = 'wss://gateway.discord.gg/?v=10&encoding=json';

export const OPCODES = {
  DISPATCH: 0,
  HEARTBEAT: 1,
  IDENTIFY: 2,
} as const;

export const INTENTS = {
  GUILDS: 1 << 0,
  GUILD_MEMBERS: 1 << 1,
} as const;
```

## Type Definitions

### Interfaces vs Types
- **Interfaces** for object shapes that might be extended or implemented
- **Types** for unions, intersections, and computed types
- **Types** for string literals and template literals

```typescript
// ✅ Use interfaces for extensible object shapes
export interface BaseEvent {
  id: string;
  guildId: string;
  timestamp: Date;
  type: string;
}

export interface MessageEvent extends BaseEvent {
  userId: string;
  channelId: string;
}

// ✅ Use types for unions and computed types
export type StatsEvent = MessageEvent | VoiceEvent | MemberEvent;
export type NotificationType = 'threshold' | 'trend' | 'anomaly';
export type OperatorType = 'gt' | 'lt' | 'eq' | 'change';

// ✅ Use types for template literals
export type CacheKey = `${string}:${string}:${number}`;
export type EventType = `${string}_${string}`;
```

### String Literal Types
- **Define string literal types** for better type safety and consistency
- **Use template literal types** when combining strings

```typescript
// ✅ Good - provides autocomplete and prevents typos
export type VoiceAction = 'join' | 'leave' | 'move';
export type MemberAction = 'join' | 'leave';
export type PresenceStatus = 'online' | 'idle' | 'dnd' | 'offline';

// ✅ Template literals for dynamic keys
export type UserStatsKey = `${string}:${string}:${number}`;
export type HeatmapKey = `heatmap:${string}:${string | 'all'}:${number}`;
```

## Constants and Enums

### When to Use Each
- **`const` objects with `as const`** for most constant collections (current pattern)
- **Enums** only when you need reverse mapping or when values are computed
- **String literal types** for simple string constants

```typescript
// ✅ Preferred: const objects (current pattern)
export const EVENTS = {
  READY: 'READY',
  GUILD_CREATE: 'GUILD_CREATE',
  MESSAGE_CREATE: 'MESSAGE_CREATE',
} as const;

// ✅ Acceptable: enums for numeric values with meaning
export enum SlashCommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
}

// ✅ Simple string literals for small sets
export type ButtonStyle = 'primary' | 'secondary' | 'success' | 'danger' | 'link';
```

## Class Design

### Access Modifiers
- **Use explicit access modifiers** for clarity and intentionality
- **Private** for internal implementation details
- **Protected** for inheritance-intended members
- **Public** for external API (can be omitted as it's default)

```typescript
// ✅ Good - explicit access modifiers
export class StatsClient extends EventEmitter {
  private gateway: GatewayClient;
  private dispatcher: EventDispatcher;
  private cache: CacheManager;
  protected db: ReturnType<typeof getDb>;

  constructor(options: StatsClientOptions) {
    super();
    // ...
  }

  public async getUserStats(guildId: string, userId: string): Promise<UserStats> {
    // ...
  }

  private setupEventHandlers(): void {
    // ...
  }
}
```

### Builder Pattern
- **Fluent interfaces** with method chaining
- **Return `this`** for chainable methods
- **`build()` method** to create final object

```typescript
// ✅ Current pattern - continue this approach
export class EmbedBuilder {
  private embed: DiscordEmbed = {};

  setTitle(title: string): this {
    this.embed.title = title;
    return this;
  }

  setColor(color: number | string): this {
    // ...
    return this;
  }

  build(): DiscordEmbed {
    return { ...this.embed };
  }
}
```

## API Integration

### API Type Naming Convention

Since we work extensively with Discord's API, which uses `snake_case` and may have different field sets than our library types, we use a clear naming convention to distinguish between API types and library types.

#### API Types (Prefixed with `API`)
- **Prefix with `API`** to clearly indicate these match Discord's API structure
- **Use snake_case** field names to exactly match Discord's API
- **Include all fields** that Discord sends, even if we don't use them all
- **Mark optional fields** as optional to match API behavior

```typescript
// ✅ API types - exact match to Discord API
export interface APIChannel {
  id: string;
  type: number;
  guild_id?: string;
  name?: string;
  parent_id?: string;
  position?: number;
  permission_overwrites?: APIPermissionOverwrite[];
  rate_limit_per_user?: number;
  nsfw?: boolean;
  topic?: string;
  last_message_id?: string;
}

export interface APIGuild {
  id: string;
  name: string;
  icon?: string;
  owner_id: string;
  member_count?: number;
  verification_level: number;
  default_message_notifications: number;
  explicit_content_filter: number;
  // ... other Discord API fields
}

export interface APIMessage {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: APIUser;
  content: string;
  timestamp: string;
  edited_timestamp?: string;
  tts: boolean;
  mention_everyone: boolean;
  attachments: APIAttachment[];
  embeds: APIEmbed[];
}
```

#### Library Types (Clean, camelCase)
- **No prefix** - these are our primary types
- **Use camelCase** for better TypeScript/JavaScript ergonomics
- **Include only fields we actually use** in our library
- **Add computed or derived fields** that make sense for our use cases

```typescript
// ✅ Library types - optimized for our use
export interface Channel {
  id: string;
  type: number;
  guildId?: string;
  name?: string;
  parentId?: string;
  // Only include fields we actually use
}

export interface Guild {
  id: string;
  name: string;
  icon?: string;
  ownerId: string;
  memberCount?: number;
  // Simplified for our needs
}

export interface Message {
  id: string;
  channelId: string;
  guildId?: string;
  author: User;
  content: string;
  timestamp: Date; // Converted to Date object
  editedTimestamp?: Date;
  attachmentCount: number; // Computed field
  embedCount: number; // Computed field
}
```

### When to Use Each Type

#### Use API Types When:
- **Receiving data** from Discord's API
- **Sending data** to Discord's API
- **Storing raw API responses** temporarily
- **Type-checking API payloads**

#### Use Library Types When:
- **Internal processing** and business logic
- **Caching** processed data
- **Public API** of our library
- **Database storage** (with our schema)

### Transformation Functions
- **Clear naming** for API transformation functions
- **Consistent patterns** for converting between API and library types
- **Handle field name conversion** and type transformation

```typescript
// ✅ API to Library transformation
export function apiChannelToChannel(apiChannel: APIChannel): Channel {
  return {
    id: apiChannel.id,
    type: apiChannel.type,
    guildId: apiChannel.guild_id,
    name: apiChannel.name,
    parentId: apiChannel.parent_id,
  };
}

export function apiMessageToMessage(apiMessage: APIMessage): Message {
  return {
    id: apiMessage.id,
    channelId: apiMessage.channel_id,
    guildId: apiMessage.guild_id,
    author: apiUserToUser(apiMessage.author),
    content: apiMessage.content,
    timestamp: new Date(apiMessage.timestamp),
    editedTimestamp: apiMessage.edited_timestamp ? new Date(apiMessage.edited_timestamp) : undefined,
    attachmentCount: apiMessage.attachments.length,
    embedCount: apiMessage.embeds.length,
  };
}

// ✅ Library to API transformation (when needed)
export function channelToApiChannel(channel: Channel): Partial<APIChannel> {
  return {
    id: channel.id,
    type: channel.type,
    guild_id: channel.guildId,
    name: channel.name,
    parent_id: channel.parentId,
  };
}
```

### File Organization for API Types
```
src/
  types/
    api/           # API types (match Discord exactly)
      channel.ts
      guild.ts
      message.ts
      user.ts
    discord.ts     # Library types (our clean versions)
    events.ts      # Internal event types
    index.ts       # Re-exports
```

This dual-type system provides:
- **Type safety** when working with Discord's API
- **Clean interfaces** for our library's public API
- **Clear separation** between external API contracts and internal data structures
- **Flexibility** to evolve our internal types without breaking API compatibility

## Code Quality

### Biome Configuration
The project uses Biome with strict linting rules. Key enforced rules:

- **No unused imports** (`noUnusedImports: "error"`)
- **No unused variables** (`noUnusedVariables: "error"`)
- **Use const** for immutable values (`useConst: "error"`)
- **Use template literals** over concatenation (`useTemplate: "error"`)
- **No explicit any** (warning level)

### Import Organization
- **Group imports** by source (node modules, relative imports)
- **Use type imports** when importing only types
- **Consistent import styles**

```typescript
// ✅ Good import organization
import { EventEmitter } from 'node:events';
import { WebSocket } from 'ws';

import type { CacheConfig } from '../cache/index';
import { CacheManager, createHeatmapKey } from '../cache/index';
import type { GatewayOptions } from '../gateway/index';
import { GatewayClient } from '../gateway/index';
```

### Documentation
- **JSDoc comments** for public APIs
- **Inline comments** for complex logic
- **README examples** that reflect actual usage patterns

```typescript
/**
 * High-performance Discord statistics client with caching and analytics
 */
export class StatsClient extends EventEmitter {
  /**
   * Get user statistics for a specific guild and time period
   * @param guildId - Discord guild ID
   * @param userId - Discord user ID  
   * @param days - Number of days to look back (default: 30)
   * @returns Promise resolving to user statistics
   */
  async getUserStats(guildId: string, userId: string, days = 30): Promise<UserStats> {
    // Implementation...
  }
}
```

## Implementation Guidelines

### Adopting These Conventions

#### For New Code
- **Follow all conventions** from day one
- **Use the API/Library type pattern** for any Discord API interactions
- **Apply access modifiers** explicitly in all classes
- **Use string literal types** instead of loose strings where possible

#### For Existing Code
- **Gradual migration** - don't break everything at once
- **Focus on high-impact areas** first (public APIs, frequently used types)
- **Update during regular maintenance** rather than dedicated refactoring
- **Maintain backward compatibility** during transitions

### Quick Reference Checklist

When writing new code, ask:

- [ ] Are variable/function names in camelCase?
- [ ] Are class/type names in PascalCase?
- [ ] Are constants in SCREAMING_SNAKE_CASE or const objects?
- [ ] Do API types have the `API` prefix and use snake_case?
- [ ] Do library types use camelCase and only include needed fields?
- [ ] Are access modifiers explicit in classes?
- [ ] Are string literals used instead of loose strings?
- [ ] Are imports organized and using type imports where appropriate?
- [ ] Is the code following Biome's linting rules?

### Examples of Current Code That Follows These Patterns

The codebase already demonstrates many of these patterns:

```typescript
// ✅ Good constant patterns (already in use)
export const OPCODES = {
  DISPATCH: 0,
  HEARTBEAT: 1,
} as const;

// ✅ Good class design (already in use)
export class StatsClient extends EventEmitter {
  private gateway: GatewayClient;
  private cache: CacheManager;

  constructor(options: StatsClientOptions) {
    // ...
  }
}

// ✅ Good builder pattern (already in use)
export class EmbedBuilder {
  private embed: DiscordEmbed = {};

  setTitle(title: string): this {
    this.embed.title = title;
    return this;
  }
}

// ✅ Good string literal usage (already in use)
export interface VoiceEvent extends BaseEvent {
  action: 'join' | 'leave' | 'move';
}
```

### Areas for Potential Improvement

Based on the current codebase, consider these improvements over time:

1. **API Type Separation**: Current `discord.ts` types could be split into API and library versions
2. **Access Modifiers**: Some classes could benefit from explicit access modifiers
3. **String Literal Types**: Some loose strings could become string literal types
4. **Type vs Interface**: Review current interface usage for potential type conversions

### Tools and Automation

- **Biome** handles formatting and many style rules automatically
- **TypeScript strict mode** catches many naming and type issues
- **IDE extensions** can help with consistent naming
- **Pre-commit hooks** can enforce style rules

---

This style guide should be followed for all new code and can be used as a reference when refactoring existing code. The patterns established here reflect the current codebase while incorporating your preferences for consistency and clarity.

Remember: **Consistency is more important than perfection**. It's better to have a consistently applied imperfect standard than an inconsistently applied perfect one.
