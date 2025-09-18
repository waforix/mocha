import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { AllSchemas } from '../schemas';
import { type DatabaseType, getGenerator } from './index';

export class SchemaManager {
  private outputDir: string;

  constructor(outputDir = './src/db/generated') {
    this.outputDir = outputDir;
  }

  generateAll() {
    const databases: DatabaseType[] = ['sqlite', 'postgres', 'mysql', 'mongodb'];

    for (const dbType of databases) {
      this.generateForDatabase(dbType);
    }
  }

  generateForDatabase(dbType: DatabaseType) {
    const generator = getGenerator(dbType);
    const schemaContent = generator.generateSchema(AllSchemas);

    const dbDir = join(this.outputDir, dbType);
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }

    const schemaFile = join(dbDir, 'schema.ts');
    writeFileSync(schemaFile, schemaContent);

    const indexFile = join(dbDir, 'index.ts');
    writeFileSync(indexFile, "export * from './schema';");

    console.log(`Generated ${dbType} schema at ${schemaFile}`);
  }

  // biome-ignore lint/suspicious/noExplicitAny: Required for flexible schema comparison across database types
  generateMigration(dbType: DatabaseType, oldSchemas: Record<string, any> = {}) {
    const generator = getGenerator(dbType);
    const migrationContent = generator.generateMigration(oldSchemas, AllSchemas);

    if (migrationContent) {
      const dbDir = join(this.outputDir, dbType, 'migrations');
      if (!existsSync(dbDir)) {
        mkdirSync(dbDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const migrationFile = join(dbDir, `${timestamp}.sql`);
      writeFileSync(migrationFile, migrationContent);

      console.log(`Generated ${dbType} migration at ${migrationFile}`);
    }
  }
}

export const schemaManager = new SchemaManager();
