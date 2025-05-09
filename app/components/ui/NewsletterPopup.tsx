'use client';

import { useState, useEffect } from 'react';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCustomEvent = () => {
      setIsOpen(true);
      setIsSubmitted(false);
      setError('');
    };

    window.addEventListener('openNewsletterPopup', handleCustomEvent);
    return () => window.removeEventListener('openNewsletterPopup', handleCustomEvent);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {isSubmitted ? (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h3>
            <p className="text-gray-700 mb-6">
              You're now subscribed to our newsletter. Get ready for exclusive deals, 
              expert recommendations, and the latest updates from the world of artisanal foods!
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
            <p className="text-gray-700 mb-6">
              Subscribe to our newsletter and enjoy:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Exclusive deals on artisanal foods</li>
              <li>Early access to new product ratings</li>
              <li>Expert tips and pairing suggestions</li>
              <li>Special promotions from our partners</li>
            </ul>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Subscribe Now
              </button>

              <p className="text-xs text-gray-500 text-center">
                By subscribing, you agree to receive marketing emails from TasteMongers. 
                You can unsubscribe at any time.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 