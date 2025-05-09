/**
 * This file previously configured a connection pool for the `pg` library.
 * The application has been migrated to use `@neondatabase/serverless` via `app/lib/db.ts`.
 * This configuration is no longer actively used by the main application routes.
 * It is kept here for reference or if any specific `pg` Pool-based utilities were to be added back.
 */

/*
import { PoolConfig } from 'pg';

let dbConfig: PoolConfig;

if (process.env.POSTGRES_URL) { // Changed from DATABASE_URL to POSTGRES_URL
  dbConfig = {
    connectionString: process.env.POSTGRES_URL,
    // Vercel Postgres automatically handles SSL; you might add specific SSL config 
    // here if needed for other environments using POSTGRES_URL with different SSL reqs.
    // For Vercel, this is often enough, or you might add:
    ssl: { rejectUnauthorized: false } // Good to be explicit with Neon/Vercel Postgres
  };
} else {
  // Fallback to individual variables if POSTGRES_URL is not set (for local .env)
  dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    // Ensure SSL configuration is consistent for local development if connecting to a remote DB that requires SSL
    ssl: process.env.DB_FORCE_NO_SSL === 'true' 
      ? false 
      : (process.env.NODE_ENV === 'production' || process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false),
  };
}

export { dbConfig }; 
*/

export {}; // Add an empty export to make this a module and avoid "no-unused-vars" errors if file is imported elsewhere by mistake. 