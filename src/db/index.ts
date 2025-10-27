export * from './connection';
export {
  createDatabaseConnection,
  createDatabaseConnection as createDatabaseAdapter,
  createDatabaseConnection as getDb,
} from './factory';
export type { CommonDatabase } from './interface';
