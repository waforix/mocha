import type { z } from 'zod';
import { AUTO_NOW_SYMBOL, AUTO_UUID_SYMBOL } from '../schemas/base';

export type DatabaseType = 'sqlite' | 'postgres' | 'mysql' | 'mongodb';

// Type for accessing Zod internal structure
export interface ZodInternalDef {
  type?: string;
  typeName?: string;
  innerType?: z.ZodTypeAny;
  defaultValue?: unknown;
  checks?: Array<{ kind: string; [key: string]: unknown }>;
  shape?: Record<string, z.ZodTypeAny>;
}

export interface FieldMapping {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  primaryKey?: boolean;
  references?: {
    table: string;
    column: string;
    onDelete?: 'cascade' | 'restrict' | 'set null';
  };
  index?: boolean;
  unique?: boolean;
}

export interface TableMapping {
  name: string;
  fields: FieldMapping[];
  indexes: IndexMapping[];
}

export interface IndexMapping {
  name: string;
  columns: string[];
  unique?: boolean;
}

export abstract class SchemaGenerator {
  protected dbType: DatabaseType;

  constructor(dbType: DatabaseType) {
    this.dbType = dbType;
  }

  abstract generateSchema(schemas: Record<string, z.ZodSchema>): string;
  abstract generateMigration(
    oldSchema: Record<string, z.ZodSchema>,
    newSchema: Record<string, z.ZodSchema>
  ): string;

  protected mapZodToField(zodType: z.ZodTypeAny, fieldName: string): FieldMapping {
    const unwrappedType = this.unwrapType(zodType);
    const field: FieldMapping = {
      name: fieldName,
      type: this.getFieldType(unwrappedType),
      nullable: this.isNullable(zodType),
    };

    if (this.hasSymbol(zodType, 'AUTO_NOW_SYMBOL')) {
      field.defaultValue = this.formatAutoNow();
    } else if (this.hasSymbol(zodType, 'AUTO_UUID_SYMBOL')) {
      field.defaultValue = this.formatAutoUUID();
    } else {
      const defaultValue = this.getDefaultValue(zodType);
      if (defaultValue !== undefined) {
        field.defaultValue = this.formatDefaultValue(defaultValue);
      }
    }

    return field;
  }

  protected hasSymbol(zodType: z.ZodTypeAny, symbolName: string): boolean {
    if (symbolName === 'AUTO_NOW_SYMBOL') {
      // biome-ignore lint/suspicious/noExplicitAny: Need to access symbol property
      return !!(zodType as any)[AUTO_NOW_SYMBOL];
    }
    if (symbolName === 'AUTO_UUID_SYMBOL') {
      // biome-ignore lint/suspicious/noExplicitAny: Need to access symbol property
      return !!(zodType as any)[AUTO_UUID_SYMBOL];
    }
    return false;
  }

  protected abstract formatAutoNow(): string;
  protected abstract formatAutoUUID(): string;

  protected unwrapType(zodType: z.ZodTypeAny): z.ZodTypeAny {
    const def = (zodType as { _def: ZodInternalDef })._def;
    const typeName = def.typeName;

    if (typeName === 'ZodDefault' || typeName === 'ZodOptional' || typeName === 'ZodNullable') {
      if (def.innerType) {
        return this.unwrapType(def.innerType);
      }
    }

    return zodType;
  }

  protected isNullable(zodType: z.ZodTypeAny): boolean {
    return this.checkNullable(zodType);
  }

  private checkNullable(zodType: z.ZodTypeAny): boolean {
    const def = (zodType as { _def: ZodInternalDef })._def;
    const type = def.type;

    if (type === 'optional' || type === 'nullable') {
      return true;
    }

    if (type === 'default' && def.innerType) {
      return this.checkNullable(def.innerType);
    }

    return false;
  }

  protected getDefaultValue(zodType: z.ZodTypeAny): unknown {
    const def = (zodType as { _def: ZodInternalDef })._def;
    const typeName = def.typeName;

    if (typeName === 'ZodDefault' && def.defaultValue !== undefined) {
      if (typeof def.defaultValue === 'function') {
        return def.defaultValue;
      }
      return def.defaultValue;
    }

    if (def.type === 'default' && def.defaultValue !== undefined) {
      return def.defaultValue;
    }

    return undefined;
  }

  protected abstract getFieldType(zodType: z.ZodTypeAny): string;
  protected abstract formatDefaultValue(value: unknown): string;
}
