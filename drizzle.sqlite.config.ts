import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/generated/sqlite/schema.ts',
  out: './drizzle/sqlite',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data/stats.db',
  },
});
