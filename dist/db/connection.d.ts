import * as schema from './schema/index';
export declare const getDb: (path?: string) => import("drizzle-orm/bun-sqlite").BunSQLiteDatabase<Record<string, unknown>>;
export { schema };
