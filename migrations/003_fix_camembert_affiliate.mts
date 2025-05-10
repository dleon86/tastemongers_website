import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Determine the directory path in ES module scope ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Determine connection string: Prioritize Vercel's non-pooling URL, then general Vercel URL, then fallback to .env specifics
const connectionString = process.env.POSTGRES_URL_NON_POOLING || 
                         process.env.POSTGRES_URL || 
                         (process.env.DB_USER ? `postgresql://${process.env.DB_USER}:${String(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${parseInt(process.env.DB_PORT || '5432')}/${process.env.DB_NAME}` : undefined);

if (!connectionString) {
  console.error("Database connection string could not be determined. Ensure POSTGRES_URL_NON_POOLING, POSTGRES_URL, or DB_USER, DB_PASSWORD, etc. are set.");
  process.exit(1);
}

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * Migration: Fix Camembert affiliate link
 * 
 * This script adds the Camembert affiliate link in a format consistent with 
 * the working Mimolette link, and adds the affiliate_link directly to the blog post.
 * 
 * Run with: npx tsx migrations/003_fix_camembert_affiliate.mts
 */
async function runMigration() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database.');

    // Start transaction
    await client.query('BEGIN');

    // 1. Get the post ID for the French cheese blog post
    const { rows: posts } = await client.query(`
      SELECT id FROM blog_posts 
      WHERE title = 'The Art of French Cheese: A Journey Through Tradition'
    `);

    if (posts.length === 0) {
      throw new Error("French cheese blog post not found");
    }

    const postId = posts[0].id;
    console.log(`Found French cheese blog post with ID: ${postId}`);

    // 2. Update the blog post to have an affiliate_link directly
    await client.query(`
      UPDATE blog_posts 
      SET affiliate_link = $1, updated_at = NOW()
      WHERE id = $2
    `, [
      'https://amzn.to/4m1Or9V',
      postId
    ]);
    
    console.log('Updated blog post with direct affiliate link');

    // 3. Replace the existing post_affiliate_link with a new one matching the Mimolette format
    // First remove any existing links
    await client.query(`
      DELETE FROM post_affiliate_links 
      WHERE post_id = $1 AND label = 'Buy Camembert de Normandie'
    `, [postId]);

    // Then add the new link with the same format as Mimolette
    await client.query(`
      INSERT INTO post_affiliate_links 
        (post_id, label, url, price, weight, unit, created_at, updated_at)
      VALUES 
        ($1, 'Buy Camembert Cheese', $2, $3, $4, $5, NOW(), NOW())
    `, [
      postId,
      'https://amzn.to/4m1Or9V',
      61.90,
      0.55,
      'lb'
    ]);
    
    console.log('Added new Camembert affiliate link with consistent format');

    // Commit the transaction
    await client.query('COMMIT');
    console.log('Migration completed successfully');
    
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

runMigration().catch(console.error); 