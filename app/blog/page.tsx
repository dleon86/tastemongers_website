import { sql } from '../lib/db';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  affiliate_link: string | null;
  created_at: string;
}

export default async function BlogPage({ params }: { params: { page?: string } }) {
  const page = parseInt(params.page || '1');
  const postsPerPage = 5;
  const offset = (page - 1) * postsPerPage;

  // Use the Neon serverless driver with tagged template literals
  const posts = await sql`
    SELECT id, title, content, affiliate_link, created_at 
    FROM blog_posts 
    ORDER BY created_at DESC
    LIMIT ${postsPerPage} OFFSET ${offset}
  ` as BlogPost[];

  // Handle the case when no posts exist yet
  if (!posts || posts.length === 0) {
    return (
      <div className="relative isolate min-h-screen">
        <div
          style={{ backgroundImage: "url('/images/blog/taste-cheesecellar-wide-fullspread-3x1-v1.png')" }}
          className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed"
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 -z-10 bg-black/30 dark:bg-black/50"></div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-12">
            <section className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">The TasteMongers Blog</h1>
              <p className="text-xl text-white drop-shadow-md">
                Expert insights, reviews, and stories about artisanal foods
              </p>
            </section>
            <div className="bg-card-bg opacity-90 rounded-lg shadow-md p-8">
              <p className="text-foreground">No blog posts yet. Check back soon!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const latestPost = posts[0];
  const olderPosts = posts.slice(1);

  return (
    <div className="relative isolate min-h-screen">
      <div
        style={{ backgroundImage: "url('/images/blog/taste-cheesecellar-wide-fullspread-3x1-v1.png')" }}
        className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed"
        aria-hidden="true"
      ></div>
      {/* Semi-transparent overlay for better text visibility */}
      <div className="absolute inset-0 -z-10 bg-black/30 dark:bg-black/50"></div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-12">
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">The TasteMongers Blog</h1>
            <p className="text-xl text-white drop-shadow-md">
              Expert insights, reviews, and stories about artisanal foods
            </p>
          </section>

          {latestPost && (
            <article className="bg-card-bg opacity-90 rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-semibold mb-3 hover:text-primary text-foreground">
                <Link href={`/blog/${latestPost.id}`}>{latestPost.title}</Link>
              </h2>
              <div className="text-footer-text-secondary mb-4">
                {new Date(latestPost.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="prose max-w-none mb-6 text-foreground">
                <div dangerouslySetInnerHTML={{ 
                  __html: latestPost.content.split(' ').slice(0, 50).join(' ') + '...'
                }} />
              </div>
              <Link 
                href={`/blog/${latestPost.id}`}
                className="text-primary hover:text-primary-dark font-semibold transition-colors"
              >
                Read More →
              </Link>
            </article>
          )}

          <div className="grid grid-cols-1 gap-12">
            {olderPosts.map((post) => (
              <article key={post.id} className="bg-card-bg opacity-90 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold mb-3 hover:text-primary text-foreground">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <div className="text-footer-text-secondary mb-4">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="prose max-w-none mb-6 text-foreground">
                  <div dangerouslySetInnerHTML={{ 
                    __html: post.content.split(' ').slice(0, 50).join(' ') + '...'
                  }} />
                </div>
                <Link 
                  href={`/blog/${post.id}`}
                  className="text-primary hover:text-primary-dark font-semibold transition-colors"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            {page > 1 && (
              <Link href={`/blog?page=${page - 1}`} className="text-primary hover:text-primary-dark font-semibold transition-colors">
                ← Previous
              </Link>
            )}
            {olderPosts.length === postsPerPage && (
              <Link href={`/blog?page=${page + 1}`} className="text-primary hover:text-primary-dark font-semibold transition-colors">
                Next →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 