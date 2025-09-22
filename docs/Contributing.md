# Contributing

Thank you for your interest in contributing to Waforix! This guide will help you get started.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Git
- PostgreSQL (for testing)
- Redis (optional, for cache testing)

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/mocha.git
cd mocha

# Install dependencies
bun install

# Copy environment template
cp .env.example .env

# Set up test database
createdb waforix_test

# Run tests to verify setup
bun test

# Build the project
bun run build
```

### Environment Configuration

Create a `.env` file for development:

```bash
# Test Database
TEST_DB_TYPE=postgres
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_NAME=waforix_test
TEST_DB_USER=your_username
TEST_DB_PASSWORD=your_password

# Development Database
DEV_DB_TYPE=sqlite
DEV_DB_PATH=./dev-stats.db

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📋 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Write code following our style guidelines
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes
```bash
# Run all tests
bun test

# Run specific test file
bun test tests/database.test.ts

# Run tests with coverage
bun test --coverage

# Test with different databases
TEST_DB_TYPE=sqlite bun test
TEST_DB_TYPE=postgres bun test
```

### 4. Lint and Format
```bash
# Check code style
bun run check

# Fix formatting issues
bun run check:fix

# Type check
bunx tsc --noEmit
```

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add new analytics feature"
```

### 6. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📝 Code Style Guidelines

### TypeScript Standards
- Use TypeScript for all code
- Prefer `interface` over `type` for object shapes
- Use strict type checking
- Avoid `any` types (use `unknown` instead)

### Naming Conventions
- **Variables/Functions**: camelCase (`getUserStats`)
- **Classes/Types**: PascalCase (`StatsClient`, `DatabaseConfig`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_CACHE_SIZE`)
- **Files**: kebab-case (`database-config.ts`)

### Code Organization
```typescript
// Good: Organized imports
import type { DatabaseConfig } from './types';
import { createConnection } from './connection';
import { logger } from '../utils/logger';

// Good: Clear function structure
export async function getUserStats(
  guildId: string,
  userId: string,
  days = 30
): Promise<UserStats> {
  // Implementation
}

// Good: Proper error handling
try {
  const result = await database.query(sql, params);
  return result;
} catch (error) {
  logger.error('Query failed:', error);
  throw new DatabaseError('Failed to execute query', { cause: error });
}
```

### Documentation
- Add JSDoc comments for public APIs
- Include examples in documentation
- Update README for new features

```typescript
/**
 * Get comprehensive server statistics
 * @param guildId - Discord guild ID
 * @param days - Number of days to analyze (default: 30)
 * @returns Promise resolving to server statistics
 * @example
 * ```typescript
 * const stats = await client.getServerStats('123456789', 7);
 * console.log(`Messages: ${stats.totalMessages}`);
 * ```
 */
export async function getServerStats(
  guildId: string,
  days = 30
): Promise<ServerStats> {
  // Implementation
}
```

## 🧪 Testing Guidelines

### Test Structure
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { StatsClient } from '../src';

describe('StatsClient', () => {
  let client: StatsClient;

  beforeEach(async () => {
    client = new StatsClient({
      database: {
        type: 'sqlite',
        path: ':memory:' // In-memory for tests
      }
    });
    await client.initialize();
  });

  afterEach(async () => {
    await client.disconnect();
  });

  it('should track message events', async () => {
    await client.trackMessage({
      id: 'test-message',
      userId: 'test-user',
      guildId: 'test-guild',
      channelId: 'test-channel',
      content: 'Test message',
      timestamp: Date.now(),
      attachmentCount: 0,
      embedCount: 0
    });

    const stats = await client.getServerStats('test-guild', 1);
    expect(stats.totalMessages).toBe(1);
  });
});
```

### Test Categories
- **Unit Tests**: Test individual functions/methods
- **Integration Tests**: Test database interactions
- **E2E Tests**: Test complete workflows
- **Performance Tests**: Test with large datasets

### Test Data
```typescript
// Use factories for test data
export function createTestMessage(overrides = {}) {
  return {
    id: 'test-message-' + Math.random(),
    userId: 'test-user',
    guildId: 'test-guild',
    channelId: 'test-channel',
    content: 'Test message',
    timestamp: Date.now(),
    attachmentCount: 0,
    embedCount: 0,
    ...overrides
  };
}
```

## 🏗️ Architecture Guidelines

### Database Layer
- Use the adapter pattern for database abstraction
- Keep SQL queries in dedicated query classes
- Handle database-specific differences gracefully

### Error Handling
```typescript
// Custom error classes
export class WaforixError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'WaforixError';
  }
}

export class DatabaseError extends WaforixError {
  constructor(message: string, details?: any) {
    super(message, 'DATABASE_ERROR', details);
    this.name = 'DatabaseError';
  }
}

// Usage
throw new DatabaseError('Connection failed', { host, port });
```

### Performance Considerations
- Use connection pooling for databases
- Implement caching for expensive operations
- Use batch processing for bulk operations
- Add performance monitoring

## 📚 Documentation Standards

### README Updates
- Update feature list for new capabilities
- Add examples for new functionality
- Update installation instructions if needed

### Wiki Documentation
- Create new wiki pages for major features
- Update existing pages for changes
- Include practical examples
- Add troubleshooting sections

### API Documentation
- Document all public methods
- Include parameter types and descriptions
- Provide usage examples
- Document error conditions

## 🔍 Code Review Process

### Before Submitting PR
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] No breaking changes (or clearly documented)
- [ ] Performance impact considered

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Criteria
- Code quality and readability
- Test coverage and quality
- Performance implications
- Security considerations
- Documentation completeness

## 🐛 Bug Reports

### Creating Issues
Use the issue template and include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error messages/stack traces

### Fixing Bugs
1. Create test that reproduces the bug
2. Fix the bug
3. Ensure test passes
4. Add regression test if needed

## ✨ Feature Requests

### Proposing Features
- Open a discussion first for major features
- Explain the use case and benefits
- Consider backwards compatibility
- Provide implementation ideas

### Implementing Features
1. Discuss design approach
2. Create feature branch
3. Implement with tests
4. Update documentation
5. Submit PR for review

## 🚀 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] NPM package published

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow GitHub's community guidelines

### Communication
- Use GitHub Issues for bugs and features
- Use GitHub Discussions for questions
- Join our Discord for real-time chat
- Be patient and helpful with newcomers

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Additional database support
- Better error handling
- More comprehensive tests

### Medium Priority
- Documentation improvements
- Example applications
- Integration guides
- Monitoring tools

### Good First Issues
- Documentation fixes
- Simple bug fixes
- Test improvements
- Code style fixes

## 📞 Getting Help

### Development Questions
- Check existing documentation
- Search GitHub Issues
- Ask in GitHub Discussions
- Join our Discord community

### Stuck on Something?
Don't hesitate to ask for help! We're here to support contributors.

## 🙏 Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributor graphs
- Special thanks in major releases

Thank you for contributing to Waforix! 🎉
