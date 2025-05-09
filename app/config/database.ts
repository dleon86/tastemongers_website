import { PoolConfig } from 'pg';

let dbConfig: PoolConfig;

if (process.env.DATABASE_URL) {
  // If DATABASE_URL is available (like on Vercel), use it.
  // It includes SSL configuration automatically for Vercel Postgres.
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    // Vercel Postgres automatically handles SSL; you might add specific SSL config 
    // here if needed for other environments using DATABASE_URL with different SSL reqs.
    // For Vercel, this is often enough, or you might add:
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
} else {
  // Fallback to individual variables if DATABASE_URL is not set (for local .env)
  dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    ssl: process.env.DB_FORCE_NO_SSL === 'true' 
      ? false 
      : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
  };
}

export { dbConfig }; 