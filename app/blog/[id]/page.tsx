import pool from '../../lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  affiliate_link: string | null;
  created_at: string;
}

type BlogPostParams = {
  params: {
    id: string;
  };
};

export default async function BlogPostPage({ params }: BlogPostParams) {
  // Validate the ID parameter
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  // Fetch the blog post data
  const { rows } = await pool.query<BlogPost>(`
    SELECT id, title, content, affiliate_link, created_at 
    FROM blog_posts 
    WHERE id = $1
  `, [id]);

  // If no post is found, show 404
  if (rows.length === 0) {
    return notFound();
  }

  const post = rows[0];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800">
          ← Back to all posts
        </Link>
      </div>

      <article className="bg-background rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4 text-foreground">{post.title}</h1>
        
        <div className="text-gray-500 mb-6 dark:text-gray-400">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        
        <div className="prose max-w-none mb-8 text-foreground">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        
        {post.affiliate_link && (
          <div className="cta-box mt-8">
            <h3 className="text-xl font-semibold mb-2">Try it yourself!</h3>
            <p className="mb-4">Ready to experience this amazing product? Get it delivered right to your door.</p>
            <a 
              href={post.affiliate_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="affiliate-cta inline-block"
            >
              Shop Now
            </a>
            <p className="small-text mt-2">
              *As an affiliate, we earn from qualifying purchases.
            </p>
          </div>
        )}
      </article>
      
      <div className="mt-12">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800">
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
} 