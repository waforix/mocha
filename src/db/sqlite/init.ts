import { MigrationManager } from '../migrations/manager';
import type { SqliteConfig } from '../types';

export async function initializeSqliteDatabase(dbPath: string): Promise<void> {
  const config: SqliteConfig = {
    type: 'sqlite',
    path: dbPath,
  };

  const migrationManager = new MigrationManager(config);

  try {
    const result = await migrationManager.runMigrations();
    if (result.applied > 0) {
      console.log(`Applied ${result.applied} SQLite migrations`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to initialize SQLite database: ${message}`);
  }
}
