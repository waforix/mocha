export interface CommonDatabase {
  // biome-ignore lint/suspicious/noExplicitAny: Required for database method compatibility across SQLite and PostgreSQL
  select: any;
  // biome-ignore lint/suspicious/noExplicitAny: Required for database method compatibility across SQLite and PostgreSQL
  insert: any;
  // biome-ignore lint/suspicious/noExplicitAny: Required for database method compatibility across SQLite and PostgreSQL
  update: any;
  transaction<T>(fn: (tx: CommonDatabase) => Promise<T>): Promise<T>;
}
