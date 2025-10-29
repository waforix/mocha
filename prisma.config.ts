import path from 'node:path';

export default {
  schema: path.join('prisma', 'schema'),
  engine: 'classic',
  datasource: {
    url: process.env.DATABASE_URL,
  },
};