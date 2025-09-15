import { Database } from 'bun:sqlite';
import { readFileSync } from 'fs';

const db = new Database('./data/stats.db');

const migration = readFileSync('./drizzle/0000_wandering_raza.sql', 'utf-8');

const statements = migration.split(';').filter(stmt => stmt.trim());

for (const statement of statements) {
  if (statement.trim()) {
    try {
      db.exec(statement);
      console.log('✓ Executed:', statement.trim().split('\n')[0]);
    } catch (error) {
      console.error('✗ Failed:', statement.trim().split('\n')[0]);
      console.error(error);
    }
  }
}

console.log('Database initialized successfully!');
db.close();
