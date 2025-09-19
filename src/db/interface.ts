export interface CommonDatabase {
  select: (...args: unknown[]) => unknown;
  insert: (...args: unknown[]) => unknown;
  update: (...args: unknown[]) => unknown;
  transaction<T>(fn: (tx: CommonDatabase) => Promise<T>): Promise<T>;
}
