# Quick Examples

Get started quickly with these practical examples of using Waforix in your Discord bot.

## 🤖 Discord.js Integration

### Complete Bot Example
```typescript
import { Client, GatewayIntentBits } from 'discord.js';
import { StatsClient } from 'waforix';

// Initialize Discord client
const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ]
});

// Initialize Waforix
const stats = new StatsClient({
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  }
});

// Initialize both clients
async function initialize() {
  await stats.initialize();
  await discord.login('YOUR_BOT_TOKEN');
  console.log('Bot and Waforix initialized!');
}

// Track message events
discord.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  try {
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
  } catch (error) {
    console.error('Failed to track message:', error);
  }
});

// Track voice events
discord.on('voiceStateUpdate', async (oldState, newState) => {
  const userId = newState.id;
  const guildId = newState.guild.id;
  
  try {
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
  } catch (error) {
    console.error('Failed to track voice event:', error);
  }
});

initialize();
```

### Simple Message Tracking
```typescript
import { Client, GatewayIntentBits } from 'discord.js';
import { StatsClient } from 'waforix';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const stats = new StatsClient({
  database: { type: 'sqlite', path: './stats.db' }
});

client.on('ready', async () => {
  await stats.initialize();
  console.log('Ready to track messages!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  
  await stats.trackMessage({
    id: message.id,
    userId: message.author.id,
    guildId: message.guild.id,
    channelId: message.channel.id,
    content: message.content,
    timestamp: message.createdTimestamp,
    attachmentCount: message.attachments.size,
    embedCount: message.embeds.length
  });
});

client.login('YOUR_BOT_TOKEN');
```

## 📊 Basic Analytics Examples

### Server Statistics Command
```typescript
// Slash command to get server stats
discord.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  if (interaction.commandName === 'stats') {
    const days = interaction.options.getInteger('days') || 30;
    
    try {
      const serverStats = await stats.getServerStats(interaction.guildId!, days);
      
      const embed = new EmbedBuilder()
        .setTitle(`📊 Server Statistics (Last ${days} days)`)
        .addFields(
          { name: '💬 Total Messages', value: serverStats.totalMessages.toLocaleString(), inline: true },
          { name: '👥 Active Users', value: serverStats.activeUsers.toString(), inline: true },
          { name: '🎤 Voice Time', value: `${Math.round(serverStats.totalVoiceTime / 3600000)} hours`, inline: true }
        )
        .setColor('#0099ff')
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply('Failed to get server statistics.');
    }
  }
});
```

### User Statistics Command
```typescript
discord.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  if (interaction.commandName === 'userstats') {
    const user = interaction.options.getUser('user') || interaction.user;
    const days = interaction.options.getInteger('days') || 30;
    
    try {
      const userStats = await stats.getUserStats(interaction.guildId!, user.id, days);
      
      const embed = new EmbedBuilder()
        .setTitle(`📈 ${user.username}'s Statistics`)
        .addFields(
          { name: '💬 Messages', value: userStats.messages.toString(), inline: true },
          { name: '🎤 Voice Time', value: `${Math.round(userStats.voiceTime / 3600000)} hours`, inline: true },
          { name: '📊 Server Rank', value: `#${userStats.rank}`, inline: true }
        )
        .setThumbnail(user.displayAvatarURL())
        .setColor('#00ff99');
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply('Failed to get user statistics.');
    }
  }
});
```

### Leaderboard Command
```typescript
discord.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  if (interaction.commandName === 'leaderboard') {
    const type = interaction.options.getString('type') || 'messages';
    const limit = interaction.options.getInteger('limit') || 10;
    
    try {
      const leaderboard = await stats.getLeaderboard(
        interaction.guildId!, 
        type as 'messages' | 'voice', 
        { limit, days: 30 }
      );
      
      const description = leaderboard
        .map((user, index) => {
          const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📍';
          const value = type === 'voice' 
            ? `${Math.round(user.count / 3600000)} hours`
            : `${user.count} messages`;
          return `${emoji} **${user.username}** - ${value}`;
        })
        .join('\n');
      
      const embed = new EmbedBuilder()
        .setTitle(`🏆 ${type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard`)
        .setDescription(description)
        .setColor('#ffaa00');
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply('Failed to get leaderboard.');
    }
  }
});
```

## 🎯 Event Tracking Examples

### Track All Event Types
```typescript
// Message tracking
discord.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  
  await stats.trackMessage({
    id: message.id,
    userId: message.author.id,
    guildId: message.guild.id,
    channelId: message.channel.id,
    content: message.content,
    timestamp: message.createdTimestamp,
    attachmentCount: message.attachments.size,
    embedCount: message.embeds.length
  });
});

// Reaction tracking
discord.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  
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

// Member join/leave tracking
discord.on('guildMemberAdd', async (member) => {
  await stats.trackMember({
    id: `${member.id}-join-${Date.now()}`,
    userId: member.id,
    guildId: member.guild.id,
    action: 'join',
    timestamp: Date.now()
  });
});

discord.on('guildMemberRemove', async (member) => {
  await stats.trackMember({
    id: `${member.id}-leave-${Date.now()}`,
    userId: member.id,
    guildId: member.guild.id,
    action: 'leave',
    timestamp: Date.now()
  });
});
```

## 📈 Analytics Dashboard Example

### Simple Web Dashboard
```typescript
import express from 'express';
import { StatsClient } from 'waforix';

const app = express();
const stats = new StatsClient({
  database: { type: 'sqlite', path: './stats.db' }
});

await stats.initialize();

// API endpoint for server stats
app.get('/api/stats/:guildId', async (req, res) => {
  try {
    const { guildId } = req.params;
    const days = parseInt(req.query.days as string) || 30;
    
    const serverStats = await stats.getServerStats(guildId, days);
    const leaderboard = await stats.getLeaderboard(guildId, 'messages', { limit: 10, days });
    
    res.json({
      stats: serverStats,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

app.listen(3000, () => {
  console.log('Dashboard running on http://localhost:3000');
});
```

## 🔧 Utility Examples

### Batch Processing
```typescript
// Process multiple events at once for better performance
const events = [
  { type: 'message', data: messageData1 },
  { type: 'message', data: messageData2 },
  { type: 'voice', data: voiceData1 }
];

await stats.batchProcess(events);
```

### Data Export
```typescript
// Export server data for backup
const exportData = await stats.exportData('guild_id', {
  format: 'json',
  days: 30,
  includeMessages: true,
  includeVoice: true
});

console.log(`Exported ${exportData.totalRecords} records`);
```

### Health Monitoring
```typescript
// Monitor system health
setInterval(async () => {
  const health = await stats.healthCheck();
  
  if (health.database !== 'healthy') {
    console.warn('Database health issue:', health.database);
  }
  
  const metrics = await stats.getPerformanceMetrics();
  console.log(`Cache hit rate: ${metrics.cacheHitRate}%`);
}, 60000); // Check every minute
```

## 🚀 Advanced Examples

### Custom Analytics Query
```typescript
// Get hourly activity for the last 7 days
const hourlyActivity = await stats.getHourlyActivity('guild_id', 7);

// Find peak activity hour
const peakHour = hourlyActivity.reduce((max, hour) => 
  hour.activity > max.activity ? hour : max
);

console.log(`Peak activity: ${peakHour.hour}:00 with ${peakHour.activity} messages`);
```

### Real-time Activity Monitoring
```typescript
// Set up real-time monitoring
stats.on('activityUpdate', (data) => {
  console.log(`Current activity: ${data.activeUsers} users, ${data.recentMessages} messages/hour`);
});

await stats.startRealTimeMonitoring('guild_id');
```

## 📚 Next Steps

Ready to dive deeper? Check out these guides:

- **[Event Tracking](https://github.com/waforix/mocha/wiki/Event-Tracking)** - Comprehensive event tracking guide
- **[Analytics & Insights](https://github.com/waforix/mocha/wiki/Analytics-&-Insights)** - Advanced analytics features
- **[Database Configuration](https://github.com/waforix/mocha/wiki/Database-Configuration)** - Optimize your database setup
- **[Performance Optimization](https://github.com/waforix/mocha/wiki/Performance-Optomization)** - Scale for production

## 💡 Pro Tips

- **Use batch processing** for high-volume bots
- **Enable caching** to improve query performance
- **Monitor memory usage** in production
- **Set up error handling** for all tracking operations
- **Use environment variables** for configuration
