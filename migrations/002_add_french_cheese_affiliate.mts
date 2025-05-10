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
 * Migration: Add Camembert affiliate link to French Cheese blog post
 * 
 * This script adds a Camembert de Normandie affiliate link to the French cheese blog post
 * and updates image paths in the blog content.
 * 
 * Run with: npx tsx migrations/002_add_french_cheese_affiliate.mts
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

    // 2. Add the Camembert affiliate link
    await client.query(`
      INSERT INTO post_affiliate_links 
        (post_id, label, url, price, weight, unit, created_at, updated_at)
      VALUES 
        ($1, 'Buy Camembert de Normandie', $2, $3, $4, $5, NOW(), NOW())
    `, [
      postId,
      'https://amzn.to/4m1Or9V',
      61.90,
      0.55,
      'lb'
    ]);
    
    console.log('Added Camembert affiliate link to the French cheese blog post');

    // 3. Update the blog post content to use the new image paths
    const { rows: blogContent } = await client.query(`
      SELECT content FROM blog_posts WHERE id = $1
    `, [postId]);

    // Update image paths to point to the actual uploaded images
    let updatedContent = blogContent[0].content
      .replace('/images/blog/french-cheese-map.jpg', '/images/blog/1/french-cheese-map.jpg')
      .replace('/images/blog/camembert-production.png', '/images/blog/1/camembert-production.png')
      .replace('/images/blog/monastery-aging-cellar.png', '/images/blog/1/monastery-aging-cellar.png')
      .replace('/images/blog/brie-de-meaux-wheel.jpg', '/images/blog/1/brie-de-meaux-wheel.jpg')
      .replace('/images/blog/comte-aging-cellar.png', '/images/blog/1/comte-aging-cellar.png')
      .replace('/images/blog/young-cheesemakers.png', '/images/blog/1/young-cheesemakers.png');

    await client.query(`
      UPDATE blog_posts 
      SET content = $1, updated_at = NOW()
      WHERE id = $2
    `, [updatedContent, postId]);

    console.log('Updated blog post with correct image paths');

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