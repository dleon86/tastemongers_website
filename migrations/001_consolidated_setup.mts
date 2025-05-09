import pkg from 'pg';
const { Client, Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// --- Determine the directory path in ES module scope ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env (relative to the project root)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client = new Client({
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
});

/**
 * Consolidated Migration Script
 * 
 * This script combines all previous migrations into a single file to streamline the setup process.
 * It handles:
 * 1. Creating all database tables
 * 2. Seeding food ratings data with image URLs directly
 * 3. Creating and populating affiliate links
 * 
 * Run with: npx tsx migrations/001_consolidated_setup.mts
 * Optional: Add --drop flag to drop existing tables first
 */
async function runConsolidatedMigration(shouldDrop: boolean = false) {
  try {
    console.log('Attempting to connect to database...');
    await client.connect();
    console.log('Connected to database.');

    // Start transaction
    await client.query('BEGIN');

    // Step 1: Drop tables if requested
    if (shouldDrop) {
      console.log('Dropping existing tables...');
      await client.query(`
        DROP TABLE IF EXISTS post_affiliate_links CASCADE;
        DROP TABLE IF EXISTS affiliate_links CASCADE;
        DROP TABLE IF EXISTS expert_food_ratings CASCADE;
        DROP TABLE IF EXISTS blog_posts CASCADE;
        DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
      `);
      console.log('Tables dropped successfully');
    }

    // Step 2: Create tables
    console.log('Creating tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS expert_food_ratings (
        id SERIAL PRIMARY KEY,
        cheese_name VARCHAR(255) NOT NULL UNIQUE,
        type VARCHAR(100) NOT NULL,
        origin VARCHAR(100) NOT NULL,
        flavor_intensity INT CHECK (flavor_intensity BETWEEN 1 AND 10),
        complexity INT CHECK (complexity BETWEEN 1 AND 10),
        creaminess INT CHECK (creaminess BETWEEN 1 AND 10),
        overall_rating INT CHECK (overall_rating BETWEEN 1 AND 10),
        tasting_notes TEXT,
        pairing_suggestions TEXT,
        image_url VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        affiliate_link VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT NOW(),
        is_subscribed BOOLEAN DEFAULT TRUE
      );
      
      CREATE TABLE IF NOT EXISTS affiliate_links (
        id SERIAL PRIMARY KEY,
        cheese_rating_id INT NOT NULL,
        affiliate_url VARCHAR(500) NOT NULL,
        price DECIMAL(6,2),
        weight VARCHAR(50),
        unit VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_affiliate_cheese FOREIGN KEY (cheese_rating_id) REFERENCES expert_food_ratings(id)
      );

      CREATE TABLE IF NOT EXISTS post_affiliate_links (
        id SERIAL PRIMARY KEY,
        post_id INT NOT NULL,
        label VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        price DECIMAL(6,2),
        weight VARCHAR(50),
        unit VARCHAR(20),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_post_affiliate_post FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
      );

      CREATE INDEX idx_post_affiliate_post_id ON post_affiliate_links(post_id);
    `);
    console.log('Tables created successfully');

    // Step 3: Seed cheese ratings data with image URLs directly
    console.log('Seeding expert_food_ratings with image URLs...');
    
    // Map of cheese names to their standardized image filenames
    const cheeseImageMap = {
      'Roquefort': '/images/cheeses/roquefort.jpg',
      'Saint André': '/images/cheeses/saint-andre.jpg',
      'Jarlsberg': '/images/cheeses/jarlsberg.jpg',
      'Mimolette': '/images/cheeses/mimolette.jpg',
      'Comté': '/images/cheeses/comte.jpg',
      'Manchego': '/images/cheeses/manchego.jpg',
      'Taleggio': '/images/cheeses/taleggio.jpg',
      'Gruyère': '/images/cheeses/gruyere.jpg',
      'Brie de Meaux': '/images/cheeses/brie-de-meaux.jpg',
      'Gouda (Aged)': '/images/cheeses/gouda-aged.jpg',
      'Parmigiano-Reggiano': '/images/cheeses/parmigiano-reggiano.jpg',
      'Camembert de Normandie': '/images/cheeses/camembert-de-normandie.jpg',
      'Stilton': '/images/cheeses/stilton.jpg',
      'Époisses': '/images/cheeses/epoisses.jpg',
      'Pecorino Romano': '/images/cheeses/pecorino-romano.jpg',
      'Reblochon': '/images/cheeses/reblochon.jpg',
      'Cabrales': '/images/cheeses/cabrales.jpg',
      'Ossau-Iraty': '/images/cheeses/ossau-iraty.jpg',
      'Humboldt Fog': '/images/cheeses/humboldt-fog.jpg',
      'Morbier': '/images/cheeses/morbier.jpg',
      'Mont d\'Or': '/images/cheeses/mont-dor.jpg',
      'Burrata': '/images/cheeses/burrata.jpg',
      'Gorgonzola Dolce': '/images/cheeses/gorgonzola-dolce.jpg',
      'Raclette': '/images/cheeses/raclette.jpg',
      'Crottin de Chavignol': '/images/cheeses/crottin-de-chavignol.jpg',
      'Aged Cheddar': '/images/cheeses/aged-cheddar.jpg',
      'Brillat-Savarin': '/images/cheeses/brillat-savarin.jpg',
      'Gouda': '/images/cheeses/gouda-aged.jpg'
    };
    
    const ratings = [
      { 
        name: 'Roquefort', type: 'Blue', origin: 'France', intensity: 9, complexity: 9, creaminess: 7, rating: 9, 
        notes: 'Roquefort is a bold and tangy blue cheese made from sheep\'s milk, with its signature blue-green veins of Penicillium roqueforti. It has a creamy yet crumbly texture and a sharp, salty flavor with earthy undertones and hints of butter and nuts. Its aroma is pungent and slightly tangy, reflecting its rich history and traditional cave aging.', 
        pairings: 'Pairs excellently with sweet wines like Sauternes or Port to balance its saltiness. Also complements fresh pears, walnuts, honey, or crusty bread for a classic pairing. Try it crumbled over salads or as part of a cheese board for a luxurious experience.' 
      },
      { 
        name: 'Saint André', type: 'Triple Cream', origin: 'France', intensity: 8, complexity: 7, creaminess: 10, rating: 8, 
        notes: 'Saint André is a decadent triple-cream cheese with a bloomy, edible white rind and a rich, buttery interior. It boasts a velvety texture and a flavor profile that combines the tanginess of the rind with the creamy sweetness of the paste. Often described as an intensified version of Brie, it has hints of sour cream and whipped sweet cream, with a slightly salty finish. Best enjoyed at room temperature to fully appreciate its lush and nuanced flavors.', 
        pairings: 'Pairs beautifully with sparkling wines (e.g., Champagne or Blanc de Blancs), light beers, or oaked Chardonnays. Complements fresh fruits like pears or figs, crusty French bread, and even honey or fig jam for a luxurious treat.' 
      },
      { 
        name: 'Jarlsberg', type: 'Semi-Soft Cheese (Swiss-Style)', origin: 'Norway', intensity: 6, complexity: 7, creaminess: 8, rating: 7, 
        notes: 'Jarlsberg is a mild, semi-soft cheese with a sweet and nutty flavor profile. Its texture is smooth, elastic, and buttery, with characteristic large holes (eyes). The taste is reminiscent of Swiss Emmental but sweeter and less sharp, with a subtle fruity aftertaste. It melts beautifully, making it versatile for both cooking and snacking.', 
        pairings: 'Pairs well with light red wines (e.g., Pinot Noir), white wines (e.g., Chardonnay), or beers like Belgian ales. Enjoy it with fresh fruits, crusty bread, or as part of a sandwich or fondue.' 
      },
      { 
        name: 'Mimolette', type: 'Hard Cheese', origin: 'France', intensity: 8, complexity: 9, creaminess: 5, rating: 8, 
        notes: 'Mimolette is a striking cheese with a vivid orange interior and a cratered rind created by cheese mites during aging. It has a firm, crumbly texture and a rich flavor profile that evolves with age. Younger Mimolette is mildly sweet with caramel notes, while aged Mimolette (18 months) offers bold nutty, earthy, and umami flavors. Its aroma is robust, with hints of roasted nuts and slight spiciness.', 
        pairings: 'Pairs wonderfully with full-bodied red wines (e.g., Côtes du Rhône, Pinot Noir), dark beers (e.g., Belgian ales), or Normandy ciders. Complements charcuterie, crusty bread, and dark chocolate for dessert.' 
      },
      { 
        name: 'Comté', type: 'Hard', origin: 'France (Franche-Comté)', intensity: 8, complexity: 9, creaminess: 7, rating: 9, 
        notes: 'Comté is a nutty and complex cheese with a firm, smooth texture. It offers flavors of caramel, toasted nuts, and a hint of fruitiness, with a lingering savory finish. Aged for several months, it develops a rich depth of flavor and a slightly crystalline texture.', 
        pairings: 'Pair with dry white wines like Chardonnay or light reds like Pinot Noir. Complements dried fruits, nuts, and crusty bread. Perfect for fondue or grating over dishes.' 
      },
      { 
        name: 'Manchego', type: 'Hard', origin: 'Spain (La Mancha)', intensity: 7, complexity: 8, creaminess: 6, rating: 8, 
        notes: 'Manchego is a firm, buttery cheese made from sheep\'s milk, with a distinctive herringbone rind. It has a rich, nutty flavor with hints of caramel and a slightly tangy finish. The texture is dense and crumbly, making it a versatile cheese for slicing or grating.', 
        pairings: 'Pair with Spanish wines like Tempranillo or Sherry. Serve with quince paste (membrillo), almonds, or olives for a traditional Spanish experience.' 
      },
      { 
        name: 'Taleggio', type: 'Semi-soft, Washed Rind', origin: 'Italy (Lombardy)', intensity: 6, complexity: 7, creaminess: 9, rating: 8, 
        notes: 'Taleggio is a creamy, washed-rind cheese with a pungent aroma and a mild, tangy flavor. Its interior is soft and buttery, with a slightly salty and fruity taste. The rind adds an earthy complexity to the overall profile.', 
        pairings: 'Pair with light red wines like Barbera or sparkling wines. Serve with fresh figs, apples, or crusty bread. Ideal for melting in risottos or polenta.' 
      },
      { 
        name: 'Gruyère', type: 'Hard', origin: 'Switzerland', intensity: 8, complexity: 9, creaminess: 7, rating: 9, 
        notes: 'Gruyère is a rich, nutty cheese with a firm yet creamy texture. It has a complex flavor profile, featuring notes of caramel, fruit, and a slight earthiness. The cheese is aged for several months, developing a slightly grainy texture and a deep, savory taste.', 
        pairings: 'Pair with dry white wines like Sauvignon Blanc or light reds like Pinot Noir. Complements cured meats, pickles, and crusty bread. Perfect for fondue or French onion soup.' 
      },
      { 
        name: 'Brie de Meaux', type: 'Soft, Bloomy Rind', origin: 'France (Île-de-France)', intensity: 6, complexity: 7, creaminess: 9, rating: 8, 
        notes: 'Brie de Meaux is a luxurious, creamy cheese with a bloomy rind and a buttery, melt-in-your-mouth texture. It has a mild, earthy flavor with hints of mushrooms and a slightly tangy finish. The rind adds a subtle complexity to the overall taste.', 
        pairings: 'Pair with Champagne or light white wines like Chardonnay. Serve with fresh berries, baguette slices, or honey for a delightful pairing.' 
      },
      { 
        name: 'Gouda', type: 'Hard', origin: 'Netherlands', intensity: 7, complexity: 8, creaminess: 6, rating: 8, 
        notes: 'Aged Gouda is a firm, caramel-colored cheese with a rich, sweet, and nutty flavor. It has a slightly crystalline texture and notes of butterscotch, toasted nuts, and a hint of saltiness. The aging process intensifies its depth and complexity.', 
        pairings: 'Pair with bold red wines like Cabernet Sauvignon or dessert wines like Port. Complements dried fruits, nuts, and dark chocolate for a decadent pairing.' 
      },
      { 
        name: 'Parmigiano-Reggiano', type: 'Hard', origin: 'Italy (Emilia-Romagna)', intensity: 8, complexity: 9, creaminess: 5, rating: 9, 
        notes: 'Parmigiano-Reggiano is a granular, crumbly cheese with a rich, nutty flavor and a slightly salty finish. It has a complex profile with hints of fruit and a lingering savory taste. Often aged for over 24 months, it develops a crystalline texture.', 
        pairings: 'Pair with Italian red wines like Chianti or sparkling wines. Grate over pasta, risotto, or salads for a burst of umami flavor.' 
      },
      { 
        name: 'Camembert de Normandie', type: 'Soft, Bloomy Rind', origin: 'France (Normandy)', intensity: 7, complexity: 8, creaminess: 9, rating: 8, 
        notes: 'Camembert de Normandie is a creamy, soft cheese with a bloomy rind and a rich, buttery flavor. It has a mild, earthy taste with hints of mushrooms and a slightly tangy finish. The texture is smooth and spreadable when ripe.', 
        pairings: 'Pair with light red wines like Pinot Noir or sparkling wines. Serve with fresh apples, baguette slices, or walnuts for a classic pairing.' 
      },
      { 
        name: 'Stilton', type: 'Blue', origin: 'England', intensity: 9, complexity: 9, creaminess: 7, rating: 9, 
        notes: 'Stilton is a bold, crumbly blue cheese with a rich, tangy flavor and a creamy texture. It has a sharp, salty taste with notes of earthiness and a slightly spicy finish. The blue veins add a pungent complexity to the cheese.', 
        pairings: 'Pair with sweet wines like Port or dessert wines. Serve with pears, walnuts, or honey for a balanced pairing.' 
      },
      { 
        name: 'Époisses', type: 'Soft, Washed Rind', origin: 'France (Burgundy)', intensity: 8, complexity: 9, creaminess: 9, rating: 9, 
        notes: 'Époisses is a pungent, washed-rind cheese with a soft, creamy texture and a bold, savory flavor. It has a strong aroma with notes of garlic, earth, and a slightly tangy finish. The rind adds an intense complexity to the cheese.', 
        pairings: 'Pair with Burgundy wines or light reds like Pinot Noir. Serve with crusty bread or fresh fruit to balance its intensity.' 
      },
      { 
        name: 'Pecorino Romano', type: 'Hard', origin: 'Italy (Lazio)', intensity: 8, complexity: 7, creaminess: 5, rating: 8, 
        notes: 'Pecorino Romano is a salty, crumbly cheese made from sheep\'s milk. It has a sharp, tangy flavor with a slightly nutty finish. The texture is firm and granular, making it ideal for grating.', 
        pairings: 'Pair with Italian red wines like Sangiovese or sparkling wines. Grate over pasta, salads, or soups for a bold flavor boost.' 
      },
      { 
        name: 'Reblochon', type: 'Soft, Washed Rind', origin: 'France (Savoie)', intensity: 7, complexity: 8, creaminess: 9, rating: 8, 
        notes: 'Reblochon is a creamy, washed-rind cheese with a mild, nutty flavor and a smooth, buttery texture. It has a subtle earthiness and a slightly tangy finish. The rind adds a delicate complexity to the cheese.', 
        pairings: 'Pair with light white wines like Chardonnay or light reds like Gamay. Serve with boiled potatoes or crusty bread for a traditional pairing.' 
      },
      { 
        name: 'Cabrales', type: 'Blue', origin: 'Spain (Asturias)', intensity: 9, complexity: 9, creaminess: 6, rating: 9, 
        notes: 'Cabrales is a bold, crumbly blue cheese with a sharp, tangy flavor and a creamy texture. It has a pungent aroma and a complex taste with notes of earthiness and a slightly spicy finish. The blue veins add a robust intensity to the cheese.', 
        pairings: 'Pair with sweet wines like Sherry or dessert wines. Serve with quince paste or crusty bread for a balanced pairing.' 
      },
      { 
        name: 'Ossau-Iraty', type: 'Hard', origin: 'France (Basque Country)', intensity: 7, complexity: 8, creaminess: 6, rating: 8, 
        notes: 'Ossau-Iraty is a firm, nutty cheese made from sheep\'s milk. It has a rich, buttery flavor with hints of caramel and a slightly tangy finish. The texture is smooth and dense, making it ideal for slicing.', 
        pairings: 'Pair with dry white wines like Sauvignon Blanc or light reds like Merlot. Serve with dried fruits or nuts for a delightful pairing.' 
      },
      { 
        name: 'Humboldt Fog', type: 'Soft, Bloomy Rind', origin: 'USA (California)', intensity: 6, complexity: 8, creaminess: 9, rating: 8, 
        notes: 'Humboldt Fog is a creamy, goat\'s milk cheese with a distinctive layer of ash running through its center. It has a tangy, citrusy flavor with a smooth, velvety texture. The rind adds a subtle earthiness to the cheese.', 
        pairings: 'Pair with crisp white wines like Sauvignon Blanc or sparkling wines. Serve with fresh berries or honey for a refreshing pairing.' 
      },
      { 
        name: 'Morbier', type: 'Semi-soft', origin: 'France (Franche-Comté)', intensity: 6, complexity: 7, creaminess: 8, rating: 7, 
        notes: 'Morbier is a semi-soft cheese with a distinctive layer of ash running through its center. It has a mild, nutty flavor with a creamy texture and a slightly tangy finish. The rind adds a subtle earthiness to the cheese.', 
        pairings: 'Pair with light red wines like Pinot Noir or white wines like Chardonnay. Serve with fresh fruit or crusty bread for a classic pairing.' 
      },
      { 
        name: 'Mont d\'Or', type: 'Soft, Washed Rind', origin: 'France (Franche-Comté)', intensity: 7, complexity: 8, creaminess: 9, rating: 8, 
        notes: 'Mont d\'Or is a creamy, washed-rind cheese with a rich, buttery flavor and a smooth, velvety texture. It has a mild, earthy taste with a slightly tangy finish. The cheese is often served warm, making it ideal for dipping.', 
        pairings: 'Pair with light white wines like Chardonnay or light reds like Pinot Noir. Serve with boiled potatoes or crusty bread for a traditional pairing.' 
      },
      { 
        name: 'Burrata', type: 'Fresh', origin: 'Italy (Apulia)', intensity: 5, complexity: 6, creaminess: 10, rating: 8, 
        notes: 'Burrata is a fresh cheese with a creamy, buttery interior and a soft, mozzarella-like exterior. It has a mild, milky flavor with a rich, velvety texture. The cheese is best enjoyed fresh and at room temperature.', 
        pairings: 'Pair with light white wines like Pinot Grigio or sparkling wines. Serve with fresh tomatoes, basil, and olive oil for a classic Caprese salad.' 
      },
      { 
        name: 'Gorgonzola Dolce', type: 'Blue', origin: 'Italy (Lombardy)', intensity: 7, complexity: 8, creaminess: 8, rating: 8, 
        notes: 'Gorgonzola Dolce is a creamy, mild blue cheese with a smooth, buttery texture. It has a sweet, tangy flavor with notes of earthiness and a slightly spicy finish. The blue veins add a delicate complexity to the cheese.', 
        pairings: 'Pair with sweet wines like Moscato d\'Asti or dessert wines. Serve with fresh pears or honey for a balanced pairing.' 
      },
      { 
        name: 'Raclette', type: 'Semi-soft', origin: 'Switzerland', intensity: 6, complexity: 7, creaminess: 8, rating: 7, 
        notes: 'Raclette is a semi-soft cheese with a rich, buttery flavor and a smooth, meltable texture. It has a mild, nutty taste with a slightly tangy finish. The cheese is traditionally melted and scraped over potatoes or bread.', 
        pairings: 'Pair with light white wines like Riesling or light reds like Pinot Noir. Serve with boiled potatoes, pickles, or cured meats for a traditional pairing.' 
      },
      { 
        name: 'Crottin de Chavignol', type: 'Goat, Semi-soft', origin: 'France (Loire Valley)', intensity: 6, complexity: 7, creaminess: 7, rating: 7, 
        notes: 'Crottin de Chavignol is a tangy, semi-soft goat cheese with a creamy texture and a slightly nutty flavor. It has a mild, earthy taste with a slightly tangy finish. The cheese is often aged, developing a firmer texture and a more intense flavor.', 
        pairings: 'Pair with Sauvignon Blanc or light red wines like Gamay. Serve with fresh fruit or crusty bread for a refreshing pairing.' 
      },
      { 
        name: 'Aged Cheddar', type: 'Hard', origin: 'England', intensity: 8, complexity: 8, creaminess: 6, rating: 8, 
        notes: 'Aged Cheddar is a firm, crumbly cheese with a sharp, tangy flavor and a slightly crystalline texture. It has a rich, nutty taste with hints of caramel and a lingering savory finish. The aging process intensifies its depth and complexity.', 
        pairings: 'Pair with bold red wines like Cabernet Sauvignon or dessert wines like Port. Complements apples, nuts, or crusty bread for a classic pairing.' 
      },
      { 
        name: 'Brillat-Savarin', type: 'Soft, Bloomy Rind', origin: 'France (Burgundy)', intensity: 6, complexity: 7, creaminess: 10, rating: 8, 
        notes: 'Brillat-Savarin is a decadent, triple-cream cheese with a rich, buttery flavor and a smooth, velvety texture. It has a mild, tangy taste with a slightly sweet finish. The cheese is best enjoyed at room temperature.', 
        pairings: 'Pair with Champagne or light white wines like Chardonnay. Serve with fresh berries or baguette slices for a luxurious pairing.' 
      }
    ];

    for (const r of ratings) {
      // Get the image URL directly from the map instead of generating it
      const imageUrl = cheeseImageMap[r.name as keyof typeof cheeseImageMap] || '';

      await client.query(`
        INSERT INTO expert_food_ratings 
          (cheese_name, type, origin, flavor_intensity, complexity, creaminess, overall_rating, tasting_notes, pairing_suggestions, image_url)
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (cheese_name) DO UPDATE 
        SET 
          type = EXCLUDED.type,
          origin = EXCLUDED.origin,
          flavor_intensity = EXCLUDED.flavor_intensity,
          complexity = EXCLUDED.complexity,
          creaminess = EXCLUDED.creaminess,
          overall_rating = EXCLUDED.overall_rating,
          tasting_notes = EXCLUDED.tasting_notes,
          pairing_suggestions = EXCLUDED.pairing_suggestions,
          image_url = EXCLUDED.image_url
      `, [
        r.name, 
        r.type, 
        r.origin, 
        r.intensity, 
        r.complexity, 
        r.creaminess, 
        r.rating,
        r.notes,
        r.pairings,
        imageUrl
      ]);
    }
    console.log(`Seeded ${ratings.length} cheese ratings with image URLs`);

    // Step 4: Set up affiliate links
    console.log('Setting up affiliate links...');
    const { rows: cheeses } = await client.query('SELECT id, cheese_name FROM expert_food_ratings');
    const cheeseMap = new Map(cheeses.map(cheese => [cheese.cheese_name.toLowerCase(), cheese.id]));
    
    // Define affiliate links
    const affiliateLinks = [
      { cheeseName: 'Roquefort', url: 'https://amzn.to/4cSujTg', price: 46.99, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Saint André', url: 'https://amzn.to/4jUyMHk', price: 22.99, weight: 0.44, unit: 'lb' },
      { cheeseName: 'Jarlsberg', url: 'https://amzn.to/3YoCfpr', price: 29.95, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Mimolette', url: 'https://amzn.to/4jybBDd', price: 13.59, weight: 0.5, unit: 'lb' },
      { cheeseName: 'Comté', url: 'https://amzn.to/4cXyjBZ', price: 61.90, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Manchego', url: 'https://amzn.to/3YpCQXY', price: 37.00, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Taleggio', url: 'https://amzn.to/4lUMgVi', price: 51.99, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Gruyère', url: 'https://amzn.to/4jzPIU0', price: 33.53, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Brie de Meaux', url: 'https://amzn.to/3SeiTjb', price: 162.82, weight: 6.5, unit: 'lb' },
      { cheeseName: 'Gouda', url: 'https://amzn.to/4iK4GW2', price: 18.99, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Parmigiano-Reggiano', url: 'https://amzn.to/4lZ2KMs', price: 28.98, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Camembert de Normandie', url: 'https://amzn.to/4m1Or9V', price: 61.90, weight: 0.55, unit: 'lb' },
      { cheeseName: 'Stilton', url: 'https://amzn.to/4cUyQVv', price: 64.90, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Époisses', url: 'https://amzn.to/44Q6QjE', price: 29.99, weight: 0.55, unit: 'lb' },
      { cheeseName: 'Pecorino Romano', url: 'https://amzn.to/3ENv1on', price: 28.95, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Ossau-Iraty', url: 'https://amzn.to/44gWr0j', price: 29.80, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Humboldt Fog', url: 'https://amzn.to/4jFrtUu', price: 35.99, weight: 1.2, unit: 'lb' },
      { cheeseName: 'Morbier', url: 'https://amzn.to/3ScdxVI', price: 29.99, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Burrata', url: 'https://amzn.to/4cWOv6E', price: 51.90, weight: 0.5, unit: 'lb' },
      { cheeseName: 'Gorgonzola Dolce', url: 'https://amzn.to/42TfKdt', price: 39.99, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Raclette', url: 'https://amzn.to/4iI4yGy', price: 98.5, weight: 3.0, unit: 'lb' },
      { cheeseName: 'Aged Cheddar', url: 'https://amzn.to/3Shhcl1', price: 14.99, weight: 1.0, unit: 'lb' },
      { cheeseName: 'Brillat-Savarin', url: 'https://amzn.to/4jZXE0E', price: 9.58, weight: 0.44, unit: 'lb' }
    ];

    for (const link of affiliateLinks) {
      const cheeseId = cheeseMap.get(link.cheeseName.toLowerCase());
      if (cheeseId) {
        await client.query(`
          INSERT INTO affiliate_links 
            (cheese_rating_id, affiliate_url, price, weight, unit, created_at, updated_at)
          VALUES 
            ($1, $2, $3, $4, $5, NOW(), NOW())
        `, [
          cheeseId,
          link.url,
          link.price,
          link.weight,
          link.unit
        ]);
      }
    }
    console.log('Affiliate links set up successfully');
    
    // Step 5: Add initial blog posts
    console.log('Adding initial blog posts...');

    const blogPosts = [
      {
        title: 'The Art of French Cheese: A Journey Through Tradition',
        content: `<h2>The Cradle of Artisanal Cheese Mastery</h2>
        <p>France's cheese-making tradition spans over a thousand years, representing one of the world's most significant gastronomic legacies. With over 1,000 distinct varieties—from firm mountain cheeses to delicate bloomy rinds—French cheese embodies the nation's dedication to terroir and craftsmanship. These diverse creations reflect France's varied landscapes: from the lush pastures of Normandy to the rugged peaks of the Pyrenees, each region has developed distinctive styles that honor local resources and cultural heritage.</p>
      
        <figure class="my-8">
          <img src="/images/blog/french-cheese-map.jpg" alt="Map of French cheese regions" class="rounded-lg shadow-md w-full" />
          <figcaption class="text-sm text-center mt-2 text-footer-text-secondary">The diverse regions of France, each with distinct cheese-making traditions shaped by local geography, climate, and cultural practices.</figcaption>
        </figure>
      
        <h2>A Cultural Heritage Protected by Law</h2>
        <p>The French approach to cheese extends beyond culinary practice—it's enshrined in law through the Appellation d'Origine Protégée (AOP) system. This rigorous framework safeguards traditional methods and regional specificity, ensuring that cheeses like Roquefort or Comté meet exacting standards to bear their prestigious names. The system specifies everything from permissible livestock breeds to milk handling techniques, aging requirements, and even the specific pastures where animals may graze. This legal protection preserves centuries-old techniques while giving consumers confidence in authenticity and quality.</p>
      
        <p>When a cheese receives AOP designation, it becomes part of France's protected cultural heritage. Consider Comté, produced in the Jura mountains for over 1,000 years: its AOP specifications require milk from Montbéliarde cows grazing on identified pastures at specific altitudes, followed by copper-vat heating and minimum aging periods. These strict standards ensure that traditional methods endure despite modernization pressures.</p>
      
        <h2>Regional Identity Through Cheese</h2>
        <p>Each French region expresses its distinct character through its signature cheeses. In Normandy, the lush, rainy landscape with its rich grasslands produces exceptional dairy, yielding creamy masterpieces like Camembert, Pont-l'Évêque, and Livarot. These soft, bloomy-rind and washed-rind varieties showcase the region's fertile terroir and ancient monastic cheese-making traditions.</p>
      
        <figure class="my-8">
          <img src="/images/blog/camembert-production.jpg" alt="Traditional Camembert production" class="rounded-lg shadow-md w-full" />
          <figcaption class="text-sm text-center mt-2 text-footer-text-secondary">Artisans ladling curds into molds by hand at a traditional Camembert production facility in Normandy, preserving centuries-old techniques.</figcaption>
        </figure>
      
        <p>Moving south to Auvergne, the volcanic soil and mountainous terrain create ideal conditions for distinctive cheeses like Cantal, Salers, and Saint-Nectaire. These semi-hard to hard varieties often feature earthy, grassy notes that reflect the mineral-rich pastures of this ancient region, where cheese-making dates back to Celtic Gaul.</p>
      
        <p>In contrast, the steep slopes of the Alps foster another tradition entirely. Here, Beaufort, Reblochon, and Abondance demonstrate alpine cheese-making ingenuity—larger formats designed for long aging periods to sustain mountain communities through harsh winters. Their complex, nutty flavors develop during aging in cool mountain caves, creating cheeses prized for both nutrition and flavor complexity.</p>
      
        <h2>The Monastery Connection</h2>
        <p>Many iconic French cheeses owe their existence to monastic orders. During the Middle Ages, monasteries served as centers of agricultural innovation, with monks developing cheese-making techniques to preserve surplus milk and create revenue sources. These religious communities meticulously documented their methods, gradually refining processes that would become the foundation of France's cheese heritage.</p>
      
        <p>Munster, developed by Benedictine monks in the Vosges Mountains, exemplifies this monastic influence. Its distinctive orange rind and powerful aroma result from regular washing with brine during aging—a technique perfected by monks to extend shelf life while creating complex flavors. Similarly, the Cistercian order developed Cîteaux, while Trappist monks created Port-Salut, demonstrating how religious communities shaped France's cheese landscape.</p>
      
        <figure class="my-8">
          <img src="/images/blog/monastery-aging-cellar.jpg" alt="Monastery aging cellar" class="rounded-lg shadow-md w-full" />
          <figcaption class="text-sm text-center mt-2 text-footer-text-secondary">Ancient stone aging cellar beneath a French monastery, where generations of monks have perfected the art of cheese aging for centuries.</figcaption>
        </figure>
      
        <h2>The Science Within the Tradition</h2>
        <p>Though rooted in tradition, French cheese-making embraces sophisticated microbiology. Each cheese represents a carefully orchestrated interaction between milk components, beneficial bacteria, enzymes, and environmental conditions. The white bloomy rind of Brie and Camembert comes from Penicillium candidum, while Roquefort's distinctive blue veins result from Penicillium roqueforti introduced through strategic piercing of the cheese.</p>
      
        <p>Modern artisans balance time-honored techniques with scientific understanding, recognizing that successful cheese-making requires controlling fermentation, enzymatic activity, and aging conditions. This marriage of tradition and science allows consistency while preserving the artisanal character that makes French cheeses unique.</p>
      
        <h2>The Five Families of French Cheese</h2>
        <p>French cheese diversity can be understood through five main families, each representing distinct traditions and techniques:</p>
      
        <h3>1. Fresh Cheeses (Fromages Frais)</h3>
        <p>Unaged and delicate, these cheeses like Petit-Suisse and Fromage Blanc retain milk's natural moisture and mild flavor. They represent the simplest, most ancient form of cheese preservation, showcasing milk's pure essence with minimal processing.</p>
      
        <h3>2. Soft-Ripened Cheeses (Pâtes Molles à Croûte Fleurie)</h3>
        <p>Characterized by bloomy white rinds covering creamy interiors, Brie and Camembert epitomize this category. Their development involves surface-ripening, where molds break down proteins and fats from the outside in, creating increasingly complex flavors and textures as they age.</p>
      
        <figure class="my-8">
          <img src="/images/blog/brie-de-meaux-wheel.jpg" alt="Wheel of Brie de Meaux" class="rounded-lg shadow-md w-full" />
          <figcaption class="text-sm text-center mt-2 text-footer-text-secondary">A perfectly ripened wheel of Brie de Meaux, showcasing its characteristic bloomy white rind and creamy interior that flows at the peak of ripeness.</figcaption>
        </figure>
      
        <h3>3. Washed-Rind Cheeses (Pâtes Molles à Croûte Lavée)</h3>
        <p>The orange-hued, aromatic cheeses like Époisses, Livarot, and Munster undergo regular washing with brine, beer, wine, or spirits during aging. This encourages salt-tolerant bacteria that create distinctive pungent aromas and complex flavors behind their characteristically robust exteriors.</p>
      
        <h3>4. Semi-Hard and Hard Cheeses (Pâtes Pressées)</h3>
        <p>These include pressed, cooked varieties like Comté, Beaufort, and Cantal. Their production involves pressing curds to remove whey, sometimes followed by cooking and extended aging periods. The result: concentrated flavors and firmer textures that develop complexity over months or years.</p>
      
        <h3>5. Blue Cheeses (Pâtes Persillées)</h3>
        <p>Roquefort, Bleu d'Auvergne, and Fourme d'Ambert feature characteristic blue-green veins throughout. These striking patterns form when specific molds grow along tiny air channels created during production, developing distinctive peppery, earthy flavors that contrast with the creamy base.</p>
      
        <h2>The Art of Affinage</h2>
        <p>Perhaps no aspect of French cheese-making demonstrates its artisanal character more clearly than affinage—the careful aging process that transforms simple curds into complex gastronomic treasures. Master affineurs (cheese agers) oversee this transformation in environments with precisely controlled temperature and humidity.</p>
      
        <p>Affineurs must understand each cheese's unique development cycle, intervening at critical moments to wash rinds, turn wheels, or adjust conditions. Consider Comté, which matures for 8-36 months under expert supervision. During this time, affineurs regularly test, clean, and rotate each massive wheel, ensuring even aging as enzymes slowly break down proteins and fats, developing the cheese's prized crystalline texture and complex flavor profile.</p>
      
        <figure class="my-8">
          <img src="/images/blog/comte-aging-cellar.jpg" alt="Comté aging cellar" class="rounded-lg shadow-md w-full" />
          <figcaption class="text-sm text-center mt-2 text-footer-text-secondary">Rows of Comté wheels aging in a traditional cellar, where each 80-pound wheel will be regularly turned and monitored for proper development during its many months of maturation.</figcaption>
        </figure>
      
        <h2>The Role of Raw Milk</h2>
        <p>Many traditional French cheeses rely on raw (unpasteurized) milk, which provides the complex microbial ecosystem essential to their character. While pasteurization offers safety advantages and consistency, many aficionados believe it sacrifices depth of flavor and regional distinctiveness.</p>
      
        <p>Raw milk cheeses contain naturally occurring enzymes and beneficial bacteria unique to specific regions and herds. When skilled cheesemakers harness these microorganisms, they create cheeses with nuanced flavors impossible to replicate with pasteurized milk. This biological connection to place gives authentic raw milk cheeses their terroir—the taste of their homeland.</p>
      
        <h2>The Seasonal Connection</h2>
        <p>Traditional French cheese-making maintains strong ties to natural cycles. Many artisanal producers recognize that milk composition changes throughout the year as animals' diets shift with seasonal vegetation. Rather than standardizing to eliminate these variations, they embrace them as expressions of time and place.</p>
      
        <p>Spring cheeses often display herbaceous, floral notes from fresh grasses and wildflowers, while autumn versions may offer richer, nuttier profiles from late-season forage. This seasonal sensitivity creates a living connection to the agricultural rhythms that have shaped French rural life for centuries.</p>
      
        <h2>Preservation Amidst Industrialization</h2>
        <p>France's cheese heritage faces modern challenges from standardization, industrialization, and changing consumer preferences. Mass production threatens traditional methods, while hygiene regulations sometimes constrain artisanal practices. Yet passionate producers, supported by protective legislation and discerning consumers, continue fighting to preserve authentic techniques.</p>
      
        <p>Organizations like Slow Food and governmental initiatives help document and protect endangered cheese varieties. Meanwhile, a new generation of artisans combines respect for tradition with contemporary innovation, ensuring that French cheese culture remains vibrant rather than becoming a museum piece.</p>
      
        <figure class="my-8">
          <img src="/images/blog/young-cheesemakers.jpg" alt="Young cheesemakers learning traditional methods" class="rounded-lg shadow-md w-full" />
          <figcaption class="text-sm text-center mt-2 text-footer-text-secondary">A new generation of French cheesemakers learning traditional techniques from master artisans, ensuring these ancient crafts continue into the future.</figcaption>
        </figure>
      
        <h2>The Future of Tradition</h2>
        <p>As we look toward the future of French cheese-making, the most promising path forward balances preservation with thoughtful evolution. The essence of this culinary heritage lies not in rigid adherence to the past but in maintaining core principles of craftsmanship, terroir, and sensory excellence while adapting to contemporary contexts.</p>
      
        <p>Today's most successful artisans honor tradition while embracing sustainable practices, improved safety standards, and innovative approaches. They recognize that French cheese tradition has always evolved—what we now consider "traditional" methods were once innovations themselves. By respecting this dynamic heritage, they ensure that the extraordinary diversity and quality of French cheese will continue to delight connoisseurs for generations to come.</p>
      
        <p>The story of French cheese is ultimately one of relationship—between animals and land, farmers and milk, artisans and time, and finally, between the finished cheese and those who appreciate it. In each carefully crafted wheel or perfectly ripened small format lies centuries of accumulated wisdom, expressing both the particularity of place and the universal human dedication to transforming simple ingredients into works of cultural and culinary art.</p>`,
        slug: 'french-cheese'
      },
      {
        title: 'Mimolette: The Captivating Story Behind France\'s Orange Cheese Treasure',
        content: `<h2>A Cheese Born of Royal Ambition</h2>
        <p>In the 17th century, King Louis XIV sought a French alternative to Dutch Edam cheese. The result? Mimolette - its name derived from "mi-mou" (semi-soft) and "mollet" (plump). This vibrant cheese became known as "Boule de Lille" for its cannonball shape, a nod to its northern French roots.</p>
      
        <h2>The Art of Mimolette Craftsmanship</h2>
        <p>What makes this cheese truly unique:</p>
        <ul>
          <li><strong>Signature Hue:</strong> Natural annatto seeds give its distinctive orange color, originally added to distinguish it from Dutch cheeses</li>
          <li><strong>Mite-Aged Rind:</strong> Special cheese mites (Acarus siro) are introduced to create its characteristic pocked surface</li>
          <li><strong>Time-Honored Aging:</strong> Aged 6-24 months, developing from mild caramel notes to intense savory complexity</li>
        </ul>
      
        <h2>Why Cheese Connoisseurs Covet Mimolette</h2>
        <div class="rating-grid">
          <div>Flavor Intensity <span class="rating">8/10</span></div>
          <div>Complexity <span class="rating">9/10</span></div>
          <div>Age Potential <span class="rating">10/10</span></div>
        </div>
      
        <h2>From Dairy to Delicacy: The Production Process</h2>
        <p>Traditional Mimolette-making involves:</p>
        <ol>
          <li>Raw cow's milk curdling with animal rennet</li>
          <li>Kneading the curd into spherical molds</li>
          <li>Brining for 10+ hours to form protective rind</li>
          <li>3-month mite introduction for texture development</li>
          <li>Regular rotation during 2-year aging process</li>
        </ol>
      
        <h2>Why You'll Love This Cheese</h2>
        <ul>
          <li><strong>Visual Drama:</strong> Stunning cheese board centerpiece</li>
          <li><strong>Flavor Evolution:</strong> Tastes different at various ages</li>
          <li><strong>Versatile Use:</strong> Grate over pasta, melt in sandwiches, or savor alone</li>
        </ul>`,
        affiliate_link: 'https://amzn.to/4jybBDd',
        slug: 'mimolette-intro'
      }
    ];

    for (const post of blogPosts) {
      const result = await client.query(`
        INSERT INTO blog_posts 
          (title, content, affiliate_link, created_at)
        VALUES 
          ($1, $2, $3, NOW())
        RETURNING id
      `, [
        post.title,
        post.content,
        post.affiliate_link || null
      ]);
      
      // If the post has a designated slug, add a special entry in post_affiliate_links for easier URL access
      if (post.slug) {
        await client.query(`
          INSERT INTO post_affiliate_links 
            (post_id, label, url, created_at, updated_at)
          VALUES 
            ($1, 'slug', $2, NOW(), NOW())
        `, [
          result.rows[0].id,
          post.slug
        ]);
      }
      
      // If the post has an affiliate link, add product details to post_affiliate_links
      if (post.affiliate_link && post.title.includes('Mimolette')) {
        await client.query(`
          INSERT INTO post_affiliate_links 
            (post_id, label, url, price, weight, unit, created_at, updated_at)
          VALUES 
            ($1, 'Buy Mimolette Cheese', $2, $3, $4, $5, NOW(), NOW())
        `, [
          result.rows[0].id,
          post.affiliate_link,
          13.59,
          0.5,
          'lb'
        ]);
      }
    }
    console.log(`Added ${blogPosts.length} initial blog posts`);
    
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

// Check if --drop flag is present
const shouldDrop = process.argv.includes('--drop');
runConsolidatedMigration(shouldDrop).catch(console.error); 