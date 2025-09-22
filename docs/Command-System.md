# Command System

@waforix/mocha provides a comprehensive command system for building Discord slash commands with full TypeScript support and advanced features.

## Overview

The command system consists of:

- **SlashCommandBuilder** - For building command structures
- **CommandHandlerManager** - For handling command execution
- **Command Registration** - For registering commands with Discord

## Building Commands

### Basic Command

```typescript
import { SlashCommandBuilder } from '@waforix/mocha';

const pingCommand = new SlashCommandBuilder('ping', 'Check bot latency');

console.log(pingCommand.build());
// Output: { name: 'ping', description: 'Check bot latency', options: [] }
```

### Command with Options

```typescript
const userStatsCommand = new SlashCommandBuilder('userstats', 'Get user statistics')
  .addUserOption('user', 'The user to get stats for', true)
  .addStringOption('timeframe', 'Time period for stats')
    .addChoice('7 days', '7')
    .addChoice('30 days', '30')
    .addChoice('All time', 'all');
```

### Available Option Types

#### String Options

```typescript
.addStringOption('name', 'Description', required)
  .addChoice('Display Name', 'value')
  .setAutocomplete(true) // Enable autocomplete
```

#### Integer/Number Options

```typescript
.addIntegerOption('count', 'Number of items', true)
  .setMinValue(1)
  .setMaxValue(100)

.addNumberOption('percentage', 'Percentage value')
  .setMinMaxValue(0.0, 100.0)
```

#### User/Channel/Role Options

```typescript
.addUserOption('target', 'Target user', true)
.addChannelOption('channel', 'Target channel')
.addRoleOption('role', 'Target role')
.addMentionableOption('mention', 'User, role, or channel')
```

#### Boolean and Attachment Options

```typescript
.addBooleanOption('public', 'Make response public')
.addAttachmentOption('file', 'File to upload')
```

### Subcommands

```typescript
const statsCommand = new SlashCommandBuilder('stats', 'Statistics commands')
  .addSubcommand('user', 'Get user statistics')
    .addUserOption('target', 'Target user', true)
    .addStringOption('period', 'Time period')
  .addSubcommand('server', 'Get server statistics')
    .addStringOption('type', 'Type of stats', true)
      .addChoice('Messages', 'messages')
      .addChoice('Voice', 'voice');
```

### Subcommand Groups

```typescript
const adminCommand = new SlashCommandBuilder('admin', 'Admin commands')
  .addSubcommandGroup('user', 'User management')
    .addSubcommand('ban', 'Ban a user')
      .addUserOption('target', 'User to ban', true)
      .addStringOption('reason', 'Ban reason')
    .addSubcommand('kick', 'Kick a user')
      .addUserOption('target', 'User to kick', true);
```

## Command Handlers

### Basic Handler

```typescript
import { Client } from '@waforix/mocha';

const client = new Client({ /* config */ });

// Register a command handler
client.getCommandHandlerManager().register('ping', {
  async execute(interaction) {
    return {
      type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
      data: {
        content: `Pong! Latency: ${Date.now() - interaction.id}ms`
      }
    };
  }
});
```

### Handler with Options

```typescript
client.getCommandHandlerManager().register('userstats', {
  async execute(interaction) {
    const userId = interaction.data.options?.find(opt => opt.name === 'user')?.value;
    const timeframe = interaction.data.options?.find(opt => opt.name === 'timeframe')?.value || '30';
    
    if (!userId) {
      return {
        type: 4,
        data: {
          content: 'User is required!',
          flags: 64 // EPHEMERAL
        }
      };
    }
    
    const stats = await client.getUserStats(interaction.guild_id, userId, parseInt(timeframe));
    
    return {
      type: 4,
      data: {
        content: `**User Statistics**\nMessages: ${stats.messageCount}\nVoice Time: ${stats.voiceTime} minutes`
      }
    };
  }
});
```

### Subcommand Handler

```typescript
client.getCommandHandlerManager().register('stats', {
  async execute(interaction) {
    const subcommand = interaction.data.options?.[0];
    
    if (!subcommand) {
      return { type: 4, data: { content: 'Subcommand required!' } };
    }
    
    switch (subcommand.name) {
      case 'user': {
        const userId = subcommand.options?.find(opt => opt.name === 'target')?.value;
        const stats = await client.getUserStats(interaction.guild_id, userId);
        
        return {
          type: 4,
          data: {
            content: `User has sent ${stats.messageCount} messages`
          }
        };
      }
      
      case 'server': {
        const type = subcommand.options?.find(opt => opt.name === 'type')?.value;
        const guildStats = await client.getGuildStats(interaction.guild_id);
        
        if (type === 'messages') {
          return {
            type: 4,
            data: {
              content: `Server has ${guildStats.totalMessages} total messages`
            }
          };
        }
        
        break;
      }
    }
    
    return { type: 4, data: { content: 'Unknown subcommand' } };
  }
});
```

## Response Types

### Message Response

```typescript
return {
  type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
  data: {
    content: 'Hello, world!',
    flags: 64 // EPHEMERAL (only visible to user)
  }
};
```

### Embed Response

```typescript
import { EmbedBuilder } from '@waforix/mocha';

const embed = new EmbedBuilder()
  .setTitle('User Statistics')
  .setDescription('Statistics for the requested user')
  .addField('Messages', stats.messageCount.toString(), true)
  .addField('Voice Time', `${stats.voiceTime} minutes`, true)
  .setColor(0x00ff00)
  .setTimestamp();

return {
  type: 4,
  data: {
    embeds: [embed.build()]
  }
};
```

### Deferred Response

For long-running operations:

```typescript
// Initial response
return {
  type: 5 // DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
};

// Later, edit the response
// This would be done through Discord's API
```

## Error Handling

### Graceful Error Handling

```typescript
client.getCommandHandlerManager().register('stats', {
  async execute(interaction) {
    try {
      const stats = await client.getUserStats(interaction.guild_id, userId);
      
      return {
        type: 4,
        data: {
          content: `Messages: ${stats.messageCount}`
        }
      };
    } catch (error) {
      console.error('Stats command error:', error);
      
      return {
        type: 4,
        data: {
          content: 'An error occurred while fetching statistics.',
          flags: 64
        }
      };
    }
  }
});
```

### Validation

```typescript
client.getCommandHandlerManager().register('ban', {
  async execute(interaction) {
    const targetId = interaction.data.options?.find(opt => opt.name === 'user')?.value;
    
    if (!targetId) {
      return {
        type: 4,
        data: {
          content: 'Please specify a user to ban.',
          flags: 64
        }
      };
    }
    
    // Check permissions
    if (!interaction.member?.permissions?.includes('BAN_MEMBERS')) {
      return {
        type: 4,
        data: {
          content: 'You do not have permission to ban members.',
          flags: 64
        }
      };
    }
    
    // Proceed with ban logic...
  }
});
```

## Advanced Features

### Command Cooldowns

```typescript
const cooldowns = new Map();

client.getCommandHandlerManager().register('expensive-command', {
  async execute(interaction) {
    const userId = interaction.member?.user?.id || interaction.user?.id;
    const cooldownKey = `${interaction.data.name}-${userId}`;
    const cooldownTime = 30000; // 30 seconds
    
    if (cooldowns.has(cooldownKey)) {
      const expirationTime = cooldowns.get(cooldownKey) + cooldownTime;
      
      if (Date.now() < expirationTime) {
        const timeLeft = (expirationTime - Date.now()) / 1000;
        return {
          type: 4,
          data: {
            content: `Please wait ${timeLeft.toFixed(1)} more seconds before using this command again.`,
            flags: 64
          }
        };
      }
    }
    
    cooldowns.set(cooldownKey, Date.now());
    
    // Command logic here...
  }
});
```

### Permission Checks

```typescript
function hasPermission(interaction, permission) {
  return interaction.member?.permissions?.includes(permission);
}

client.getCommandHandlerManager().register('moderation', {
  async execute(interaction) {
    if (!hasPermission(interaction, 'MANAGE_MESSAGES')) {
      return {
        type: 4,
        data: {
          content: 'You need the Manage Messages permission to use this command.',
          flags: 64
        }
      };
    }
    
    // Moderation logic...
  }
});
```

## Best Practices

1. **Use TypeScript** - Take advantage of type safety
2. **Handle Errors** - Always wrap command logic in try-catch
3. **Validate Input** - Check all user input before processing
4. **Use Ephemeral Responses** - For error messages and sensitive data
5. **Implement Cooldowns** - Prevent command spam
6. **Check Permissions** - Verify user permissions before executing
7. **Provide Feedback** - Always respond to interactions

For autocomplete functionality, see the [Autocomplete System](https://github.com/waforix/mocha/wiki/Autocomplete-System) guide.
