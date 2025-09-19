import { createDatabaseConnection } from '../src/db/factory';
import type { DatabaseConfig } from '../src/db/types';

const dbType = (process.env.DB_TYPE as 'sqlite' | 'postgres') || 'sqlite';

let config: DatabaseConfig;

if (dbType === 'postgres') {
  config = {
    connectionString: '' /* <- added this line */,
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'waforix',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true',
  };
} else {
  config = {
    type: 'sqlite',
    path: process.env.DB_PATH || './data/stats.db',
  };
}

console.log(`🔧 Initializing ${dbType.toUpperCase()} database...`);

try {
  await createDatabaseConnection(config);
  console.log('✅ Database initialized successfully!');
} catch (error) {
  console.error('❌ Failed to initialize database:', error);
  process.exit(1);
}
