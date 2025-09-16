import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Database } from 'bun:sqlite';
import postgres from 'postgres';
import type { DatabaseConfig, PostgresConfig, SqliteConfig } from '../types';

export interface MigrationInfo {
  id: string;
  name: string;
  sql: string;
  appliedAt?: Date;
}

export class MigrationManager {
  private config: DatabaseConfig;
  private migrationsPath: string;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.migrationsPath = this.getMigrationsPath();
  }

  private getMigrationsPath(): string {
    const root = join(import.meta.dir, '../../..');
    return join(root, 'drizzle', this.config.type);
  }

  private async ensureMigrationsTable(): Promise<void> {
    if (this.config.type === 'sqlite') {
      const sqlite = new Database((this.config as SqliteConfig).path);
      try {
        sqlite.exec(`
          CREATE TABLE IF NOT EXISTS __drizzle_migrations (
            id TEXT PRIMARY KEY,
            hash TEXT NOT NULL,
            created_at INTEGER NOT NULL
          )
        `);
      } finally {
        sqlite.close();
      }
    } else {
      const pgConfig = this.config as PostgresConfig;
      const connectionString = `postgres://${pgConfig.username}:${pgConfig.password}@${pgConfig.host}:${pgConfig.port}/${pgConfig.database}`;
      const client = postgres(connectionString, {
        max: 1,
        ssl: pgConfig.ssl ? 'require' : false,
      });

      try {
        await client`
          CREATE TABLE IF NOT EXISTS __drizzle_migrations (
            id TEXT PRIMARY KEY,
            hash TEXT NOT NULL,
            created_at BIGINT NOT NULL
          )
        `;
      } finally {
        await client.end();
      }
    }
  }

  private async getAppliedMigrations(): Promise<Set<string>> {
    await this.ensureMigrationsTable();

    if (this.config.type === 'sqlite') {
      const sqlite = new Database((this.config as SqliteConfig).path);
      try {
        const result = sqlite.query('SELECT id FROM __drizzle_migrations').all() as Array<{ id: string }>;
        return new Set(result.map(row => row.id));
      } finally {
        sqlite.close();
      }
    } else {
      const pgConfig = this.config as PostgresConfig;
      const connectionString = `postgres://${pgConfig.username}:${pgConfig.password}@${pgConfig.host}:${pgConfig.port}/${pgConfig.database}`;
      const client = postgres(connectionString, {
        max: 1,
        ssl: pgConfig.ssl ? 'require' : false,
      });

      try {
        const result = await client`SELECT id FROM __drizzle_migrations`;
        return new Set(result.map(row => row.id));
      } finally {
        await client.end();
      }
    }
  }

  private getAvailableMigrations(): MigrationInfo[] {
    if (!existsSync(this.migrationsPath)) {
      return [];
    }

    const files = readdirSync(this.migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort();

    return files.map(file => {
      const id = file.replace('.sql', '');
      const sql = readFileSync(join(this.migrationsPath, file), 'utf-8');
      
      return {
        id,
        name: file,
        sql: this.cleanMigrationSql(sql),
      };
    });
  }

  private cleanMigrationSql(sql: string): string {
    return sql
      .split('--> statement-breakpoint')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('-->'))
      .join(';\n');
  }

  private async executeMigration(migration: MigrationInfo): Promise<void> {
    const statements = migration.sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt);

    if (this.config.type === 'sqlite') {
      const sqlite = new Database((this.config as SqliteConfig).path);
      try {
        sqlite.exec('BEGIN TRANSACTION');
        
        for (const statement of statements) {
          if (statement) {
            sqlite.exec(statement);
          }
        }

        sqlite.exec(`
          INSERT INTO __drizzle_migrations (id, hash, created_at) 
          VALUES (?, ?, ?)
        `, [migration.id, this.hashString(migration.sql), Date.now()]);

        sqlite.exec('COMMIT');
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      } finally {
        sqlite.close();
      }
    } else {
      const pgConfig = this.config as PostgresConfig;
      const connectionString = `postgres://${pgConfig.username}:${pgConfig.password}@${pgConfig.host}:${pgConfig.port}/${pgConfig.database}`;
      const client = postgres(connectionString, {
        max: 1,
        ssl: pgConfig.ssl ? 'require' : false,
      });

      try {
        await client.begin(async sql => {
          for (const statement of statements) {
            if (statement) {
              await sql.unsafe(statement);
            }
          }

          await sql`
            INSERT INTO __drizzle_migrations (id, hash, created_at) 
            VALUES (${migration.id}, ${this.hashString(migration.sql)}, ${Date.now()})
          `;
        });
      } finally {
        await client.end();
      }
    }
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  async runMigrations(): Promise<{ applied: number; total: number }> {
    const availableMigrations = this.getAvailableMigrations();
    const appliedMigrations = await this.getAppliedMigrations();

    const pendingMigrations = availableMigrations.filter(
      migration => !appliedMigrations.has(migration.id)
    );

    for (const migration of pendingMigrations) {
      console.log(`Applying migration: ${migration.name}`);
      await this.executeMigration(migration);
    }

    return {
      applied: pendingMigrations.length,
      total: availableMigrations.length,
    };
  }

  async getMigrationStatus(): Promise<{
    available: MigrationInfo[];
    applied: Set<string>;
    pending: MigrationInfo[];
  }> {
    const available = this.getAvailableMigrations();
    const applied = await this.getAppliedMigrations();
    const pending = available.filter(migration => !applied.has(migration.id));

    return { available, applied, pending };
  }
}
