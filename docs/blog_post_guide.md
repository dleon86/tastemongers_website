# TasteMongers Blog Post Creation Guide

## Writing Blog Posts

### Content Structure

1. **Title**: Create a descriptive, engaging title for your post.

2. **Content Format**: Blog posts use HTML for formatting. Structure your content with:
   - `<h2>`, `<h3>` for section headings
   - `<p>` for paragraphs
   - `<ul>`, `<ol>`, `<li>` for lists
   - `<strong>` for bold text

3. **Images**: Use this format for images with captions:
   ```html
   <figure class="my-8">
     <img src="/images/blog/your-image.jpg" alt="Description of image" class="rounded-lg shadow-md w-full" />
     <figcaption class="text-sm text-center mt-2 text-footer-text-secondary">Your image caption goes here</figcaption>
   </figure>
   ```

4. **Special Components**:
   - Ratings grid:
     ```html
     <div class="rating-grid">
       <div>Category Name <span class="rating">8/10</span></div>
       <div>Another Category <span class="rating">9/10</span></div>
     </div>
     ```

### Affiliate Links

You have two options for including affiliate links:

1. **Simple Link**: Include a single affiliate URL for the "Shop Now" button at the bottom of the post.

2. **Detailed Product Links**: Add multiple products with prices, weights, and other details.

## Uploading to Vercel PostgreSQL Database

### Option 1: Using SQL (Direct Database Access)

1. Connect to your Vercel PostgreSQL database:
   ```bash
   psql "postgres://username:password@hostname:port/database"
   ```

2. Insert the blog post:
   ```sql
   INSERT INTO blog_posts (title, content, affiliate_link, created_at)
   VALUES (
     'Your Blog Post Title', 
     '<h2>Your HTML Content</h2><p>More content...</p>',
     'https://your-affiliate-link.com',
     NOW()
   ) RETURNING id;
   ```

3. Note the returned ID, then add any detailed product links:
   ```sql
   INSERT INTO post_affiliate_links 
     (post_id, label, url, price, weight, unit, created_at, updated_at)
   VALUES 
     (123, 'Buy Product Name', 'https://affiliate-link.com', 29.99, 0.5, 'lb', NOW(), NOW());
   ```

4. Add a friendly URL slug (optional):
   ```sql
   INSERT INTO post_affiliate_links 
     (post_id, label, url, created_at, updated_at)
   VALUES 
     (123, 'slug', 'your-post-title-slug', NOW(), NOW());
   ```

### Option 2: Using Vercel's Database UI

1. Go to your Vercel project dashboard
2. Navigate to Storage → Database → Data
3. Select the `blog_posts` table
4. Click "Add Row" and fill in:
   - `title`: Your post title
   - `content`: Your HTML content
   - `affiliate_link`: Your main affiliate link (if any)
   - `created_at`: Current timestamp

5. Then select the `post_affiliate_links` table 
6. Click "Add Row" for each product or slug:
   - `post_id`: ID of your newly created post
   - `label`: "Buy Product Name" or "slug" for friendly URLs
   - `url`: Product affiliate link or slug text
   - Add price/weight/unit for product links

### Option 3: Creating an Admin Interface

For easier content management, consider building a simple admin interface:

1. Create a password-protected `/admin/new-post` route
2. Build a form with fields for title, content (rich text editor), and affiliate links
3. Handle form submission to insert data into both tables
4. Include image upload functionality that places files in `/public/images/blog/`

## Best Practices

1. **Images**: Store all blog images in `/public/images/blog/` with descriptive filenames
2. **SEO**: Use descriptive titles and include relevant keywords
3. **Formatting**: Keep paragraphs short and use headings to break up content
4. **Affiliate Links**: Always disclose affiliate relationships
5. **URL Slugs**: Create reader-friendly URLs by adding slug entries

## Accessing Your Posts

- Regular post URL: `/blog/123` (where 123 is the post ID)
- With slug URL: `/blog/your-post-title-slug` (if you added a slug)

## Example Blog Post Format

```html
<h2>Introduction</h2>
<p>Your introduction paragraph goes here...</p>

<figure class="my-8">
  <img src="/images/blog/example-image.jpg" alt="Description of image" class="rounded-lg shadow-md w-full" />
  <figcaption class="text-sm text-center mt-2 text-footer-text-secondary">Image caption</figcaption>
</figure>

<h2>First Section</h2>
<p>Content for your first section...</p>

<h3>Subsection</h3>
<p>More detailed content...</p>

<ul>
  <li><strong>Bold Point:</strong> Important information</li>
  <li><strong>Another Point:</strong> More information</li>
</ul>

<h2>Product Ratings</h2>
<div class="rating-grid">
  <div>Flavor Intensity <span class="rating">8/10</span></div>
  <div>Complexity <span class="rating">9/10</span></div>
  <div>Value <span class="rating">7/10</span></div>
</div>

<h2>Conclusion</h2>
<p>Your concluding thoughts...</p>
``` 