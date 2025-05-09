/* eslint-disable react/no-unescaped-entities */
import NewsletterButton from '../components/ui/NewsletterButton';

export default function PairingsPage() {
  return (
    <div className="relative isolate min-h-screen">
      <div
        style={{ backgroundImage: "url('/images/pairings/taste-melted-wide-fullspread-3x1-v1.png')" }}
        className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed"
        aria-hidden="true"
      ></div>
      {/* Semi-transparent overlay for better text visibility */}
      <div className="absolute inset-0 -z-10 bg-black/30 dark:bg-black/50"></div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">Food Pairings</h1>
            <p className="text-xl text-white drop-shadow-md">
              Discover the perfect combinations to elevate your culinary experience
            </p>
          </section>

          {/* Coming Soon Message */}
          <div className="rounded-lg shadow-md p-8 bg-card-bg opacity-90">
            <div className="text-center">
              <h3 className="text-3xl font-semibold mb-6 text-foreground">Coming Soon!</h3>
              <p className="mb-6 text-foreground text-xl">
                We're working on an exciting new feature that will help you find the perfect cheese for your favorite wine, or the ideal wine for your favorite cheese.
              </p>
              <p className="mb-6 text-foreground">
                Our new pairings database will allow you to search in reverse - if you have a specific wine, we'll recommend cheeses that pair perfectly with it, and vice versa.
              </p>
              <NewsletterButton>Get Notified When We Launch</NewsletterButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 