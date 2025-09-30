import type { z } from 'zod';
import { type FieldMapping, SchemaGenerator, type TableMapping, type ZodInternalDef } from './base';

export class SqliteGenerator extends SchemaGenerator {
  constructor() {
    super('sqlite');
  }

  generateSchema(schemas: Record<string, z.ZodSchema>): string {
    const imports = [
      "import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';",
    ];

    const tables: string[] = [];

    for (const [schemaName, zodSchema] of Object.entries(schemas)) {
      const tableMapping = this.mapSchemaToTable(schemaName, zodSchema);
      const tableDefinition = this.generateTableDefinition(tableMapping);
      tables.push(tableDefinition);
    }

    return [...imports, '', ...tables].join('\n');
  }

  generateMigration(
    _oldSchema: Record<string, z.ZodSchema>,
    _newSchema: Record<string, z.ZodSchema>
  ): string {
    return '';
  }

  protected getFieldType(zodType: z.ZodTypeAny): string {
    const def = (zodType as { _def: ZodInternalDef })._def;
    const type = def.type;

    if (type === 'string') {
      return 'text';
    }
    if (type === 'number') {
      return 'integer';
    }
    if (type === 'boolean') {
      return 'integer';
    }
    if (type === 'date') {
      return 'integer';
    }
    if (type === 'array') {
      return 'text';
    }
    if (type === 'optional' || type === 'nullable' || type === 'default') {
      return def.innerType ? this.getFieldType(def.innerType) : 'text';
    }
    return 'text';
  }

  protected formatAutoNow(): string {
    return '.$defaultFn(() => Date.now())';
  }

  protected formatAutoUUID(): string {
    return '.$defaultFn(() => crypto.randomUUID())';
  }

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Complex type mapping is necessary
  protected formatDefaultValue(value: unknown): string {
    if (typeof value === 'function') {
      const funcStr = value.toString();
      if (funcStr.includes('randomUUID')) {
        return '.$defaultFn(() => crypto.randomUUID())';
      }
      if (funcStr.includes('new Date') || funcStr.includes('Date.now')) {
        return '.$defaultFn(() => Date.now())';
      }
      if (funcStr.includes('[]')) {
        return ".default('[]')";
      }
      return `.$defaultFn(${funcStr})`;
    }
    if (typeof value === 'string') {
      if (value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        return '.$defaultFn(() => crypto.randomUUID())';
      }
      return `.default('${value}')`;
    }
    if (typeof value === 'number') {
      return `.default(${value})`;
    }
    if (typeof value === 'boolean') {
      return `.default(${value ? 1 : 0})`;
    }
    if (Array.isArray(value)) {
      return `.default('${JSON.stringify(value)}')`;
    }
    return '';
  }

  private getTableName(schemaName: string): string {
    return schemaName
      .toLowerCase()
      .replace(/([A-Z])/g, '_$1')
      .replace(/^_/, '');
  }

  private mapSchemaToTable(schemaName: string, zodSchema: z.ZodSchema): TableMapping {
    const tableName = this.getTableName(schemaName);
    const shape = (zodSchema as { _def: ZodInternalDef })._def.shape;
    const fields: FieldMapping[] = [];
    const indexes: Array<{ name: string; columns: string[]; unique?: boolean }> = [];

    if (!shape) {
      return { name: tableName, fields, indexes };
    }

    for (const [fieldName, zodType] of Object.entries(shape)) {
      const field = this.mapZodToField(zodType as z.ZodTypeAny, fieldName);

      if (fieldName === 'id') {
        field.primaryKey = true;
      }

      if (fieldName.endsWith('Id') && fieldName !== 'id' && this.shouldCreateReference(fieldName)) {
        const refTableName = this.getRefTableName(fieldName);
        field.references = {
          table: refTableName,
          column: 'id',
          onDelete: 'cascade',
        };
      }

      fields.push(field);
    }

    return { name: tableName, fields, indexes };
  }

  private shouldCreateReference(fieldName: string): boolean {
    const baseName = fieldName.replace(/Id$/, '');
    const validReferences = ['guild', 'user', 'member', 'owner'];
    return validReferences.includes(baseName);
  }

  private getRefTableName(fieldName: string): string {
    const baseName = fieldName.replace(/Id$/, '');
    if (baseName === 'guild') return 'guildTable';
    if (baseName === 'channel') return 'channelTable';
    if (baseName === 'user') return 'userTable';
    if (baseName === 'member') return 'memberTable';
    if (baseName === 'parent') return 'channelTable';
    if (baseName === 'owner') return 'userTable';
    return `${baseName}Table`;
  }

  private generateTableDefinition(table: TableMapping): string {
    const fields = table.fields
      .map((field) => {
        let fieldDef = `  ${field.name}: ${field.type}('${field.name}')`;

        if (field.primaryKey) {
          fieldDef += '.primaryKey()';
        }

        if (!field.nullable && !field.primaryKey) {
          fieldDef += '.notNull()';
        }

        if (field.references) {
          fieldDef += `\n    .references(() => ${field.references.table}.id, { onDelete: '${field.references.onDelete}' })`;
        }

        if (field.defaultValue) {
          fieldDef += field.defaultValue;
        }

        return fieldDef;
      })
      .join(',\n');

    const indexDefs = table.indexes
      .map(
        (idx) => `    ${idx.name}: index('${idx.name}').on(table.${idx.columns.join(', table.')})`
      )
      .join(',\n');

    const indexSection = table.indexes.length > 0 ? `,\n  (table) => ({\n${indexDefs}\n  })` : '';

    return `export const ${table.name}Table = sqliteTable('${table.name}', {\n${fields}\n}${indexSection});`;
  }
}
