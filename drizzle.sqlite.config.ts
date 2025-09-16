import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/sqlite/schema/index.ts',
  out: './drizzle/sqlite',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data/stats.db',
  },
});
