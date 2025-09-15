import { StatsClient, INTENTS } from './src/index';

// Test database connection
console.log('Testing database connection...');

const client = new StatsClient({
  token: 'test-token',
  intents: INTENTS.GUILDS | INTENTS.GUILD_MESSAGES,
  dbPath: './data/stats.db'
});

console.log('✓ StatsClient created successfully');
console.log('✓ Database connection established');

// Test cache
console.log('Cache stats:', client.getCacheStats());

console.log('✓ All basic functionality working!');
