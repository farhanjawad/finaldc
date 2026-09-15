import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env.local');
}


export const sql = neon(databaseUrl);