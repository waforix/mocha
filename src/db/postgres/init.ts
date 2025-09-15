import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postgres from 'postgres';
import type { PostgresConfig } from '../types';

async function checkDatabaseExists(
  client: postgres.Sql,
  _config: PostgresConfig
): Promise<boolean> {
  try {
    const result = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'guilds'
      )
    `;
    return result[0]?.exists || false;
  } catch {
    return false;
  }
}

function loadMigrationStatements(): string[] {
  const libRoot = join(import.meta.dir, '../../..');
  const migrationPath = join(libRoot, 'drizzle/postgres/0000_initial.sql');

  try {
    const migration = readFileSync(migrationPath, 'utf-8');
    return migration
      .split('--> statement-breakpoint')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && !stmt.startsWith('-->'));
  } catch {
    return [];
  }
}

async function executeStatement(client: postgres.Sql, statement: string): Promise<void> {
  try {
    await client.unsafe(statement.trim());
  } catch (error) {
    if (!(error instanceof Error) || !error.message?.includes('already exists')) {
      throw error;
    }
  }
}

export async function initializePostgresDatabase(config: PostgresConfig): Promise<void> {
  const connectionString = `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
  const client = postgres(connectionString, {
    max: 1,
    ssl: config.ssl ? 'require' : false,
  });

  try {
    if (await checkDatabaseExists(client, config)) {
      return;
    }

    const statements = loadMigrationStatements();
    for (const statement of statements) {
      if (statement.trim()) {
        await executeStatement(client, statement);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to initialize PostgreSQL database: ${message}`);
  } finally {
    await client.end();
  }
}
