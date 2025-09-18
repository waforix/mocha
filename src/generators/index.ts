export * from './base';
export * from './sqlite';
export * from './postgres';
export * from './mysql';
export * from './mongodb';

import { SqliteGenerator } from './sqlite';
import { PostgresGenerator } from './postgres';
import { MysqlGenerator } from './mysql';
import { MongodbGenerator } from './mongodb';
import type { DatabaseType } from './base';

export const generators = {
  sqlite: new SqliteGenerator(),
  postgres: new PostgresGenerator(),
  mysql: new MysqlGenerator(),
  mongodb: new MongodbGenerator(),
} as const;

export function getGenerator(dbType: DatabaseType) {
  return generators[dbType];
}
