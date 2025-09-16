import { MigrationManager } from '../migrations/manager';
import type { PostgresConfig } from '../types';

export async function initializePostgresDatabase(config: PostgresConfig): Promise<void> {
  const migrationManager = new MigrationManager(config);

  try {
    const result = await migrationManager.runMigrations();
    if (result.applied > 0) {
      console.log(`Applied ${result.applied} PostgreSQL migrations`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to initialize PostgreSQL database: ${message}`);
  }
}
