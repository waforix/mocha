# Development Setup

This guide will help you set up a development environment for contributing to Mocha.

## Prerequisites

### Required Software

- **Bun 1.0+** (recommended) or **Node.js 18+**
- **Git** for version control
- **SQLite** (usually included with Bun/Node.js)
- **Discord Bot Token** for testing

### Recommended Tools

- **VS Code** with TypeScript and Biome extensions
- **Discord Developer Portal** access for bot testing
- **SQLite Browser** for database inspection

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/WxTaco/mocha.git
cd mocha
```

### 2. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Using npm
npm install

# Using yarn
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```env
# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token_here
GUILD_ID=your_test_guild_id

# Database Configuration
DB_PATH=./data/stats.db

# Development Settings
NODE_ENV=development
LOG_LEVEL=debug
```

### 4. Database Setup

Initialize the database with proper schema:

```bash
# Generate database schema
bun run db:generate

# Initialize database
bun run db:init

# Push schema to database
bun run db:push
```

### 5. Verify Installation

Run the comprehensive test to ensure everything is working:

```bash
bun run test-complete.ts
```

Expected output:
```
🧪 Running comprehensive library test...
✅ Client created successfully
✅ Database connection established
✅ Cache system working
✅ All tests completed successfully!
```

## Development Workflow

### Project Structure

```
mocha/
├── src/                    # Source code
│   ├── cache/             # Caching system
│   ├── db/                # Database layer
│   ├── events/            # Event processing
│   ├── gateway/           # Discord Gateway client
│   ├── lib/               # Main client interface
│   ├── processors/        # Event processors
│   ├── stats/             # Statistics engine
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
├── docs/                  # Documentation
├── examples/              # Usage examples
├── scripts/               # Build and utility scripts
├── data/                  # Database files (created automatically)
└── dist/                  # Compiled output (created by build)
```

### Development Scripts

```bash
# Development
bun run dev                # Start development server with hot reload
bun run build             # Build for production

# Database
bun run db:generate       # Generate database migrations
bun run db:init           # Initialize database
bun run db:push           # Push schema changes
bun run db:studio         # Open Drizzle Studio

# Code Quality
bun run check             # Run Biome linting
bun run check:fix         # Fix linting issues automatically
bun run format            # Check code formatting
bun run format:fix        # Fix formatting issues

# Testing
bun run test-complete.ts  # Run comprehensive tests
bunx tsc                  # TypeScript compilation check
```

### Code Quality Tools

#### Biome Configuration

The project uses Biome for linting and formatting:

```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error"
      }
    }
  }
}
```

#### TypeScript Configuration

Strict TypeScript settings for maximum type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Making Changes

#### 1. Create a Feature Branch

```bash
git checkout -b feat/your-feature-name
```

#### 2. Development Process

1. **Write Code** - Follow the [Code Style Guide](./code-style.md)
2. **Add Tests** - Ensure new functionality is tested
3. **Update Documentation** - Keep docs in sync with changes
4. **Run Quality Checks** - Ensure code passes all checks

```bash
# Run all quality checks
bun run check
bunx tsc
bun run test-complete.ts
```

#### 3. Commit Changes

Follow [Commit Guidelines](./commit-guidelines.md):

```bash
git add .
git commit -m "feat: add user statistics caching"
```

#### 4. Push and Create PR

```bash
git push origin feat/your-feature-name
```

Then create a pull request using the [PR Template](./pull-request-template.md).

## Testing

### Test Environment Setup

Create a test Discord server and bot:

1. **Create Discord Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create new application
   - Go to "Bot" section and create bot
   - Copy bot token

2. **Set Bot Permissions**
   - View Channels (1024)
   - Read Message History (65536)
   - Connect (1048576)
   - Permission integer: `1114112`

3. **Invite Bot to Test Server**
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=1114112&scope=bot
   ```

### Running Tests

```bash
# Comprehensive test suite
bun run test-complete.ts

# Individual components
bun test src/cache/manager.test.ts
bun test src/stats/queries.test.ts

# Type checking
bunx tsc --noEmit

# Code quality
bun run check
```

### Manual Testing

Test with real Discord events:

```typescript
// Create test bot
import { StatsClient, INTENTS } from './src/index';

const client = new StatsClient({
  token: process.env.DISCORD_TOKEN!,
  intents: INTENTS.ALL,
  dbPath: './data/test.db'
});

client.on('eventProcessed', (event, data) => {
  console.log(`✅ Processed ${event}`);
});

await client.connect();
console.log('Test bot online - send messages to generate events');
```

## Debugging

### Debug Configuration

VS Code launch configuration (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Mocha",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "runtimeExecutable": "bun",
      "runtimeArgs": ["--inspect"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

### Logging

Use structured logging for debugging:

```typescript
// Enable debug logging
process.env.LOG_LEVEL = 'debug';

// Use console methods appropriately
console.log('Info message');      // General information
console.warn('Warning message');  // Warnings
console.error('Error message');   // Errors
console.debug('Debug message');   // Debug information
```

### Database Inspection

Use Drizzle Studio to inspect database:

```bash
bun run db:studio
```

Or use SQLite command line:

```bash
sqlite3 data/stats.db
.tables
.schema message_events
SELECT COUNT(*) FROM message_events;
```

## Performance Profiling

### Memory Profiling

Monitor memory usage during development:

```typescript
function logMemoryUsage() {
  const usage = process.memoryUsage();
  console.log({
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    external: `${Math.round(usage.external / 1024 / 1024)}MB`
  });
}

setInterval(logMemoryUsage, 10000); // Every 10 seconds
```

### Performance Benchmarking

Create benchmarks for critical operations:

```typescript
async function benchmarkQueries() {
  const iterations = 1000;
  
  console.time('getUserStats');
  for (let i = 0; i < iterations; i++) {
    await client.getUserStats('guild', 'user', 30);
  }
  console.timeEnd('getUserStats');
}
```

## Troubleshooting

### Common Issues

**TypeScript Compilation Errors:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
bunx tsc --build --clean
bunx tsc
```

**Database Issues:**
```bash
# Reset database
rm -rf data/
bun run db:init
```

**Dependency Issues:**
```bash
# Clean install
rm -rf node_modules bun.lockb
bun install
```

**Biome Issues:**
```bash
# Reset Biome cache
rm -rf node_modules/.cache/biome
bun run check:fix
```

### Getting Help

- **Documentation** - Check the [docs/](./README.md) directory
- **Issues** - Search existing GitHub issues
- **Discussions** - Use GitHub Discussions for questions
- **Discord** - Join the development Discord server (if available)

## Contributing Guidelines

Before contributing, please read:

- [Contributing Guidelines](./contributing.md)
- [Code Style Guide](./code-style.md)
- [Commit Guidelines](./commit-guidelines.md)
- [Pull Request Template](./pull-request-template.md)

## Release Process

For maintainers, see the release process:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Create release PR
5. Tag release after merge
6. Publish to npm (when ready)

Happy coding! ☕
