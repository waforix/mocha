# Getting Started

This guide will help you get up and running with @waforix/mocha quickly.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ or Bun installed
- A Discord application and bot token
- Basic knowledge of TypeScript/JavaScript
- A database (SQLite for development, PostgreSQL/MySQL for production)

## Installation

Install @waforix/mocha using your preferred package manager:

```bash
# Using npm
npm install @waforix/mocha

# Using yarn
yarn add @waforix/mocha

# Using bun (recommended)
bun add @waforix/mocha
```

## Creating a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section
4. Click "Add Bot"
5. Copy the bot token (keep this secure!)
6. Enable the necessary intents (see below)

### Required Bot Intents

For full functionality, enable these intents:

- `GUILDS` - Access to guild information
- `GUILD_MESSAGES` - Track message events
- `GUILD_VOICE_STATES` - Track voice activity
- `GUILD_MESSAGE_REACTIONS` - Track reactions
- `GUILD_MEMBERS` - Access to member information (if needed)

## Basic Setup

Create a new file (e.g., `bot.ts`) and add the following:

```typescript
import { Client } from '@waforix/mocha';

const client = new Client({
  token: 'your-discord-bot-token',
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  },
  // Optional: Enable additional features
  enableMetrics: true,
  enableNotifications: true,
  enableRateLimit: true
});

// Event handlers
client.on('ready', () => {
  console.log(`Bot is ready! Logged in as ${client.user?.tag}`);
});

client.on('error', (error) => {
  console.error('Client error:', error);
});

// Start the client
async function start() {
  try {
    await client.connect();
  } catch (error) {
    console.error('Failed to start client:', error);
  }
}

start();
```

## Environment Variables

For security, use environment variables for sensitive data:

```bash
# .env file
DISCORD_TOKEN=your-discord-bot-token
DATABASE_URL=sqlite:./data/stats.db
```

```typescript
import { Client } from '@waforix/mocha';
import 'dotenv/config';

const client = new Client({
  token: process.env.DISCORD_TOKEN!,
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  }
});
```

## Database Setup

### SQLite (Development)

SQLite requires no additional setup - the database file will be created automatically:

```typescript
const client = new Client({
  token: process.env.DISCORD_TOKEN!,
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  }
});
```

### PostgreSQL (Production)

First, install PostgreSQL and create a database:

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createdb mocha_stats
sudo -u postgres createuser --interactive mocha_user
```

Then configure the client:

```typescript
const client = new Client({
  token: process.env.DISCORD_TOKEN!,
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'mocha_stats',
    username: 'mocha_user',
    password: 'your_password'
  }
});
```

## Your First Command

Let's create a simple stats command:

```typescript
import { Client, SlashCommandBuilder } from '@waforix/mocha';

const client = new Client({
  token: process.env.DISCORD_TOKEN!,
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  }
});

// Create a command
const statsCommand = new SlashCommandBuilder('stats', 'Get server statistics')
  .addStringOption('type', 'Type of stats to show', true)
  .addChoice('messages', 'messages')
  .addChoice('voice', 'voice')
  .addChoice('members', 'members');

// Register command handler
client.getCommandHandlerManager().register('stats', {
  async execute(interaction) {
    const type = interaction.data.options?.[0]?.value;
    
    if (type === 'messages') {
      const stats = await client.getGuildStats(interaction.guild_id);
      return {
        type: 4,
        data: {
          content: `Total messages: ${stats.totalMessages}`
        }
      };
    }
    
    // Handle other types...
    return {
      type: 4,
      data: {
        content: 'Stats command executed!'
      }
    };
  }
});

client.on('ready', async () => {
  console.log('Bot is ready!');
  
  // Register the command with Discord
  // This would typically be done through Discord's API
});
```

## Next Steps

Now that you have a basic setup:

1. **Explore Commands** - Learn about the [Command System](https://github.com/waforix/mocha/wiki/Command-System)
2. **Add Autocomplete** - Implement [Autocomplete System](https://github.com/waforix/mocha/wiki/Autocomplete-System)
3. **Configure Database** - Set up [Database Configuration](https://github.com/waforix/mocha/wiki/Database-Configuration)
4. **Track Events** - Enable [Event Tracking](https://github.com/waforix/mocha/wiki/Event-Tracking)
5. **View Analytics** - Explore [Analytics & Statistics](https://github.com/waforix/mocha/wiki/Analytics-Statistics)

## Troubleshooting

### Common Issues

**Bot doesn't respond to commands:**

- Ensure the bot has the necessary permissions in your server
- Check that intents are properly configured
- Verify the bot token is correct

**Database connection errors:**

- Check database credentials and connection string
- Ensure the database server is running
- Verify network connectivity

**TypeScript compilation errors:**

- Ensure you're using TypeScript 5.0+
- Check that all dependencies are installed
- Verify your tsconfig.json configuration

For more help, check the [API Reference](https://github.com/waforix/mocha/wiki/API-Reference) or open an issue on [GitHub](https://github.com/waforix/mocha/issues).
