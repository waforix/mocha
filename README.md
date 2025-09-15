# Waforix 🚀

High-performance Discord bot library with builders, statistics tracking, and optimized caching.

## Features

- Discord Gateway client with auto-reconnection
- Command, message, and embed builders
- SQLite and PostgreSQL database support with intelligent caching
- Statistics tracking and analytics
- Full TypeScript support

## Quick Start

```typescript
import {
  StatsClient,
  INTENTS,
  SlashCommandBuilder,
  MessageBuilder,
  EmbedBuilder
} from 'waforix';

const client = new StatsClient({
  token: 'your-bot-token',
  intents: INTENTS.GUILDS | INTENTS.GUILD_MESSAGES,
  dbPath: './data/stats.db'
});

await client.connect();

// Build commands
const command = new SlashCommandBuilder('stats', 'Get server statistics')
  .addUserOption('user', 'Target user', false)
  .build();

// Build messages with embeds
const embed = new EmbedBuilder()
  .setTitle('Server Stats')
  .setColor('blue')
  .addField('Messages', '1,234', true)
  .setTimestamp()
  .build();

const message = new MessageBuilder()
  .setContent('Here are your stats!')
  .addEmbed(embed)
  .build();
```

## Installation

```bash
# Clone and build from source
git clone <repository-url>
cd waforix
bun install
bun run build
```

## License

MIT


