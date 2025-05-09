import Link from 'next/link';
import pool from './lib/db';

export default function Home() {
  return (
    <div className="relative isolate min-h-screen">
      {/* Background image with overlay to improve text contrast */}
      <div
        style={{ backgroundImage: "url('/images/home/taste-cheeseboard-wide-fullspread-3x1-v1.png')" }}
        className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed"
        aria-hidden="true"
      ></div>
      {/* Semi-transparent overlay for better text visibility */}
      <div className="absolute inset-0 -z-10 bg-black/30 dark:bg-black/50"></div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Hero Section */}
          <section className="text-center py-12 px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Discover the World of <span className="text-primary-light">Artisanal Foods</span>
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-md">
              Your trusted guide to exploring and enjoying the finest artisanal foods, starting with exceptional cheeses.
            </p>
          </section>

          {/* Featured Content */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card-bg opacity-90 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Latest Blog Post</h2>
              <p className="text-foreground mb-4">
                Read our newest articles on artisanal foods, production methods, and tasting experiences.
              </p>
              <a href="/blog" className="text-primary hover:text-primary-dark font-semibold transition-colors">
                Read More →
              </a>
            </div>

            <div className="bg-card-bg opacity-90 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Expert Ratings</h2>
              <p className="text-foreground mb-4">
                Browse our comprehensive database of expert food ratings and recommendations.
              </p>
              <a href="/ratings" className="text-primary hover:text-primary-dark font-semibold transition-colors">
                View Ratings →
              </a>
            </div>

            <div className="bg-card-bg opacity-90 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Food Pairings</h2>
              <p className="text-foreground mb-4">
                Discover perfect pairings and elevate your culinary experience.
              </p>
              <a href="/pairings" className="text-primary hover:text-primary-dark font-semibold transition-colors">
                Learn More →
              </a>
            </div>
          </section>

          {/* Featured Article Preview */}
          <section className="bg-card-bg opacity-90 rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-semibold mb-6 text-foreground">Featured Article</h2>
            <div className="prose max-w-none">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">The Art of French Cheese: A Journey Through Tradition</h3>
              <p className="text-foreground mb-4">
                Discover the rich history and craftsmanship behind French cheese-making, from the caves of Roquefort to the pastures of Normandy...
              </p>
              <a href="/blog/1" className="text-primary hover:text-primary-dark font-semibold transition-colors">
                Read Full Article →
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
