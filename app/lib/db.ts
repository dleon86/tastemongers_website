import { neon } from '@neondatabase/serverless';

// Check for Vercel's environment variable names (they have POSTGRES_ prefix)
const connectionString = process.env.POSTGRES_POSTGRES_URL || 
                         process.env.POSTGRES_POSTGRES_URL_NON_POOLING ||
                         process.env.POSTGRES_URL || 
                         process.env.POSTGRES_URL_NON_POOLING || 
                         process.env.DATABASE_URL;

// Next.js special environment variable that's 'development' during local dev,
// and 'production' during 'next build' and on Vercel
const isProduction = process.env.NODE_ENV === 'production';
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

// During build time we need to provide a fallback to prevent the build from failing
// This is only used during build, not during actual runtime
if (!connectionString) {
  // Don't error during build
  if (isBuildTime) {
    console.warn('⚠️ Using dummy DB connection during build');
  } 
  // But do provide helpful errors when actually running the app
  else {
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
}

// Initialize Neon's serverless driver with a fallback for build time
// This ensures the build succeeds, but the function will be replaced at runtime
const sql = connectionString 
  ? neon(connectionString)
  : () => {
      if (!isBuildTime) {
        throw new Error('Database connection not available');
      }
      return Promise.resolve([]);
    };

export { sql };
export default sql; 