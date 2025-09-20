# Testing Guide

## Running Tests

### All Tests
```bash
bun test
```

### Watch Mode
```bash
bun test --watch
```

### Coverage Report
```bash
bun test --coverage
```

## Test Structure

### Unit Tests
- `src/__tests__/utils/` - Utility function tests
- `src/__tests__/cache/` - Cache implementation tests
- `src/__tests__/db/` - Database layer tests
- `src/__tests__/lib/` - Client library tests
- `src/__tests__/events/` - Event handling tests

### Test Utilities

#### setupTestDb()
Creates isolated test database for each test.

```typescript
import { setupTestDb } from '../utils/setup';

const dbManager = setupTestDb();
```

#### Mock Factories
Generate test data for Discord entities.

```typescript
import { createMockMessage, createMockVoiceState } from '../utils/mocks';

const message = createMockMessage({ content: 'test' });
```

## Writing Tests

### Test File Structure
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('feature group', () => {
    it('should do something', () => {
      // Test implementation
    });
  });
});
```

### Best Practices

1. **Isolation** - Each test should be independent
2. **Cleanup** - Always clean up resources in afterEach
3. **Descriptive Names** - Use clear test descriptions
4. **Edge Cases** - Test both success and failure scenarios
5. **Async Handling** - Properly handle async operations

### Database Tests

Use in-memory SQLite for fast, isolated tests:

```typescript
const testConfig: DatabaseConfig = {
  type: 'sqlite',
  path: ':memory:',
};
```

### Validation Tests

Test both valid and invalid inputs:

```typescript
it('validates input', () => {
  expect(() => validateGuildId('valid123456789012345678')).not.toThrow();
  expect(() => validateGuildId('invalid')).toThrow();
});
```

### Resource Cleanup

Always clean up resources to prevent memory leaks:

```typescript
afterEach(async () => {
  await client.close();
  cache.destroy();
});
```

## Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 95%
- **Lines**: > 90%

## Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch commits
- Release tags

All tests must pass before merging.
