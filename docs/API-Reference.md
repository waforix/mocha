# API Reference

Complete API reference for @waforix/mocha classes, interfaces, and functions.

## Client

The main client class for @waforix/mocha.

### Constructor

```typescript
new Client(options: ClientOptions)
```

### ClientOptions

```typescript
interface ClientOptions {
  token: string;                    // Discord bot token
  database: DatabaseConfig;         // Database configuration
  cache?: CacheConfig;             // Cache configuration
  enableMetrics?: boolean;         // Enable metrics collection
  enableNotifications?: boolean;   // Enable notifications
  enableRateLimit?: boolean;       // Enable rate limiting
  intents?: number[];              // Discord intents
  shards?: number | number[] | 'auto'; // Sharding configuration
}
```

### Methods

#### Connection Management

```typescript
connect(): Promise<void>
disconnect(): Promise<void>
```

#### Manager Access

```typescript
getAutocompleteManager(): AutocompleteManager
getCommandHandlerManager(): CommandHandlerManager
getDatabase(): Promise<DatabaseInstance>
```

#### Statistics

```typescript
getUserStats(guildId: string, userId: string, days?: number): Promise<UserStats>
getGuildStats(guildId: string, days?: number): Promise<GuildStats>
getLeaderboard(guildId: string, type: 'messages' | 'voice', limit?: number, days?: number): Promise<LeaderboardEntry[]>
getActivityHeatmap(guildId: string, userId?: string, days?: number): Promise<HeatmapData>
```

#### Data Export

```typescript
exportData(options: ExportOptions): Promise<ExportData>
```

#### Cache Management

```typescript
getCacheStats(): CacheStats
clearCache(): void
```

#### Presence Management

```typescript
setStatus(status: 'online' | 'idle' | 'dnd' | 'invisible'): void
setActivity(name: string, type?: number, url?: string): void
clearActivity(): void
updatePresence(presence: PresenceData): void
```

#### Utility Methods

```typescript
getMetrics(): Metrics | undefined
getNotificationEngine(): NotificationEngine | undefined
getRateLimitManager(): RateLimitManager | undefined
isRateLimited(key: string, tokens?: number): boolean
```

### Events

```typescript
client.on('ready', () => void)
client.on('error', (error: Error) => void)
client.on('eventProcessed', (event: string, data: any) => void)
client.on('processingError', (error: Error, event: string, data: any) => void)
client.on('gatewayError', (error: Error) => void)
```

## Command System

### SlashCommandBuilder

```typescript
class SlashCommandBuilder {
  constructor(name: string, description: string)
  
  // Option methods
  addStringOption(name: string, description: string, required?: boolean): SlashCommandOptionBuilder
  addIntegerOption(name: string, description: string, required?: boolean): SlashCommandOptionBuilder
  addNumberOption(name: string, description: string, required?: boolean): SlashCommandOptionBuilder
  addBooleanOption(name: string, description: string, required?: boolean): SlashCommandOptionBuilder
  addUserOption(name: string, description: string, required?: boolean): SlashCommandOptionBuilder
  addChannelOption(name: string, description: string, required?: boolean): SlashCommandOptionBuilder
  addRoleOption(name: string, description: string, required?: boolean): SlashCommandOptionBuilder
  addMentionableOption(name: string, description: string, required?: boolean): SlashCommandOptionBuilder
  addAttachmentOption(name: string, description: string, required?: boolean): SlashCommandOptionBuilder
  
  // Subcommand methods
  addSubcommand(name: string, description: string): SlashCommandSubcommandBuilder
  addSubcommandGroup(name: string, description: string): SlashCommandSubcommandGroupBuilder
  
  build(): SlashCommand
}
```

### SlashCommandOptionBuilder

```typescript
class SlashCommandOptionBuilder {
  setRequired(required: boolean): this
  addChoice(name: string, value: string | number): this
  addChoices(choices: SlashCommandChoice[]): this
  setMinValue(min: number): this
  setMaxValue(max: number): this
  setMinMaxValue(min: number, max: number): this
  setAutocomplete(autocomplete: boolean): this
  build(): SlashCommandOption
}
```

### CommandHandlerManager

```typescript
class CommandHandlerManager {
  register(commandName: string, handler: CommandHandler): void
  unregister(commandName: string): boolean
  get(commandName: string): CommandHandler | undefined
  handleCommand(interaction: any): Promise<any>
  clear(): void
  getRegistrations(): CommandHandlerRegistration[]
}
```

### CommandHandler

```typescript
interface CommandHandler {
  execute(interaction: any): Promise<any>
}
```

## Autocomplete System

### AutocompleteManager

```typescript
class AutocompleteManager {
  register(commandName: string, optionName: string, handler: AutocompleteHandler): void
  handleAutocomplete(interaction: any): Promise<AutocompleteResponse>
}
```

### AutocompleteHandler

```typescript
type AutocompleteHandler = (
  query: string,
  context: AutocompleteContext
) => Promise<AutocompleteChoice[]> | AutocompleteChoice[]
```

### AutocompleteChoice

```typescript
interface AutocompleteChoice {
  name: string;
  value: string | number;
}
```

### AutocompleteContext

```typescript
interface AutocompleteContext {
  guildId?: string;
  channelId?: string;
  userId?: string;
}
```

### Helper Functions

```typescript
function createStaticChoices(choices: AutocompleteChoice[]): AutocompleteHandler
function createFilteredChoices(
  choices: AutocompleteChoice[],
  filterFn?: (choice: AutocompleteChoice, query: string) => boolean
): AutocompleteHandler
function createAsyncChoices(
  fetchFn: (query: string, context: AutocompleteContext) => Promise<AutocompleteChoice[]>
): AutocompleteHandler
function createAsyncChoicesHandler(
  fetchFn: (guildId: string, query: string) => Promise<Array<{ name: string; value: string }>>
): AutocompleteHandler
```

## Database Types

### DatabaseConfig

```typescript
// SQLite
interface SQLiteConfig {
  type: 'sqlite';
  path: string;
  options?: {
    busyTimeout?: number;
    journal?: string;
    synchronous?: string;
    cacheSize?: number;
    tempStore?: string;
  };
}

// PostgreSQL
interface PostgreSQLConfig {
  type: 'postgres';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean | object;
  pool?: {
    min?: number;
    max?: number;
    acquireTimeoutMillis?: number;
    idleTimeoutMillis?: number;
  };
  options?: object;
}

// MySQL
interface MySQLConfig {
  type: 'mysql';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean | object;
  pool?: {
    min?: number;
    max?: number;
    acquireTimeoutMillis?: number;
    idleTimeoutMillis?: number;
  };
  options?: object;
}

type DatabaseConfig = SQLiteConfig | PostgreSQLConfig | MySQLConfig;
```

## Statistics Types

### UserStats

```typescript
interface UserStats {
  userId: string;
  username?: string;
  messageCount: number;
  voiceTime: number; // in minutes
  voiceSessions: number;
  attachments: number;
  embeds: number;
  rank?: number;
}
```

### GuildStats

```typescript
interface GuildStats {
  guildId: string;
  totalMessages: number;
  totalVoiceTime: number;
  activeUsers: number;
  topChannels: Array<{
    channelId: string;
    name?: string;
    messageCount: number;
    uniqueUsers: number;
  }>;
  memberGrowth: {
    joins: Array<{ date: string; joins: number }>;
    leaves: Array<{ date: string; leaves: number }>;
  };
}
```

### LeaderboardEntry

```typescript
interface LeaderboardEntry {
  rank: number;
  userId: string;
  username?: string;
  value: number; // messageCount for messages, voiceTime for voice
}
```

## Cache Types

### CacheConfig

```typescript
interface CacheConfig {
  userStatsSize?: number;
  guildStatsSize?: number;
  leaderboardSize?: number;
  ttlMs?: number;
}
```

### CacheStats

```typescript
interface CacheStats {
  userStats: number;
  guildStats: number;
  leaderboards: number;
  queries: number;
}
```

## Export Types

### ExportOptions

```typescript
interface ExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  guildId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  includeUsers?: boolean;
  includeChannels?: boolean;
  includeMessages?: boolean;
  includeVoice?: boolean;
  includeMembers?: boolean;
}
```

### ExportData

```typescript
interface ExportData {
  metadata: {
    guildId: string;
    exportDate: Date;
    dateRange: {
      start: Date;
      end: Date;
    };
    recordCount: number;
  };
  users?: Array<{
    id: string;
    username: string;
    messageCount: number;
    voiceTime: number;
    joinDate?: Date;
  }>;
  channels?: Array<{
    id: string;
    name: string;
    messageCount: number;
    uniqueUsers: number;
  }>;
  // ... other data arrays
}
```

## Builder Types

### EmbedBuilder

```typescript
class EmbedBuilder {
  setTitle(title: string): this
  setDescription(description: string): this
  setColor(color: number): this
  setTimestamp(timestamp?: Date): this
  setFooter(text: string, iconURL?: string): this
  setImage(url: string): this
  setThumbnail(url: string): this
  setAuthor(name: string, iconURL?: string, url?: string): this
  addField(name: string, value: string, inline?: boolean): this
  addFields(...fields: EmbedField[]): this
  setURL(url: string): this
  build(): Embed
}
```

### MessageBuilder

```typescript
class MessageBuilder {
  setContent(content: string): this
  addEmbed(embed: Embed): this
  addEmbeds(...embeds: Embed[]): this
  setEphemeral(ephemeral: boolean): this
  addComponent(component: MessageComponent): this
  addComponents(...components: MessageComponent[]): this
  build(): MessageData
}
```

## Constants

### INTENTS

```typescript
export const INTENTS = {
  GUILDS: 1 << 0,
  GUILD_MEMBERS: 1 << 1,
  GUILD_MODERATION: 1 << 2,
  GUILD_EMOJIS_AND_STICKERS: 1 << 3,
  GUILD_INTEGRATIONS: 1 << 4,
  GUILD_WEBHOOKS: 1 << 5,
  GUILD_INVITES: 1 << 6,
  GUILD_VOICE_STATES: 1 << 7,
  GUILD_PRESENCES: 1 << 8,
  GUILD_MESSAGES: 1 << 9,
  GUILD_MESSAGE_REACTIONS: 1 << 10,
  GUILD_MESSAGE_TYPING: 1 << 11,
  DIRECT_MESSAGES: 1 << 12,
  DIRECT_MESSAGE_REACTIONS: 1 << 13,
  DIRECT_MESSAGE_TYPING: 1 << 14,
  MESSAGE_CONTENT: 1 << 15,
  GUILD_SCHEDULED_EVENTS: 1 << 16,
  AUTO_MODERATION_CONFIGURATION: 1 << 20,
  AUTO_MODERATION_EXECUTION: 1 << 21
};
```

## Error Types

### ClientError

```typescript
class ClientError extends Error {
  code: string;
  details?: any;
}
```

### DatabaseError

```typescript
class DatabaseError extends Error {
  query?: string;
  parameters?: any[];
}
```

### ValidationError

```typescript
class ValidationError extends Error {
  field: string;
  value: any;
}
```

For more detailed examples and usage patterns, see the specific guides:

- [Getting Started](https://github.com/waforix/mocha/wiki/Getting-Started)
- [Client Configuration](https://github.com/waforix/mocha/wiki/Client-Configuration)
- [Command System](https://github.com/waforix/mocha/wiki/Command-System)
- [Autocomplete System](https://github.com/waforix/mocha/wiki/Autocomplete-System)
