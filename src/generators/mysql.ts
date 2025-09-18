import { z } from 'zod';
import { SchemaGenerator, type FieldMapping, type TableMapping } from './base';

export class MysqlGenerator extends SchemaGenerator {
  constructor() {
    super('mysql');
  }

  generateSchema(schemas: Record<string, z.ZodSchema>): string {
    const imports = [
      "import { int, mysqlTable, varchar, text, timestamp, boolean, index } from 'drizzle-orm/mysql-core';"
    ];

    const tables: string[] = [];

    for (const [schemaName, zodSchema] of Object.entries(schemas)) {
      const tableMapping = this.mapSchemaToTable(schemaName, zodSchema);
      const tableDefinition = this.generateTableDefinition(tableMapping);
      tables.push(tableDefinition);
    }

    return [
      ...imports,
      '',
      ...tables
    ].join('\n');
  }

  generateMigration(oldSchema: Record<string, z.ZodSchema>, newSchema: Record<string, z.ZodSchema>): string {
    return '';
  }

  protected getFieldType(zodType: z.ZodTypeAny): string {
    const def = (zodType as any)._def;
    const type = def.type;

    if (type === 'string') {
      return 'varchar';
    }
    if (type === 'number') {
      return 'int';
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
    return 'varchar';
  }

  protected formatDefaultValue(value: any): string {
    if (typeof value === 'function') {
      const funcStr = value.toString();
      if (funcStr.includes('randomUUID')) {
        return `.$defaultFn(() => crypto.randomUUID())`;
      }
      if (funcStr.includes('new Date')) {
        return '.defaultNow()';
      }
      return `.$defaultFn(() => ${funcStr})`;
    }
    if (typeof value === 'string') {
      if (value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        return `.$defaultFn(() => crypto.randomUUID())`;
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
    return schemaName.toLowerCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '');
  }

  private mapSchemaToTable(schemaName: string, zodSchema: z.ZodSchema): TableMapping {
    const tableName = this.getTableName(schemaName);
    const shape = (zodSchema as any)._def.shape;
    const fields: FieldMapping[] = [];
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
          onDelete: 'cascade'
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
    const fields = table.fields.map(field => {
      let fieldDef = '';

      if (field.type === 'varchar') {
        fieldDef = `  ${field.name}: varchar('${field.name}', { length: 255 })`;
      } else if (field.type === 'int') {
        fieldDef = `  ${field.name}: int('${field.name}')`;
      } else if (field.type === 'boolean') {
        fieldDef = `  ${field.name}: boolean('${field.name}')`;
      } else if (field.type === 'timestamp') {
        fieldDef = `  ${field.name}: timestamp('${field.name}')`;
      } else if (field.type === 'text') {
        fieldDef = `  ${field.name}: text('${field.name}')`;
      } else {
        fieldDef = `  ${field.name}: varchar('${field.name}', { length: 255 })`;
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
    }).join(',\n');

    const indexDefs = table.indexes.map(idx =>
      `    ${idx.name}: index('${idx.name}').on(table.${idx.columns.join(', table.')})`
    ).join(',\n');

    const indexSection = table.indexes.length > 0
      ? `,\n  (table) => ({\n${indexDefs}\n  })`
      : '';

    return `export const ${table.name}Table = mysqlTable('${table.name}', {\n${fields}\n}${indexSection});`;
  }
}
