# Event Tracking

Waforix provides comprehensive event tracking for Discord servers, capturing messages, voice activity, reactions, and member events.

## Overview

The event tracking system is designed to be:
- **Non-intrusive**: Minimal impact on bot performance
- **Comprehensive**: Captures all relevant Discord events
- **Flexible**: Configurable tracking options
- **Privacy-focused**: Respects user privacy settings

## Message Events

### Basic Message Tracking
```typescript
await client.trackMessage({
  id: 'message_id',
  userId: 'user_id',
  guildId: 'guild_id',
  channelId: 'channel_id',
  content: 'Hello world!',
  timestamp: Date.now(),
  attachmentCount: 0,
  embedCount: 1
});
```

### Advanced Message Tracking
```typescript
await client.trackMessage({
  id: 'message_id',
  userId: 'user_id',
  guildId: 'guild_id',
  channelId: 'channel_id',
  content: 'Check out this image!',
  timestamp: Date.now(),
  attachmentCount: 1,
  embedCount: 0,
  // Optional fields
  messageType: 'DEFAULT',
  isBot: false,
  isPinned: false,
  referencedMessageId: 'replied_message_id', // For replies
  threadId: 'thread_id' // If in a thread
});
```

### Message Event Properties
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique message ID |
| `userId` | string | ✅ | Author's user ID |
| `guildId` | string | ✅ | Server ID |
| `channelId` | string | ✅ | Channel ID |
| `content` | string | ✅ | Message content |
| `timestamp` | number | ✅ | Unix timestamp |
| `attachmentCount` | number | ✅ | Number of attachments |
| `embedCount` | number | ✅ | Number of embeds |
| `messageType` | string | ❌ | Message type |
| `isBot` | boolean | ❌ | Is author a bot |
| `isPinned` | boolean | ❌ | Is message pinned |
| `referencedMessageId` | string | ❌ | Replied message ID |
| `threadId` | string | ❌ | Thread ID if applicable |

## Voice Events

### Voice Session Tracking
```typescript
await client.trackVoice({
  id: 'session_id',
  userId: 'user_id',
  guildId: 'guild_id',
  channelId: 'voice_channel_id',
  action: 'join', // 'join', 'leave', 'move'
  timestamp: Date.now(),
  duration: 0 // For leave events
});
```

### Voice Event Types
- **Join**: User joins a voice channel
- **Leave**: User leaves a voice channel (includes duration)
- **Move**: User moves between voice channels

### Voice Event Properties
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique session ID |
| `userId` | string | ✅ | User ID |
| `guildId` | string | ✅ | Server ID |
| `channelId` | string | ✅ | Voice channel ID |
| `action` | string | ✅ | 'join', 'leave', 'move' |
| `timestamp` | number | ✅ | Unix timestamp |
| `duration` | number | ❌ | Session duration (for leave) |
| `previousChannelId` | string | ❌ | Previous channel (for move) |

## Reaction Events

### Reaction Tracking
```typescript
await client.trackReaction({
  id: 'reaction_id',
  userId: 'user_id',
  guildId: 'guild_id',
  channelId: 'channel_id',
  messageId: 'message_id',
  action: 'add', // 'add' or 'remove'
  emojiId: 'emoji_id',
  emojiName: '👍',
  emojiAnimated: false,
  timestamp: Date.now()
});
```

### Reaction Event Properties
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique reaction ID |
| `userId` | string | ✅ | User who reacted |
| `guildId` | string | ✅ | Server ID |
| `channelId` | string | ✅ | Channel ID |
| `messageId` | string | ✅ | Message that was reacted to |
| `action` | string | ✅ | 'add' or 'remove' |
| `emojiId` | string | ❌ | Custom emoji ID |
| `emojiName` | string | ✅ | Emoji name or unicode |
| `emojiAnimated` | boolean | ❌ | Is animated emoji |
| `timestamp` | number | ✅ | Unix timestamp |

## Member Events

### Member Join/Leave Tracking
```typescript
await client.trackMember({
  id: 'event_id',
  userId: 'user_id',
  guildId: 'guild_id',
  action: 'join', // 'join' or 'leave'
  timestamp: Date.now()
});
```

### Member Event Properties
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique event ID |
| `userId` | string | ✅ | User ID |
| `guildId` | string | ✅ | Server ID |
| `action` | string | ✅ | 'join' or 'leave' |
| `timestamp` | number | ✅ | Unix timestamp |

## Automatic Event Processing

### Discord.js Integration
```typescript
import { Client, GatewayIntentBits } from 'discord.js';
import { StatsClient } from 'waforix';

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ]
});

const stats = new StatsClient({
  database: { type: 'sqlite', path: './stats.db' }
});

// Message events
discord.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  await stats.trackMessage({
    id: message.id,
    userId: message.author.id,
    guildId: message.guild?.id || '',
    channelId: message.channel.id,
    content: message.content,
    timestamp: message.createdTimestamp,
    attachmentCount: message.attachments.size,
    embedCount: message.embeds.length
  });
});

// Voice state events
discord.on('voiceStateUpdate', async (oldState, newState) => {
  const userId = newState.id;
  const guildId = newState.guild.id;
  
  if (!oldState.channelId && newState.channelId) {
    // User joined voice
    await stats.trackVoice({
      id: `${userId}-${Date.now()}`,
      userId,
      guildId,
      channelId: newState.channelId,
      action: 'join',
      timestamp: Date.now()
    });
  } else if (oldState.channelId && !newState.channelId) {
    // User left voice
    await stats.trackVoice({
      id: `${userId}-${Date.now()}`,
      userId,
      guildId,
      channelId: oldState.channelId,
      action: 'leave',
      timestamp: Date.now()
    });
  }
});

// Reaction events
discord.on('messageReactionAdd', async (reaction, user) => {
  await stats.trackReaction({
    id: `${reaction.message.id}-${user.id}-${Date.now()}`,
    userId: user.id,
    guildId: reaction.message.guild?.id || '',
    channelId: reaction.message.channel.id,
    messageId: reaction.message.id,
    action: 'add',
    emojiId: reaction.emoji.id,
    emojiName: reaction.emoji.name || '',
    emojiAnimated: reaction.emoji.animated || false,
    timestamp: Date.now()
  });
});
```

## Event Filtering

### Channel Filtering
```typescript
const client = new StatsClient({
  database: { type: 'sqlite', path: './stats.db' },
  filters: {
    // Only track specific channels
    allowedChannels: ['channel_id_1', 'channel_id_2'],
    // Or exclude specific channels
    excludedChannels: ['spam_channel_id']
  }
});
```

### User Filtering
```typescript
const client = new StatsClient({
  database: { type: 'sqlite', path: './stats.db' },
  filters: {
    // Exclude bots
    excludeBots: true,
    // Exclude specific users
    excludedUsers: ['bot_user_id', 'spam_user_id']
  }
});
```

## Privacy Considerations

### Content Handling
By default, Waforix stores message content for analytics. For privacy:

```typescript
const client = new StatsClient({
  database: { type: 'sqlite', path: './stats.db' },
  privacy: {
    storeContent: false,     // Don't store message content
    hashUserIds: true,       // Hash user IDs
    retentionDays: 90        // Auto-delete old data
  }
});
```

### GDPR Compliance
```typescript
// Delete all data for a specific user
await client.deleteUserData('user_id');

// Export user data
const userData = await client.exportUserData('user_id');
```

## Performance Optimization

### Batch Processing
```typescript
// Process events in batches for better performance
const events = [
  { type: 'message', data: messageData1 },
  { type: 'message', data: messageData2 },
  { type: 'voice', data: voiceData1 }
];

await client.batchTrackEvents(events);
```

### Async Processing
```typescript
// Use async processing to avoid blocking
const client = new StatsClient({
  database: { type: 'sqlite', path: './stats.db' },
  processing: {
    async: true,           // Process events asynchronously
    batchSize: 100,        // Batch size for processing
    flushInterval: 5000    // Flush interval in ms
  }
});
```

## Error Handling

### Graceful Degradation
```typescript
try {
  await client.trackMessage(messageData);
} catch (error) {
  console.error('Failed to track message:', error);
  // Continue bot operation even if tracking fails
}
```

### Event Validation
```typescript
const client = new StatsClient({
  database: { type: 'sqlite', path: './stats.db' },
  validation: {
    strict: true,          // Strict validation
    skipInvalid: true      // Skip invalid events instead of throwing
  }
});
```
