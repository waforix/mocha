import { Database } from 'bun:sqlite';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function checkDatabaseExists(sqlite: Database): boolean {
  try {
    const result = sqlite
      .query("SELECT name FROM sqlite_master WHERE type='table' AND name='guilds'")
      .get();
    return !!result;
  } catch {
    return false;
  }
}

function loadMigrationStatements(): string[] {
  const libRoot = join(import.meta.dir, '../..');
  const migrationPath = join(libRoot, 'drizzle/0000_wandering_raza.sql');
  const migration = readFileSync(migrationPath, 'utf-8');
  return migration
    .split('--> statement-breakpoint')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt && !stmt.startsWith('-->'));
}

function executeStatement(sqlite: Database, statement: string): void {
  try {
    sqlite.exec(statement.trim());
  } catch (error) {
    if (!(error instanceof Error) || !error.message?.includes('already exists')) {
      throw error;
    }
  }
}

export function initializeDatabase(dbPath: string): void {
  const sqlite = new Database(dbPath);

  if (checkDatabaseExists(sqlite)) {
    sqlite.close();
    return;
  }

  try {
    const statements = loadMigrationStatements();
    for (const statement of statements) {
      if (statement.trim()) {
        executeStatement(sqlite, statement);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to initialize database: ${message}`);
  } finally {
    sqlite.close();
  }
}
