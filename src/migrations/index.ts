export * from './manager';

import { MigrationManager } from './manager';
import type { DatabaseType } from '../generators/base';

export function createMigrationManager(dbType: DatabaseType) {
  return new MigrationManager(dbType);
}
