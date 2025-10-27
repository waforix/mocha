import type { z } from 'zod';
import { type FieldMapping, SchemaGenerator, type TableMapping, type ZodInternalDef } from './base';

export class MysqlGenerator extends SchemaGenerator {
  constructor() {
    super('mysql');
  }

  generateSchema(schemas: Record<string, z.ZodSchema>): string {
    const imports = [
      "import { int, mysqlTable, varchar, text, timestamp, boolean, index } from 'drizzle-orm/mysql-core';",
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
      return def.innerType ? this.getFieldType(def.innerType) : 'varchar';
    }
    return 'varchar';
  }

  protected formatAutoNow(): string {
    return '.defaultNow()';
  }

  protected formatAutoUUID(): string {
    return '.$defaultFn(() => crypto.randomUUID())';
  }

  protected formatDefaultValue(value: unknown): string {
    if (typeof value === 'function') {
      const funcStr = value.toString();
      if (funcStr.includes('randomUUID')) {
        return '.$defaultFn(() => crypto.randomUUID())';
      }
      if (funcStr.includes('new Date') || funcStr.includes('Date.now')) {
        return '.defaultNow()';
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
      return `.default(${value})`;
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

  private generateFieldDefinition(field: FieldMapping): string {
    let fieldDef = this.getFieldTypeDefinition(field);

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
  }

  private getFieldTypeDefinition(field: FieldMapping): string {
    const { name, type } = field;

    switch (type) {
      case 'varchar':
        return `  ${name}: varchar('${name}', { length: 255 })`;
      case 'int':
        return `  ${name}: int('${name}')`;
      case 'boolean':
        return `  ${name}: boolean('${name}')`;
      case 'timestamp':
        return `  ${name}: timestamp('${name}')`;
      case 'text':
        return `  ${name}: text('${name}')`;
      default:
        return `  ${name}: varchar('${name}', { length: 255 })`;
    }
  }

  private generateTableDefinition(table: TableMapping): string {
    const fields = table.fields.map((field) => this.generateFieldDefinition(field)).join(',\n');

    const indexDefs = table.indexes
      .map(
        (idx) => `    ${idx.name}: index('${idx.name}').on(table.${idx.columns.join(', table.')})`
      )
      .join(',\n');

    const indexSection = table.indexes.length > 0 ? `,\n  (table) => ({\n${indexDefs}\n  })` : '';

    return `export const ${table.name}Table = mysqlTable('${table.name}', {\n${fields}\n}${indexSection});`;
  }
}
