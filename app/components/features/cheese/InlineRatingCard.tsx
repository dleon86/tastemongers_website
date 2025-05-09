'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';

interface AffiliateOption {
  affiliate_url: string;
  price: number;
  weight: number;
  unit: string;
}

interface Rating {
  id: number;
  cheese_name: string;
  type: string;
  origin: string;
  overall_rating: number;
  flavor_intensity: number;
  complexity: number;
  creaminess: number;
  tasting_notes?: string;
  pairing_suggestions?: string;
  affiliate_options?: AffiliateOption[];
  image_url?: string;
}

interface Props {
  rating: Rating;
  onClose: () => void;
  renderStars: (rating: number) => string;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export default function InlineRatingCard({ rating, onClose, renderStars, onNavigate }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;
  
  // Handle touch events for swipe navigation on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      onNavigate('next');
    } else if (isRightSwipe) {
      onNavigate('prev');
    }
    
    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // Close when clicking outside the card
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        onNavigate('next');
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNavigate, onClose]);

  return (
    <div 
      className="bg-background opacity-95 rounded-xl shadow-2xl p-4 md:p-8 max-w-4xl w-full mx-auto overflow-auto max-h-[90vh]"
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating to backdrop
    >
      {/* Navigation Indicators for Mobile */}
      <div className="flex justify-between items-center mb-4 text-gray-400 md:hidden">
        <div className="text-2xl" onClick={() => onNavigate('prev')}>⟨</div>
        <div className="text-sm">Swipe to navigate</div>
        <div className="text-2xl" onClick={() => onNavigate('next')}>⟩</div>
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{rating.cheese_name}</h2>
          <div className="text-base md:text-lg text-foreground mb-4">
            {rating.type} • {rating.origin}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-3xl font-bold text-foreground hover:text-amber-500 ml-4"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <div className="mb-8">
        {rating.image_url ? (
          <div className="mb-6">
            <img
              src={rating.image_url}
              alt={`Image of ${rating.cheese_name}`}
              className="rounded-lg w-full h-auto max-h-96 object-cover shadow-md"
            />
          </div>
        ) : (
          <div className="mb-6 flex justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-lg h-64">
            <span className="text-sm text-gray-500 dark:text-gray-400">No Image</span>
          </div>
        )}

        {/* Ratings row - responsive layout */}
        <div 
          className="grid mb-6 w-full grid-cols-2 md:grid-cols-4 gap-2 md:gap-0"
        >
          <div className="text-center border-b md:border-b-0 md:border-r border-gray-200 pb-2 md:pb-0">
            <div className="font-medium text-foreground mb-2">Overall Rating</div>
            <div className="text-yellow-500 text-base md:text-lg">{renderStars(rating.overall_rating)}</div>
          </div>
          <div className="text-center border-b md:border-b-0 md:border-r border-gray-200 pb-2 md:pb-0">
            <div className="font-medium text-foreground mb-2">Intensity</div>
            <div className="text-yellow-500 text-base md:text-lg">{renderStars(rating.flavor_intensity)}</div>
          </div>
          <div className="text-center md:border-r border-gray-200">
            <div className="font-medium text-foreground mb-2">Complexity</div>
            <div className="text-yellow-500 text-base md:text-lg">{renderStars(rating.complexity)}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-foreground mb-2">Creaminess</div>
            <div className="text-yellow-500 text-base md:text-lg">{renderStars(rating.creaminess)}</div>
          </div>
        </div>

        <div className="space-y-6">
          {rating.tasting_notes && (
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">Tasting Notes</h3>
              <p className="text-foreground leading-relaxed">{rating.tasting_notes}</p>
            </div>
          )}

          {rating.pairing_suggestions && (
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">Pairing Suggestions</h3>
              <p className="text-foreground leading-relaxed">{rating.pairing_suggestions}</p>
            </div>
          )}
        </div>
      </div>

      {rating.affiliate_options && rating.affiliate_options.length > 0 && (
        <div className="mt-4 w-full space-y-4">
          {rating.affiliate_options.map((option, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl md:text-2xl font-bold text-foreground">
                  ${parseFloat(String(option.price)).toFixed(2)}
                </span>
                <span className="text-sm md:text-base text-neutral-700 dark:text-neutral-300">
                  {option.weight} {option.unit}
                </span>
              </div>
              <a
                href={option.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-amber-500 dark:bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-600 text-black dark:text-black font-bold py-3 px-4 rounded-lg shadow-lg border-2 border-amber-700 dark:border-amber-700 text-center w-full transition-all duration-200"
                style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}
              >
                <span className="relative z-10 font-extrabold">
                  Buy {option.weight}{option.unit}
                </span>
              </a>
            </div>
          ))}
        </div>
      )}
      
      {/* Desktop Navigation Buttons */}
      <div className="hidden md:flex justify-between mt-8">
        <button
          onClick={() => onNavigate('prev')}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-foreground hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={() => onNavigate('next')}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-foreground hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
} 