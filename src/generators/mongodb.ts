import type { z } from 'zod';
import { SchemaGenerator, type ZodInternalDef } from './base';

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
    const typeName = (zodType as { _def: ZodInternalDef })._def.typeName;

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
      const innerType = (zodType as { _def: ZodInternalDef })._def.innerType;
      return innerType ? this.getFieldType(innerType) : 'mixed';
    }
    return 'mixed';
  }

  protected formatDefaultValue(value: unknown): string {
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
    const shape = (zodSchema as { _def: ZodInternalDef })._def.shape;
    const fields: string[] = [];

    if (!shape) {
      return `const ${schemaName}MongoSchema = z.object({});`;
    }

    for (const [fieldName, zodType] of Object.entries(shape)) {
      const fieldType = this.getMongoFieldType(zodType as z.ZodTypeAny);
      fields.push(`  ${fieldName}: ${fieldType}`);
    }

    return `const ${schemaName}MongoSchema = z.object({\n${fields.join(',\n')}\n});`;
  }

  private getMongoFieldType(zodType: z.ZodTypeAny): string {
    const def = (zodType as { _def: ZodInternalDef })._def;
    const type = def.type;

    if (type === 'string') {
      const checks = def.checks;
      if (checks?.some((check: { kind: string }) => check.kind === 'uuid')) {
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
      return def.innerType ? `${this.getMongoFieldType(def.innerType)}.optional()` : 'z.string().optional()';
    }
    if (type === 'nullable') {
      return def.innerType ? `${this.getMongoFieldType(def.innerType)}.nullable()` : 'z.string().nullable()';
    }
    if (type === 'default') {
      return def.innerType ? this.getMongoFieldType(def.innerType) : 'z.string()';
    }

    return 'z.string()';
  }
}
