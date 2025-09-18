import type { z } from 'zod';
import { type FieldMapping, SchemaGenerator, type TableMapping } from './base';

export class PostgresGenerator extends SchemaGenerator {
  constructor() {
    super('postgres');
  }

  generateSchema(schemas: Record<string, z.ZodSchema>): string {
    const imports = [
      "import { integer, pgTable, text, timestamp, uuid, boolean, index } from 'drizzle-orm/pg-core';",
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
    // biome-ignore lint/suspicious/noExplicitAny: Required for accessing Zod internal _def property
    const def = (zodType as any)._def;
    const type = def.type;

    if (type === 'string') {
      const checks = def.checks;
      // biome-ignore lint/suspicious/noExplicitAny: Required for accessing Zod internal check structure
      if (checks?.some((check: any) => check.kind === 'uuid')) {
        return 'uuid';
      }
      return 'text';
    }
    if (type === 'number') {
      return 'integer';
    }
    if (type === 'boolean') {
      return 'boolean';
    }
    if (type === 'date') {
      return 'timestamp';
    }
    if (type === 'array') {
      return 'text';
    }
    if (type === 'optional' || type === 'nullable' || type === 'default') {
      return this.getFieldType(def.innerType);
    }
    return 'text';
  }

  // biome-ignore lint/suspicious/noExplicitAny: Required for flexible default value handling
  protected formatDefaultValue(value: any): string {
    if (typeof value === 'function') {
      const funcStr = value.toString();
      if (funcStr.includes('randomUUID')) {
        return '.defaultRandom()';
      }
      if (funcStr.includes('new Date')) {
        return '.defaultNow()';
      }
      return `.$defaultFn(() => ${funcStr})`;
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
      return `.default(${value})`;
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
    // biome-ignore lint/suspicious/noExplicitAny: Required for accessing Zod internal _def property
    const shape = (zodSchema as any)._def.shape;
    const fields: FieldMapping[] = [];
    // biome-ignore lint/suspicious/noExplicitAny: Required for flexible index definition handling
    const indexes: any[] = [];

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
        let fieldDef = '';

        if (field.type === 'timestamp') {
          fieldDef = `  ${field.name}: timestamp('${field.name}', { withTimezone: true })`;
        } else if (field.type === 'uuid') {
          fieldDef = `  ${field.name}: uuid('${field.name}')`;
        } else if (field.type === 'boolean') {
          fieldDef = `  ${field.name}: boolean('${field.name}')`;
        } else if (field.type === 'integer') {
          fieldDef = `  ${field.name}: integer('${field.name}')`;
        } else {
          fieldDef = `  ${field.name}: text('${field.name}')`;
        }

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

    return `export const ${table.name}Table = pgTable('${table.name}', {\n${fields}\n}${indexSection});`;
  }
}
