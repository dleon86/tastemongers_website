import NewsletterButton from '../components/ui/NewsletterButton';

export default function AboutPage() {
  return (
    <div className="relative isolate min-h-screen">
      {/* Backsplash Image Div */}
      <div
        style={{ backgroundImage: "url('/images/about/taste-melted-wide-fullspread-3x1-v1.png')" }}
        className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed"
        aria-hidden="true"
      ></div>
      {/* Semi-transparent overlay for better text visibility */}
      <div className="absolute inset-0 -z-10 bg-black/30 dark:bg-black/50"></div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">About TasteMongers</h1>
            <p className="text-xl text-white drop-shadow-md max-w-2xl mx-auto">
              Your trusted guide in discovering and enjoying the world's finest artisanal foods
            </p>
          </section>

          {/* Mission Statement */}
          <section className="bg-card-bg opacity-90 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Our Mission</h2>
            <p className="text-foreground mb-6">
              At TasteMongers, we believe that great food is one of life's finest pleasures. 
              Our mission is to help food enthusiasts discover exceptional artisanal products, 
              starting with our deep dive into the world of cheese. We combine expert knowledge 
              with honest reviews to guide you towards remarkable culinary experiences.
            </p>
            <p className="text-foreground">
              Through detailed ratings, comprehensive reviews, and carefully curated recommendations, 
              we aim to bridge the gap between artisanal producers and discerning consumers, 
              making the world of fine foods more accessible to everyone.
            </p>
          </section>

          {/* What We Offer */}
          <section className="bg-card-bg opacity-90 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Expert Reviews</h3>
                <p className="text-foreground">
                  Our team of food experts thoroughly evaluates each product, providing detailed 
                  tasting notes and comprehensive reviews you can trust.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Curated Recommendations</h3>
                <p className="text-foreground">
                  We carefully select and recommend products based on quality, craftsmanship, 
                  and exceptional taste profiles.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Educational Content</h3>
                <p className="text-foreground">
                  Learn about food origins, production methods, and how to best enjoy various 
                  artisanal products through our educational blog posts.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Community</h3>
                <p className="text-foreground">
                  Join a community of food enthusiasts sharing their experiences and discoveries 
                  in the world of artisanal foods.
                </p>
              </div>
            </div>
          </section>

          {/* Future Vision */}
          <section className="bg-card-bg opacity-90 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Our Vision</h2>
            <p className="text-foreground mb-6">
              While we're starting with cheese, our vision extends to becoming your trusted 
              resource for all artisanal foods. We're building a comprehensive database of 
              expert ratings and reviews that will help you discover exceptional products 
              across various categories.
            </p>
            <p className="text-foreground">
              Stay tuned as we expand our coverage to include more artisanal food categories, 
              each evaluated with the same dedication to quality and expertise that defines 
              TasteMongers.
            </p>
          </section>

          {/* Newsletter CTA */}
          <section className="bg-card-bg opacity-90 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Join Our Journey</h2>
            <p className="text-foreground mb-6">
              Subscribe to our newsletter to stay updated on our latest reviews, recommendations, 
              and the expansion of our artisanal food coverage.
            </p>
            <NewsletterButton>Subscribe Now</NewsletterButton>
          </section>
        </div>
      </div>
    </div>
  );
} 