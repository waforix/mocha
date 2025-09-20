export * from './base';
export * from './mysql';
export * from './postgres';
export * from './sqlite';

import type { DatabaseType } from './base';
import { MysqlGenerator } from './mysql';
import { PostgresGenerator } from './postgres';
import { SqliteGenerator } from './sqlite';

export const generators = {
  sqlite: new SqliteGenerator(),
  postgres: new PostgresGenerator(),
  mysql: new MysqlGenerator(),
} as const;

export function getGenerator(dbType: DatabaseType) {
  return generators[dbType];
}
