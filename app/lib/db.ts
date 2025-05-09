import { neon } from '@neondatabase/serverless';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  // During development, provide a more helpful error message
  if (process.env.NODE_ENV !== 'production') {
    console.error('===========================================');
    console.error('ERROR: No database connection string found!');
    console.error('Make sure you have one of these environment variables set:');
    console.error('- POSTGRES_POSTGRES_URL');
    console.error('- POSTGRES_POSTGRES_URL_NON_POOLING');
    console.error('- POSTGRES_URL');
    console.error('- POSTGRES_URL_NON_POOLING');
    console.error('- DATABASE_URL');
    console.error('Run: vercel env pull .env.development.local');
    console.error('===========================================');
  }
  throw new Error('Database connection string not found. Check environment variables.');
}

// Initialize Neon's serverless driver
// The `neon` function returns another function that you use as a tagged template literal
const sql = neon(connectionString);

export { sql };
export default sql; 