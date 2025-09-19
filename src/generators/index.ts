export * from './base';
export * from './mongodb';
export * from './mysql';
export * from './postgres';
export * from './sqlite';

import type { DatabaseType } from './base';
import { MongodbGenerator } from './mongodb';
import { MysqlGenerator } from './mysql';
import { PostgresGenerator } from './postgres';
import { SqliteGenerator } from './sqlite';

export const generators = {
  sqlite: new SqliteGenerator(),
  postgres: new PostgresGenerator(),
  mysql: new MysqlGenerator(),
  mongodb: new MongodbGenerator(),
} as const;

export function getGenerator(dbType: DatabaseType) {
  return generators[dbType];
}
