import NewsletterButton from '../components/ui/NewsletterButton';
import RatingsInterface from '../components/features/cheese/RatingsInterface';

export default function RatingsPage() {
  return (
    <div className="relative isolate min-h-screen">
      <div
        style={{ backgroundImage: "url('/images/ratings/taste-cheesegrid-wide-fullspread-3x1-v1.png')" }}
        className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed"
        aria-hidden="true"
      ></div>
      {/* Semi-transparent overlay for better text visibility */}
      <div className="absolute inset-0 -z-10 bg-black/30 dark:bg-black/50"></div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">Expert Food Ratings</h1>
            <p className="text-xl text-white drop-shadow-md">
              Comprehensive ratings and reviews of artisanal foods by our experts
            </p>
          </section>

          {/* Ratings Interface */}
          <RatingsInterface />

          {/* Newsletter signup specific to ratings */}
          <div className="rounded-lg shadow-md p-8 bg-card-bg opacity-90">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Stay Updated</h3>
              <p className="mb-6 text-foreground">
                Subscribe to our newsletter to receive updates when new ratings are added
                and get exclusive insights from our food experts.
              </p>
              <NewsletterButton>Subscribe for Updates</NewsletterButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 