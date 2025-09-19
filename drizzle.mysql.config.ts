import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/generated/mysql/schema.ts',
  out: './drizzle/mysql',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DB || 'waforix',
  },
});
