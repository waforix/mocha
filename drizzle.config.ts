import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/sqlite/schema/index.ts',
  out: './drizzle/sqlite',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './data/stats.db'
  }
});