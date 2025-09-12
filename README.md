# Mocha ☕

High-performance Discord bot library for statistics tracking with optimized database queries and intelligent caching.

## 🚀 Features

- **Real-time Discord Gateway connection** with automatic reconnection and exponential backoff
- **Optimized SQLite database** with WAL mode, performance pragmas, and composite indexes
- **Intelligent LRU caching** with configurable TTL and type-safe key generation
- **Component-based architecture** with lightweight, modular files under 50 lines each
- **High-performance queries** with specialized handlers and batch operations
- **Full TypeScript support** with strict type safety and zero `any` types
- **Production-ready** with comprehensive error handling and memory optimization

## 🔧 Quick Start

```typescript
import { StatsClient, INTENTS } from 'mocha';

const client = new StatsClient({
  token: 'your-bot-token',
  intents: INTENTS.GUILDS | INTENTS.GUILD_MESSAGES | INTENTS.GUILD_VOICE_STATES,
  dbPath: './data/stats.db',
  cache: {
    userStatsSize: 1000,
    guildStatsSize: 100,
    ttlMs: 300000, // 5 minutes
  },
});

// Connect and start tracking
await client.connect();

// Get statistics
const userStats = await client.getUserStats('guild-id', 'user-id', 30);
const guildStats = await client.getGuildStats('guild-id', 30);
const leaderboard = await client.getLeaderboard('guild-id', 'messages', 10, 30);
const heatmap = await client.getActivityHeatmap('guild-id', 'user-id', 7);

// Cache management
console.log('Cache stats:', client.getCacheStats());
client.clearCache();
```

## � Documentation

For comprehensive guides and API documentation, visit the [`/docs`](./docs) directory:

- **[Getting Started](./docs/getting-started.md)** - Installation and basic setup
- **[API Reference](./docs/api-reference.md)** - Complete API documentation
- **[Contributing](./docs/contributing.md)** - How to contribute to the project
- **[Commit Guidelines](./docs/commit-guidelines.md)** - Commit message standards

## 🏗️ Architecture

Mocha follows a modular, component-based architecture with lightweight files under 50 lines each:

```
src/
├── cache/          # LRU caching with type-safe keys
├── db/             # Database connection and schemas
├── events/         # Event dispatching and processing
├── gateway/        # Discord Gateway client with reconnection
├── lib/            # Main client interface
├── processors/     # Event processors for different Discord events
├── stats/          # Statistics aggregation and specialized queries
├── types/          # TypeScript type definitions
└── utils/          # Shared utilities (date, backoff, etc.)
```

## ⚡ Performance Optimizations

- SQLite WAL mode with optimized pragmas
- Composite database indexes on query patterns
- Intelligent LRU caching with configurable TTL
- Batch database operations
- Memory-efficient data structures
- Component-based architecture for minimal overhead
- Modular query system with specialized handlers
- Type-safe cache key generation
- Optimized cache invalidation algorithms
- Exponential backoff for reconnection logic

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./docs/contributing.md) for details on:

- Code standards and style guide
- Development setup and workflow
- Commit message format
- Pull request process

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## ☕ Why Mocha?

Just like a perfect cup of mocha combines the best of coffee and chocolate, this library combines the best of performance and simplicity to create the perfect Discord stats tracking experience!



### File Organization

- **Keep files small** - Maximum 50 lines per file when possible
- **Single responsibility** - Each file should have one clear purpose
- **Component-based** - Break functionality into focused modules
- **Minimal comments** - Code should be self-documenting

### TypeScript Standards

- **Strict mode** - All TypeScript strict checks enabled
- **No `any` types** - Use `unknown` and proper type assertions
- **Explicit return types** - For public methods and complex functions
- **Interface over type** - Use interfaces for object shapes

### Code Style

We use **Biome** for formatting and linting:

```bash
# Check code style
bun run check

# Auto-fix issues
bun run check:fix

# Format code
bun run format:fix
```

### Performance Guidelines

- **Prefer iteration over array methods** - For cache invalidation and large datasets
- **Use specialized query modules** - Don't put all queries in one class
- **Implement proper caching** - Cache expensive operations with appropriate TTL
- **Optimize database queries** - Use indexes and avoid N+1 queries

## 🔄 Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feat/` - New features
- `fix/` - Bug fixes
- `perf/` - Performance improvements
- `docs/` - Documentation changes
- `test/` - Test additions/improvements
- `refactor/` - Code refactoring

Examples:
- `feat/add-channel-stats`
- `fix/cache-invalidation-bug`
- `perf/optimize-message-queries`

### Making Changes

1. **Create a feature branch**
   ```bash
git checkout -b feat/your-feature-name
```

2. **Make your changes**
   - Follow the code standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
bun run check
   bunx tsc
   bun run test-complete.ts
```

4. **Commit your changes**
   ```bash
git add .
   git commit -m "feat: add channel statistics tracking"
```

5. **Push and create PR**
   ```bash
git push origin feat/your-feature-name
```

## 📋 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] TypeScript compilation succeeds
- [ ] Documentation is updated
- [ ] Commit messages follow conventions

### PR Requirements

1. **Clear title** - Descriptive and follows commit conventions
2. **Detailed description** - Explain what and why
3. **Link related issues** - Reference issue numbers
4. **Test coverage** - Include tests for new functionality
5. **Breaking changes** - Clearly document any breaking changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Performance improvement
- [ ] Documentation update
- [ ] Breaking change

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🧪 Testing Guidelines

### Test Requirements

- **Unit tests** - For individual functions and classes
- **Integration tests** - For component interactions
- **Performance tests** - For critical paths
- **Type tests** - For TypeScript type safety

### Running Tests

```bash
# Run all tests
bun run test-complete.ts

# Type checking
bunx tsc

# Code quality
bun run check
```

### Writing Tests

- **Test file naming** - `*.test.ts` or `*.spec.ts`
- **Descriptive test names** - Clearly describe what is being tested
- **Arrange-Act-Assert** - Structure tests clearly
- **Mock external dependencies** - Don't rely on external services

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Create release PR
5. Tag release after merge
6. Publish to npm

## 🤔 Questions?

- **General questions** - Create a discussion
- **Bug reports** - Create an issue with bug template
- **Feature requests** - Create an issue with feature template
- **Security issues** - Email maintainers directly

## 📜 Code of Conduct

- **Be respectful** - Treat all contributors with respect
- **Be constructive** - Provide helpful feedback
- **Be patient** - Reviews take time
- **Be collaborative** - Work together to improve the project

Thank you for contributing to the Discord Stats Library! 🎉
- `users` - User information
- `channels` - Channel information
- `members` - Guild membership data
- `message_events` - Message statistics
- `voice_events` - Voice activity tracking
- `member_events` - Join/leave events
- `presence_events` - Status/activity changes

## Development

```bash
# Lint and format code
bun run lint
bun run format:fix

# Type checking
bunx tsc

# Run tests
bun run test-complete.ts
```

## Performance

- SQLite with WAL mode and optimized pragmas
- Composite indexes on frequently queried columns
- LRU caching with configurable TTL
- Efficient batch operations
- Memory-optimized data structures

## Architecture

### Component-Based Design
- **Gateway**: WebSocket connection with auto-reconnection
- **Processors**: Event-specific data processing
- **Database**: Optimized SQLite with proper indexing
- **Cache**: LRU cache with TTL for performance
- **Stats**: High-performance query engine
- **API**: Clean, developer-friendly interface

### Performance Optimizations
- SQLite WAL mode with optimized pragmas
- Composite database indexes on query patterns
- Intelligent LRU caching with configurable TTL
- Batch database operations
- Memory-efficient data structures
- Component-based architecture for minimal overhead
- Modular query system with specialized handlers
- Type-safe cache key generation
- Optimized cache invalidation algorithms
- Exponential backoff for reconnection logic

## Scripts

- `bun run dev` - Development mode with hot reload
- `bun run build` - Build for production
- `bun run db:generate` - Generate database migrations
- `bun run db:init` - Initialize database with schema
- `bun run db:studio` - Open Drizzle Studio
