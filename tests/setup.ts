import { beforeAll, afterAll, afterEach } from 'vitest';
import { DatabaseClient } from '../src/database';

/**
 * Global test setup and teardown
 */

beforeAll(async () => {
  // Reset database client before tests
  DatabaseClient.reset();
});

afterEach(async () => {
  // Clean up after each test
  if (DatabaseClient.isConnected()) {
    await DatabaseClient.disconnect();
  }
});

afterAll(async () => {
  // Final cleanup
  DatabaseClient.reset();
});

