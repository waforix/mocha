import type { CommonDatabase } from '../interface';
import type { DatabaseInstance } from '../types';

export function createDatabaseAdapter(db: DatabaseInstance): CommonDatabase {
  return {
    select: db.select.bind(db),
    insert: db.insert.bind(db),
    update: db.update.bind(db),
    transaction: db.transaction.bind(db),
  };
}
