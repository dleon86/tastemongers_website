import pool from '@/lib/db'; // Use path alias
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  affiliate_link: string | null;
  created_at: string;
}

// Define the expected props structure for a dynamic route page
interface BlogPostPageProps {
  params: {
    id: string;
  };
  // searchParams?: { [key: string]: string | string[] | undefined }; // Optional: if you use search params
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Validate the ID parameter
  const id = parseInt(params.id);
  if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
    return notFound(); // Return 404 if ID is not a positive integer
  }

  try {
    // Fetch the blog post data
    const { rows } = await pool.query<BlogPost>(
      `SELECT id, title, content, affiliate_link, created_at 
       FROM blog_posts 
       WHERE id = $1`,
      [id]
    );

    // If no post is found, show 404
    if (rows.length === 0) {
      return notFound();
    }

    const post = rows[0];

    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to all posts
          </Link>
        </div>

        <article className="bg-background rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-4 text-foreground">{post.title}</h1>
          
          <div className="text-sm text-gray-500 mb-6 dark:text-gray-400">
            Published on: {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          
          {/* Ensure prose styles correctly handle Tailwind dark mode for foreground text */}
          <div 
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-foreground dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {post.affiliate_link && (
            <div className="cta-box mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-semibold mb-2 text-foreground">Try it yourself!</h3>
              <p className="mb-4 text-foreground/80">Ready to experience this amazing product? Get it delivered right to your door.</p>
              <a 
                href={post.affiliate_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200"
              >
                Shop Now
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
  } catch (error) {
    console.error("Error fetching blog post:", error);
    // Optionally, you could render a generic error page or re-throw to Next.js error boundary
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error loading post</h1>
        <p>Sorry, we encountered an issue trying to load this blog post. Please try again later.</p>
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          ← Back to all posts
        </Link>
      </div>
    );
  }
} 