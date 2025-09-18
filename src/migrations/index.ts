export * from './manager';

import type { DatabaseType } from '../generators/base';
import { MigrationManager } from './manager';

export function createMigrationManager(dbType: DatabaseType) {
  return new MigrationManager(dbType);
}
