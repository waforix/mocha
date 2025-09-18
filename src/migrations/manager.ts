import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import type { DatabaseType } from '../generators/base';

export interface MigrationRecord {
  id: string;
  name: string;
  timestamp: Date;
  applied: boolean;
  checksum: string;
}

export class MigrationManager {
  private migrationsDir: string;
  private dbType: DatabaseType;

  constructor(dbType: DatabaseType, migrationsDir = './src/migrations') {
    this.dbType = dbType;
    this.migrationsDir = join(migrationsDir, dbType);
    
    if (!existsSync(this.migrationsDir)) {
      mkdirSync(this.migrationsDir, { recursive: true });
    }
  }

  createMigration(name: string, content: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `${timestamp}_${name.replace(/\s+/g, '_').toLowerCase()}.sql`;
    const filepath = join(this.migrationsDir, filename);
    
    writeFileSync(filepath, content);
    console.log(`Created migration: ${filename}`);
    
    return filename;
  }

  getPendingMigrations(): string[] {
    if (!existsSync(this.migrationsDir)) {
      return [];
    }

    const files = readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    return files;
  }

  getMigrationContent(filename: string): string {
    const filepath = join(this.migrationsDir, filename);
    return readFileSync(filepath, 'utf-8');
  }

  generateCreateTableMigration(tableName: string, columns: string[]): string {
    const columnDefs = columns.join(',\n  ');
    
    switch (this.dbType) {
      case 'sqlite':
        return `CREATE TABLE ${tableName} (\n  ${columnDefs}\n);`;
      case 'postgres':
        return `CREATE TABLE ${tableName} (\n  ${columnDefs}\n);`;
      case 'mysql':
        return `CREATE TABLE ${tableName} (\n  ${columnDefs}\n) ENGINE=InnoDB;`;
      case 'mongodb':
        return `db.createCollection('${tableName}');`;
      default:
        throw new Error(`Unsupported database type: ${this.dbType}`);
    }
  }

  generateAddColumnMigration(tableName: string, columnName: string, columnDef: string): string {
    switch (this.dbType) {
      case 'sqlite':
        return `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef};`;
      case 'postgres':
        return `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef};`;
      case 'mysql':
        return `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef};`;
      case 'mongodb':
        return `db.${tableName}.updateMany({}, { $set: { ${columnName}: null } });`;
      default:
        throw new Error(`Unsupported database type: ${this.dbType}`);
    }
  }

  generateDropColumnMigration(tableName: string, columnName: string): string {
    switch (this.dbType) {
      case 'sqlite':
        return `-- SQLite does not support DROP COLUMN directly\n-- Manual table recreation required`;
      case 'postgres':
        return `ALTER TABLE ${tableName} DROP COLUMN ${columnName};`;
      case 'mysql':
        return `ALTER TABLE ${tableName} DROP COLUMN ${columnName};`;
      case 'mongodb':
        return `db.${tableName}.updateMany({}, { $unset: { ${columnName}: "" } });`;
      default:
        throw new Error(`Unsupported database type: ${this.dbType}`);
    }
  }

  generateCreateIndexMigration(tableName: string, indexName: string, columns: string[]): string {
    const columnList = columns.join(', ');
    
    switch (this.dbType) {
      case 'sqlite':
        return `CREATE INDEX ${indexName} ON ${tableName} (${columnList});`;
      case 'postgres':
        return `CREATE INDEX ${indexName} ON ${tableName} (${columnList});`;
      case 'mysql':
        return `CREATE INDEX ${indexName} ON ${tableName} (${columnList});`;
      case 'mongodb':
        return `db.${tableName}.createIndex({ ${columns.map(col => `${col}: 1`).join(', ')} });`;
      default:
        throw new Error(`Unsupported database type: ${this.dbType}`);
    }
  }
}
