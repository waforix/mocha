# Usage Examples

This document provides comprehensive examples of using Mocha in different scenarios.

## Basic Statistics Bot

A simple Discord bot that responds to slash commands with statistics.

```typescript
import { Client, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import { StatsClient, INTENTS } from 'mocha';

// Initialize Discord.js client for slash commands
const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Initialize Mocha stats client
const statsClient = new StatsClient({
  token: process.env.DISCORD_TOKEN!,
  intents: INTENTS.GUILDS | INTENTS.GUILD_MESSAGES | INTENTS.GUILD_VOICE_STATES,
  dbPath: './data/stats.db'
});

// Register slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Get user statistics')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('User to get stats for')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('days')
        .setDescription('Number of days to look back')
        .setMinValue(1)
        .setMaxValue(365)
        .setRequired(false)),
        
  new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Get server leaderboard')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Leaderboard type')
        .setRequired(true)
        .addChoices(
          { name: 'Messages', value: 'messages' },
          { name: 'Voice Time', value: 'voice' }
        ))
    .addIntegerOption(option =>
      option.setName('limit')
        .setDescription('Number of users to show')
        .setMinValue(1)
        .setMaxValue(25)
        .setRequired(false))
];

// Handle slash commands
discordClient.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, guildId } = interaction;
  
  try {
    if (commandName === 'stats') {
      const user = interaction.options.getUser('user') || interaction.user;
      const days = interaction.options.getInteger('days') || 30;
      
      const userStats = await statsClient.getUserStats(guildId!, user.id, days);
      
      await interaction.reply({
        embeds: [{
          title: `📊 Stats for ${user.displayName}`,
          color: 0x8B4513, // Coffee brown
          fields: [
            { 
              name: '💬 Messages', 
              value: userStats.messageCount.toString(), 
              inline: true 
            },
            { 
              name: '🎤 Voice Time', 
              value: `${Math.round(userStats.voiceTime / 3600000)}h ${Math.round((userStats.voiceTime % 3600000) / 60000)}m`, 
              inline: true 
            },
            { 
              name: '🎙️ Voice Sessions', 
              value: userStats.voiceSessions.toString(), 
              inline: true 
            },
            { 
              name: '📎 Attachments', 
              value: userStats.attachments.toString(), 
              inline: true 
            }
          ],
          footer: { text: `Last ${days} days` }
        }]
      });
    }
    
    if (commandName === 'leaderboard') {
      const type = interaction.options.getString('type', true) as 'messages' | 'voice';
      const limit = interaction.options.getInteger('limit') || 10;
      
      const leaderboard = await statsClient.getLeaderboard(guildId!, type, limit);
      
      const description = leaderboard.map((user, index) => {
        const value = type === 'messages' 
          ? `${user.messageCount} messages`
          : `${Math.round(user.voiceTime / 3600000)}h voice time`;
        return `${index + 1}. <@${user.userId}> - ${value}`;
      }).join('\n');
      
      await interaction.reply({
        embeds: [{
          title: `🏆 ${type === 'messages' ? 'Message' : 'Voice'} Leaderboard`,
          description,
          color: 0x8B4513
        }]
      });
    }
  } catch (error) {
    console.error('Command error:', error);
    await interaction.reply({
      content: 'An error occurred while fetching statistics.',
      ephemeral: true
    });
  }
});

// Start both clients
async function start() {
  try {
    await statsClient.connect();
    await discordClient.login(process.env.DISCORD_TOKEN);
    console.log('✅ Bot is online!');
  } catch (error) {
    console.error('Failed to start bot:', error);
  }
}

start();
```

## Advanced Usage with Monitoring

A more sophisticated setup with performance monitoring and error handling.

```typescript
import { StatsClient, INTENTS } from 'mocha';

const client = new StatsClient({
  token: process.env.DISCORD_TOKEN!,
  intents: INTENTS.ALL,
  maxReconnects: 10,
  cache: {
    userStatsSize: 2000,
    guildStatsSize: 50,
    leaderboardSize: 100,
    ttlMs: 600000, // 10 minutes
  }
});

// Performance monitoring
setInterval(() => {
  const cacheStats = client.getCacheStats();
  const memUsage = process.memoryUsage();
  
  console.log('📊 Performance Stats:');
  console.log(`  Cache: ${cacheStats.userStats} users, ${cacheStats.guildStats} guilds`);
  console.log(`  Memory: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
  
  // Clear cache if memory usage is high
  if (memUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
    client.clearCache();
    console.log('🧹 Cache cleared due to high memory usage');
  }
}, 60000);

// Event monitoring
client.on('eventProcessed', (event, data) => {
  console.log(`✅ Processed ${event}`);
});

client.on('processingError', (error, event, data) => {
  console.error(`❌ Error processing ${event}:`, error.message);
});

client.on('gatewayError', (error) => {
  console.error('🔌 Gateway error:', error.message);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  client.disconnect();
  process.exit(0);
});

await client.connect();
```

## Custom Analytics Dashboard

Using Mocha with a web dashboard for real-time analytics.

```typescript
import express from 'express';
import { StatsClient, INTENTS } from 'mocha';

const app = express();
const client = new StatsClient({
  token: process.env.DISCORD_TOKEN!,
  intents: INTENTS.ALL
});

app.use(express.json());
app.use(express.static('public'));

// API endpoints
app.get('/api/guild/:guildId/stats', async (req, res) => {
  try {
    const { guildId } = req.params;
    const days = parseInt(req.query.days as string) || 30;
    
    const stats = await client.getGuildStats(guildId, days);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/guild/:guildId/leaderboard/:type', async (req, res) => {
  try {
    const { guildId, type } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const days = parseInt(req.query.days as string) || 30;
    
    const leaderboard = await client.getLeaderboard(
      guildId, 
      type as 'messages' | 'voice', 
      limit, 
      days
    );
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/guild/:guildId/heatmap', async (req, res) => {
  try {
    const { guildId } = req.params;
    const userId = req.query.userId as string;
    const days = parseInt(req.query.days as string) || 7;
    
    const heatmap = await client.getActivityHeatmap(guildId, userId, days);
    res.json(heatmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server and client
async function start() {
  await client.connect();
  app.listen(3000, () => {
    console.log('🌐 Dashboard available at http://localhost:3000');
  });
}

start();
```

## Batch Operations

Efficiently processing multiple statistics requests.

```typescript
import { StatsClient, INTENTS } from 'mocha';

const client = new StatsClient({
  token: process.env.DISCORD_TOKEN!,
  intents: INTENTS.ALL
});

// Batch get user stats for multiple users
async function getBatchUserStats(guildId: string, userIds: string[], days = 30) {
  const promises = userIds.map(userId => 
    client.getUserStats(guildId, userId, days)
  );
  
  const results = await Promise.allSettled(promises);
  
  return results.map((result, index) => ({
    userId: userIds[index],
    stats: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason.message : null
  }));
}

// Generate comprehensive guild report
async function generateGuildReport(guildId: string, days = 30) {
  const [guildStats, messageLeaderboard, voiceLeaderboard, heatmap] = await Promise.all([
    client.getGuildStats(guildId, days),
    client.getLeaderboard(guildId, 'messages', 25, days),
    client.getLeaderboard(guildId, 'voice', 25, days),
    client.getActivityHeatmap(guildId, undefined, days)
  ]);
  
  return {
    overview: guildStats,
    topMessageUsers: messageLeaderboard,
    topVoiceUsers: voiceLeaderboard,
    activityHeatmap: heatmap,
    generatedAt: new Date().toISOString()
  };
}

await client.connect();

// Example usage
const report = await generateGuildReport('123456789', 7);
console.log('📊 Guild Report Generated:', report);
```

## Error Handling Best Practices

Robust error handling for production applications.

```typescript
import { StatsClient, INTENTS } from 'mocha';

const client = new StatsClient({
  token: process.env.DISCORD_TOKEN!,
  intents: INTENTS.ALL
});

// Wrapper function with retry logic
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded');
}

// Safe stats retrieval
async function safeGetUserStats(guildId: string, userId: string, days = 30) {
  try {
    return await withRetry(() => client.getUserStats(guildId, userId, days));
  } catch (error) {
    console.error(`Failed to get stats for user ${userId}:`, error.message);
    return null;
  }
}

await client.connect();
```
