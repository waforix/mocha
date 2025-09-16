import { INTENTS, StatsClient } from './src/index';

// Example with SQLite (backward compatible)
const clientSqlite = new StatsClient({
  token: 'YOUR_BOT_TOKEN',
  database: {
    type: 'sqlite',
    path: './data/stats.db',
  },
  cache: {
    userStatsSize: 2000,
    guildStatsSize: 200,
    ttlMs: 600000,
  },
  ignore: {
    bots: true,
    dmChannels: true,
    users: new Set(['123456789']),
    channels: new Set(['987654321']),
  },
});

// Example with PostgreSQL (new option)
const _clientPostgres = new StatsClient({
  token: 'YOUR_BOT_TOKEN',
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'waforix',
    username: 'postgres',
    password: 'your_password',
    ssl: false,
  },
  cache: {
    userStatsSize: 2000,
    guildStatsSize: 200,
    ttlMs: 600000,
  },
  ignore: {
    bots: true,
    dmChannels: true,
    events: new Set(['PRESENCE_UPDATE']),
  },
});

// Use either client
const client = clientSqlite;

client.on('eventProcessed', (event, data) => {
  console.log(`Processed ${event} for guild ${data.guild_id}`);
});

client.on('gatewayError', (error) => {
  console.error('Gateway error:', error);
});

await client.connect();

// Runtime configuration updates
client.addIgnoredUser('999888777');
client.addIgnoredChannel('111222333');

// Example usage after bot is running
setTimeout(async () => {
  const guildId = 'YOUR_GUILD_ID';
  const userId = 'YOUR_USER_ID';

  // Get user stats
  const userStats = await client.getUserStats(guildId, userId, 30);
  console.log('User stats:', userStats);

  // Get guild stats
  const guildStats = await client.getGuildStats(guildId, 30);
  console.log('Guild stats:', guildStats);

  // Get message leaderboard
  const messageLeaderboard = await client.getLeaderboard(guildId, 'messages', 10, 30);
  console.log('Top message senders:', messageLeaderboard);

  // Get voice leaderboard
  const voiceLeaderboard = await client.getLeaderboard(guildId, 'voice', 10, 30);
  console.log('Top voice users:', voiceLeaderboard);

  // Get activity heatmap
  const heatmap = await client.getActivityHeatmap(guildId, undefined, 7);
  console.log('Activity by hour:', heatmap);

  // Check cache performance
  console.log('Cache stats:', client.getCacheStats());
}, 10000);
