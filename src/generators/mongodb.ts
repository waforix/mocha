import type { z } from 'zod';
import { SchemaGenerator } from './base';

export class MongodbGenerator extends SchemaGenerator {
  constructor() {
    super('mongodb');
  }

  generateSchema(schemas: Record<string, z.ZodSchema>): string {
    const collections: string[] = [];
    const exports: string[] = [];

    for (const [schemaName, zodSchema] of Object.entries(schemas)) {
      const collectionName = this.getCollectionName(schemaName);
      const schemaDefinition = this.generateSchemaDefinition(schemaName, zodSchema);

      collections.push(schemaDefinition);
      exports.push(`export const ${collectionName}Schema = ${schemaName}MongoSchema;`);
    }

    return ["import { z } from 'zod';", '', ...collections, '', ...exports].join('\n');
  }

  generateMigration(
    oldSchema: Record<string, z.ZodSchema>,
    newSchema: Record<string, z.ZodSchema>
  ): string {
    const migrations: string[] = [];

    for (const [schemaName, _schema] of Object.entries(newSchema)) {
      if (!oldSchema[schemaName]) {
        migrations.push(`db.createCollection('${this.getCollectionName(schemaName)}');`);
      }
    }

    return migrations.join('\n');
  }

  protected getFieldType(zodType: z.ZodTypeAny): string {
    // biome-ignore lint/suspicious/noExplicitAny: Required for accessing Zod internal _def property
    const typeName = (zodType as any)._def.typeName;

    if (typeName === 'ZodString') {
      return 'string';
    }
    if (typeName === 'ZodNumber') {
      return 'number';
    }
    if (typeName === 'ZodBoolean') {
      return 'boolean';
    }
    if (typeName === 'ZodDate') {
      return 'date';
    }
    if (typeName === 'ZodArray') {
      return 'array';
    }
    if (typeName === 'ZodOptional' || typeName === 'ZodNullable') {
      // biome-ignore lint/suspicious/noExplicitAny: Required for accessing Zod internal _def property
      return this.getFieldType((zodType as any)._def.innerType);
    }
    return 'mixed';
  }

  // biome-ignore lint/suspicious/noExplicitAny: Required for flexible default value handling
  protected formatDefaultValue(value: any): string {
    if (typeof value === 'function') {
      return `default: ${value.toString()}`;
    }
    return `default: ${JSON.stringify(value)}`;
  }

  private getCollectionName(schemaName: string): string {
    return schemaName
      .toLowerCase()
      .replace(/([A-Z])/g, '_$1')
      .replace(/^_/, '');
  }

  private generateSchemaDefinition(schemaName: string, zodSchema: z.ZodSchema): string {
    // biome-ignore lint/suspicious/noExplicitAny: Required for accessing Zod internal _def property
    const shape = (zodSchema as any)._def.shape;
    const fields: string[] = [];

    for (const [fieldName, zodType] of Object.entries(shape)) {
      const fieldType = this.getMongoFieldType(zodType as z.ZodTypeAny);
      fields.push(`  ${fieldName}: ${fieldType}`);
    }

    return `const ${schemaName}MongoSchema = z.object({\n${fields.join(',\n')}\n});`;
  }

  private getMongoFieldType(zodType: z.ZodTypeAny): string {
    // biome-ignore lint/suspicious/noExplicitAny: Required for accessing Zod internal _def property
    const def = (zodType as any)._def;
    const type = def.type;

    if (type === 'string') {
      const checks = def.checks;
      // biome-ignore lint/suspicious/noExplicitAny: Required for accessing Zod internal check structure
      if (checks?.some((check: any) => check.kind === 'uuid')) {
        return 'z.string().uuid()';
      }
      return 'z.string()';
    }
    if (type === 'number') {
      return 'z.number()';
    }
    if (type === 'boolean') {
      return 'z.boolean()';
    }
    if (type === 'date') {
      return 'z.date()';
    }
    if (type === 'array') {
      return 'z.array(z.string())';
    }

    if (type === 'optional') {
      return `${this.getMongoFieldType(def.innerType)}.optional()`;
    }
    if (type === 'nullable') {
      return `${this.getMongoFieldType(def.innerType)}.nullable()`;
    }
    if (type === 'default') {
      return this.getMongoFieldType(def.innerType);
    }

    return 'z.string()';
  }
}
