import { afterAll, afterEach, beforeAll } from 'vitest';
import { disconnect, isConnected, reset } from '../src/database';

/**
 * Global test setup and teardown
 */

beforeAll(async () => {
  // Reset database client before tests
  reset();
});

afterEach(async () => {
  // Clean up after each test
  if (isConnected()) {
    await disconnect();
  }
});

afterAll(async () => {
  // Final cleanup
  reset();
});

