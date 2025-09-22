# Quick Examples

This guide provides practical examples to help you get started with @waforix/mocha quickly.

## Basic Bot Setup

### Simple Statistics Bot

```typescript
import { Client } from '@waforix/mocha';

const client = new Client({
  token: process.env.DISCORD_TOKEN!,
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  },
  enableMetrics: true
});

client.on('ready', () => {
  console.log('Bot is ready!');
});

client.on('error', console.error);

await client.connect();
```

## Command Examples

### User Statistics Command

```typescript
import { SlashCommandBuilder } from '@waforix/mocha';

// Build the command
const userStatsCommand = new SlashCommandBuilder('userstats', 'Get user statistics')
  .addUserOption('user', 'The user to get stats for', true)
  .addStringOption('period', 'Time period')
    .addChoice('7 days', '7')
    .addChoice('30 days', '30')
    .addChoice('All time', 'all');

// Register command handler
client.getCommandHandlerManager().register('userstats', {
  async execute(interaction) {
    const userId = interaction.data.options?.find(opt => opt.name === 'user')?.value;
    const period = interaction.data.options?.find(opt => opt.name === 'period')?.value || '30';
    
    try {
      const days = period === 'all' ? undefined : parseInt(period);
      const stats = await client.getUserStats(interaction.guild_id, userId, days);
      
      return {
        type: 4,
        data: {
          content: `📊 **User Statistics**\n` +
                  `Messages: ${stats.messageCount}\n` +
                  `Voice Time: ${Math.round(stats.voiceTime)} minutes\n` +
                  `Reactions: ${stats.reactionCount}`
        }
      };
    } catch (error) {
      return {
        type: 4,
        data: {
          content: 'Failed to fetch user statistics.',
          flags: 64 // Ephemeral
        }
      };
    }
  }
});
```

### Server Leaderboard Command

```typescript
const leaderboardCommand = new SlashCommandBuilder('leaderboard', 'Show server leaderboard')
  .addStringOption('type', 'Leaderboard type', true)
    .addChoice('Messages', 'messages')
    .addChoice('Voice Time', 'voice')
    .addChoice('Reactions', 'reactions')
  .addIntegerOption('limit', 'Number of users to show')
    .setMinValue(5)
    .setMaxValue(25);

client.getCommandHandlerManager().register('leaderboard', {
  async execute(interaction) {
    const type = interaction.data.options?.find(opt => opt.name === 'type')?.value;
    const limit = interaction.data.options?.find(opt => opt.name === 'limit')?.value || 10;
    
    const guildStats = await client.getGuildStats(interaction.guild_id);
    
    let leaderboard = '';
    let title = '';
    
    switch (type) {
      case 'messages':
        title = '📝 Message Leaderboard';
        guildStats.topUsers.slice(0, limit).forEach((user, index) => {
          leaderboard += `${index + 1}. ${user.username}: ${user.messageCount} messages\n`;
        });
        break;
        
      case 'voice':
        title = '🎤 Voice Time Leaderboard';
        // This would require additional voice time data
        leaderboard = 'Voice leaderboard coming soon!';
        break;
        
      case 'reactions':
        title = '⭐ Reaction Leaderboard';
        // This would require additional reaction data
        leaderboard = 'Reaction leaderboard coming soon!';
        break;
    }
    
    return {
      type: 4,
      data: {
        content: `${title}\n\`\`\`\n${leaderboard}\`\`\``
      }
    };
  }
});
```

## Autocomplete Examples

### User Search Autocomplete

```typescript
import { createAsyncChoices } from '@waforix/mocha';

// Register autocomplete for user search
client.getAutocompleteManager().register(
  'userstats',
  'user',
  createAsyncChoices(async (query, context) => {
    if (!context.guildId || query.length < 2) {
      return [];
    }

    const leaderboard = await client.getLeaderboard(context.guildId, 'messages', 25);

    return leaderboard
      .filter(user => user.username.toLowerCase().includes(query.toLowerCase()))
      .map(user => ({
        name: `${user.username} (${user.messageCount} messages)`,
        value: user.userId
      })).slice(0, 25);
  })
);
```

### Channel Search Autocomplete

```typescript
client.getAutocompleteManager().register('channelstats', 'channel', async (query, context) => {
  if (!context.guildId) return [];
  
  // This would typically fetch from Discord API or your database
  const channels = [
    { id: '123', name: 'general', messageCount: 1500 },
    { id: '456', name: 'random', messageCount: 800 },
    { id: '789', name: 'bot-commands', messageCount: 300 }
  ];
  
  return channels
    .filter(channel => 
      channel.name.toLowerCase().includes(query.toLowerCase())
    )
    .map(channel => ({
      name: `#${channel.name} (${channel.messageCount} messages)`,
      value: channel.id
    }));
});
```

## Advanced Examples

### Embed Response with Statistics

```typescript
import { EmbedBuilder } from '@waforix/mocha';

client.getCommandHandlerManager().register('serverstats', {
  async execute(interaction) {
    const stats = await client.getGuildStats(interaction.guild_id);
    
    const embed = new EmbedBuilder()
      .setTitle('📊 Server Statistics')
      .setDescription('Comprehensive server activity statistics')
      .addField('Total Messages', stats.totalMessages.toLocaleString(), true)
      .addField('Active Users', stats.activeUsers.toString(), true)
      .addField('Voice Time', `${Math.round(stats.totalVoiceTime)} minutes`, true)
      .addField('Top Channel', stats.topChannels[0]?.channelName || 'None', true)
      .addField('Top User', stats.topUsers[0]?.username || 'None', true)
      .addField('Total Reactions', stats.totalReactions.toLocaleString(), true)
      .setColor(0x00ff00)
      .setTimestamp()
      .setFooter('Statistics updated in real-time');
    
    return {
      type: 4,
      data: {
        embeds: [embed.build()]
      }
    };
  }
});
```

### Subcommand Example

```typescript
const configCommand = new SlashCommandBuilder('config', 'Bot configuration commands')
  .addSubcommand('view', 'View current configuration')
  .addSubcommand('set', 'Set configuration value')
    .addStringOption('key', 'Configuration key', true)
      .setAutocomplete(true)
    .addStringOption('value', 'Configuration value', true);

client.getCommandHandlerManager().register('config', {
  async execute(interaction) {
    const subcommand = interaction.data.options?.[0];
    
    if (!subcommand) {
      return { type: 4, data: { content: 'Subcommand required!' } };
    }
    
    switch (subcommand.name) {
      case 'view':
        return {
          type: 4,
          data: {
            content: '⚙️ **Current Configuration**\n' +
                    '```json\n' +
                    JSON.stringify({
                      prefix: '!',
                      welcomeChannel: 'general',
                      logChannel: 'mod-log'
                    }, null, 2) +
                    '\n```'
          }
        };
        
      case 'set':
        const key = subcommand.options?.find(opt => opt.name === 'key')?.value;
        const value = subcommand.options?.find(opt => opt.name === 'value')?.value;
        
        // Save configuration logic here
        
        return {
          type: 4,
          data: {
            content: `✅ Configuration updated: \`${key}\` = \`${value}\``
          }
        };
    }
  }
});

// Autocomplete for configuration keys
client.getAutocompleteManager().register('config', 'key', async (query) => {
  const configKeys = [
    { name: 'Bot Prefix', value: 'prefix' },
    { name: 'Welcome Channel', value: 'welcomeChannel' },
    { name: 'Log Channel', value: 'logChannel' },
    { name: 'Auto Role', value: 'autoRole' }
  ];
  
  return configKeys.filter(key =>
    key.name.toLowerCase().includes(query.toLowerCase())
  );
});
```

### Data Export Example

```typescript
client.getCommandHandlerManager().register('export', {
  async execute(interaction) {
    // Defer response for long operation
    await interaction.deferReply();
    
    try {
      const exportData = await client.exportData({
        format: 'json',
        guildId: interaction.guild_id,
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          end: new Date()
        },
        includeUsers: true,
        includeMessages: true
      });

      // In a real implementation, you'd upload the file or provide a download link
      return {
        type: 4,
        data: {
          content: `📁 **Data Export Complete**\n` +
                  `Guild: ${exportData.metadata.guildId}\n` +
                  `Records: ${exportData.metadata.recordCount}\n` +
                  `Date Range: ${exportData.metadata.dateRange.start.toDateString()} - ${exportData.metadata.dateRange.end.toDateString()}\n` +
                  `Exported: ${exportData.metadata.exportDate.toISOString()}`
        }
      };
    } catch (error) {
      return {
        type: 4,
        data: {
          content: '❌ Export failed. Please try again later.',
          flags: 64
        }
      };
    }
  }
});
```

## Error Handling Examples

### Comprehensive Error Handling

```typescript
client.getCommandHandlerManager().register('robust-command', {
  async execute(interaction) {
    try {
      // Validate permissions
      if (!interaction.member?.permissions?.includes('MANAGE_GUILD')) {
        return {
          type: 4,
          data: {
            content: '❌ You need Manage Server permission to use this command.',
            flags: 64
          }
        };
      }
      
      // Validate input
      const userId = interaction.data.options?.find(opt => opt.name === 'user')?.value;
      if (!userId) {
        return {
          type: 4,
          data: {
            content: '❌ Please specify a user.',
            flags: 64
          }
        };
      }
      
      // Perform operation with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timeout')), 5000)
      );
      
      const operationPromise = client.getUserStats(interaction.guild_id, userId);
      
      const stats = await Promise.race([operationPromise, timeoutPromise]);
      
      return {
        type: 4,
        data: {
          content: `✅ Operation completed successfully!\nUser has ${stats.messageCount} messages.`
        }
      };
      
    } catch (error) {
      console.error('Command error:', error);
      
      let errorMessage = '❌ An unexpected error occurred.';
      
      if (error.message === 'Operation timeout') {
        errorMessage = '⏱️ Operation timed out. Please try again.';
      } else if (error.message.includes('not found')) {
        errorMessage = '❌ User not found in this server.';
      }
      
      return {
        type: 4,
        data: {
          content: errorMessage,
          flags: 64
        }
      };
    }
  }
});
```

## Integration Examples

### Discord.js Integration

```typescript
import { Client as DiscordClient, GatewayIntentBits } from 'discord.js';
import { Client as MochaClient } from '@waforix/mocha';

// Discord.js client
const discord = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Mocha client
const mocha = new MochaClient({
  token: process.env.DISCORD_TOKEN!,
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  }
});

// Connect both clients
await Promise.all([
  discord.login(process.env.DISCORD_TOKEN!),
  mocha.connect()
]);

// Use Discord.js for complex interactions, Mocha for statistics
discord.on('messageCreate', async (message) => {
  if (message.content === '!stats') {
    const stats = await mocha.getUserStats(message.guild.id, message.author.id);
    message.reply(`You have sent ${stats.messageCount} messages!`);
  }
});
```

For more comprehensive guides, see:

- [Getting Started](https://github.com/waforix/mocha/wiki/Getting-Started)
- [Command System](https://github.com/waforix/mocha/wiki/Command-System)
- [Autocomplete System](https://github.com/waforix/mocha/wiki/Autocomplete-System)
- [API Reference](https://github.com/waforix/mocha/wiki/API-Reference)
