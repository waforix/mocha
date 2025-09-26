import type { CommonDatabase } from '../db';
import type { Intents } from '../enums/gateway/intents';

export class Handler {
  protected database: CommonDatabase;
  protected intents: Intents[];

  constructor(database: CommonDatabase, intents: Intents[]) {
    this.database = database;
    this.intents = intents;
  }
}
