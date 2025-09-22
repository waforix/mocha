# Autocomplete System

@waforix/mocha provides a powerful and flexible autocomplete system for Discord slash commands, enabling dynamic suggestions based on user input and context.

## Overview

The autocomplete system consists of:

- **AutocompleteManager** - Manages autocomplete handlers
- **AutocompleteHandler** - Functions that generate suggestions
- **Helper Functions** - Utilities for creating common autocomplete patterns

## Basic Setup

### Enable Autocomplete on Commands

First, enable autocomplete on your command options:

```typescript
import { SlashCommandBuilder } from '@waforix/mocha';

const searchCommand = new SlashCommandBuilder('search', 'Search for users or channels')
  .addStringOption('query', 'Search query', true)
    .setAutocomplete(true); // Enable autocomplete
```

### Register Autocomplete Handler

```typescript
import { Client } from '@waforix/mocha';

const client = new Client({ /* config */ });

// Register autocomplete handler
client.getAutocompleteManager().register('search', 'query', async (query, context) => {
  // Return array of choices
  return [
    { name: 'Option 1', value: 'option1' },
    { name: 'Option 2', value: 'option2' }
  ];
});
```

## Autocomplete Handlers

### Static Choices

For fixed lists of options:

```typescript
import { createStaticChoices } from '@waforix/mocha';

const timeframes = [
  { name: '7 days', value: '7' },
  { name: '30 days', value: '30' },
  { name: '90 days', value: '90' },
  { name: 'All time', value: 'all' }
];

client.getAutocompleteManager().register(
  'stats', 
  'timeframe', 
  createStaticChoices(timeframes)
);
```

### Filtered Choices

For searchable static lists:

```typescript
import { createFilteredChoices } from '@waforix/mocha';

const categories = [
  { name: 'General Discussion', value: 'general' },
  { name: 'Gaming', value: 'gaming' },
  { name: 'Music', value: 'music' },
  { name: 'Technology', value: 'tech' },
  { name: 'Art & Design', value: 'art' }
];

client.getAutocompleteManager().register(
  'category',
  'name',
  createFilteredChoices(categories)
);
```

### Custom Filter Function

```typescript
const customFilter = (choice, query) => {
  // Custom matching logic
  return choice.name.toLowerCase().startsWith(query.toLowerCase()) ||
         choice.value.includes(query);
};

client.getAutocompleteManager().register(
  'command',
  'option',
  createFilteredChoices(choices, customFilter)
);
```

### Dynamic/Async Choices

For database-driven or API-based suggestions:

```typescript
import { createAsyncChoices } from '@waforix/mocha';

client.getAutocompleteManager().register(
  'user',
  'search',
  createAsyncChoices(async (query, context) => {
    if (!context.guildId || query.length < 2) {
      return [];
    }

    // Get leaderboard data to find active users
    const leaderboard = await client.getLeaderboard(context.guildId, 'messages', 25);

    return leaderboard
      .filter(user => user.username.toLowerCase().includes(query.toLowerCase()))
      .map(user => ({
        name: `${user.username} (${user.messageCount} messages)`,
        value: user.userId
      }));
  })
);
```

## Advanced Patterns

### Context-Aware Autocomplete

Use the context object to provide relevant suggestions:

```typescript
client.getAutocompleteManager().register('channel', 'name', async (query, context) => {
  if (!context.guildId) return [];
  
  // Get channels from the current guild
  const channels = await getGuildChannels(context.guildId);
  
  return channels
    .filter(channel => 
      channel.name.toLowerCase().includes(query.toLowerCase())
    )
    .map(channel => ({
      name: `#${channel.name}`,
      value: channel.id
    }))
    .slice(0, 25); // Discord limit
});
```

### User Search with Statistics

```typescript
client.getAutocompleteManager().register('stats', 'user', async (query, context) => {
  if (!context.guildId || query.length < 2) {
    return [];
  }

  try {
    // Get active users from leaderboard
    const leaderboard = await client.getLeaderboard(context.guildId, 'messages', 25);

    return leaderboard
      .filter(user => user.username.toLowerCase().includes(query.toLowerCase()))
      .map(user => ({
        name: `${user.username} (${user.messageCount} messages)`,
        value: user.userId
      }));
  } catch (error) {
    console.error('User autocomplete error:', error);
    return [];
  }
});
```

### Command-Specific Logic

```typescript
client.getAutocompleteManager().register('config', 'setting', async (query, context) => {
  const availableSettings = [
    { name: 'Welcome Message', value: 'welcome_message' },
    { name: 'Auto Role', value: 'auto_role' },
    { name: 'Moderation Log', value: 'mod_log' },
    { name: 'Prefix', value: 'prefix' }
  ];
  
  // Filter based on user permissions
  const userPermissions = await getUserPermissions(context.userId, context.guildId);
  
  return availableSettings
    .filter(setting => {
      // Only show admin settings to admins
      if (setting.value.startsWith('mod_') && !userPermissions.includes('MANAGE_GUILD')) {
        return false;
      }
      return setting.name.toLowerCase().includes(query.toLowerCase());
    })
    .slice(0, 25);
});
```

## Helper Functions

### createAsyncChoicesHandler

For backward compatibility and specific use cases:

```typescript
import { createAsyncChoicesHandler } from '@waforix/mocha';

const userFetcher = createAsyncChoicesHandler(async (guildId, query) => {
  const users = await searchUsers(guildId, query);
  return users.map(user => ({
    name: user.displayName,
    value: user.id
  }));
});

client.getAutocompleteManager().register('command', 'user', userFetcher);
```

## Error Handling

### Graceful Degradation

```typescript
client.getAutocompleteManager().register('search', 'query', async (query, context) => {
  try {
    if (!query || query.length < 2) {
      return [
        { name: 'Type at least 2 characters to search', value: 'min_length' }
      ];
    }
    
    const results = await performSearch(query, context);
    
    if (results.length === 0) {
      return [
        { name: 'No results found', value: 'no_results' }
      ];
    }
    
    return results;
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [
      { name: 'Search temporarily unavailable', value: 'error' }
    ];
  }
});
```

### Timeout Handling

```typescript
const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
};

client.getAutocompleteManager().register('slow-search', 'query', async (query, context) => {
  try {
    const results = await withTimeout(
      performSlowSearch(query, context),
      2000 // 2 second timeout
    );
    
    return results;
  } catch (error) {
    if (error.message === 'Timeout') {
      return [{ name: 'Search taking too long, try a more specific query', value: 'timeout' }];
    }
    
    return [{ name: 'Search error occurred', value: 'error' }];
  }
});
```

## Performance Optimization

### Caching

```typescript
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

client.getAutocompleteManager().register('cached-search', 'query', async (query, context) => {
  const cacheKey = `${context.guildId}-${query}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const results = await performExpensiveSearch(query, context);
  
  cache.set(cacheKey, {
    data: results,
    timestamp: Date.now()
  });
  
  return results;
});
```

### Debouncing

```typescript
const debounceMap = new Map();

client.getAutocompleteManager().register('debounced-search', 'query', async (query, context) => {
  const key = `${context.guildId}-${context.userId}`;
  
  // Clear previous timeout
  if (debounceMap.has(key)) {
    clearTimeout(debounceMap.get(key));
  }
  
  return new Promise((resolve) => {
    const timeout = setTimeout(async () => {
      const results = await performSearch(query, context);
      resolve(results);
      debounceMap.delete(key);
    }, 300); // 300ms debounce
    
    debounceMap.set(key, timeout);
  });
});
```

## Best Practices

1. **Limit Results** - Discord allows max 25 choices
2. **Handle Empty Queries** - Provide helpful default suggestions
3. **Use Meaningful Names** - Make choice names descriptive
4. **Implement Caching** - Cache expensive operations
5. **Handle Errors Gracefully** - Always provide fallback options
6. **Optimize Performance** - Keep response times under 3 seconds
7. **Validate Context** - Check guild/user permissions
8. **Provide Feedback** - Use choice names to guide users

## Integration with Commands

```typescript
// Command definition
const userCommand = new SlashCommandBuilder('userinfo', 'Get information about a user')
  .addStringOption('user', 'Search for a user', true)
    .setAutocomplete(true);

// Autocomplete handler
client.getAutocompleteManager().register('userinfo', 'user', async (query, context) => {
  const leaderboard = await client.getLeaderboard(context.guildId, 'messages', 25);
  return leaderboard
    .filter(user => user.username.toLowerCase().includes(query.toLowerCase()))
    .map(user => ({
      name: `${user.username} (${user.messageCount} messages)`,
      value: user.userId
    }));
});

// Command handler
client.getCommandHandlerManager().register('userinfo', {
  async execute(interaction) {
    const userId = interaction.data.options?.[0]?.value;
    const userInfo = await getUserInfo(userId);
    
    return {
      type: 4,
      data: {
        content: `**${userInfo.displayName}**\nJoined: ${userInfo.joinedAt}`
      }
    };
  }
});
```

For more information on building commands, see the [Command System](https://github.com/waforix/mocha/wiki/Command-System) guide.
