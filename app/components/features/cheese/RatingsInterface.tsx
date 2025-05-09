'use client';

import { useState, useEffect, useCallback } from 'react';
import InlineRatingCard from './InlineRatingCard';

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
  flavor_intensity: number;
  complexity: number;
  creaminess: number;
  overall_rating: number;
  tasting_notes?: string;
  pairing_suggestions?: string;
  affiliate_options?: AffiliateOption[];
  image_url?: string;
}

interface Filters {
  type: string;
  origin: string;
  minOverallRating: number;
  minFlavorIntensity: number;
  minComplexity: number;
  minCreaminess: number;
  search: string;
}

export default function RatingsInterface() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [filters, setFilters] = useState<Filters>({
    type: '',
    origin: '',
    minOverallRating: 0,
    minFlavorIntensity: 0,
    minComplexity: 0,
    minCreaminess: 0,
    search: ''
  });
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
  const [uniqueOrigins, setUniqueOrigins] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await fetch('/api/ratings');
      const data: Rating[] = await response.json() as Rating[];
      setRatings(data);
      
      const types = [...new Set<string>(data.map((r: Rating) => r.type))];
      const origins = [...new Set<string>(data.map((r: Rating) => r.origin))];
      setUniqueTypes(types);
      setUniqueOrigins(origins);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setLoading(false);
    }
  };

  const filteredRatings = ratings
    .filter(rating => {
      return (
        (!filters.type || rating.type === filters.type) &&
        (!filters.origin || rating.origin === filters.origin) &&
        rating.overall_rating >= filters.minOverallRating &&
        rating.flavor_intensity >= filters.minFlavorIntensity &&
        rating.complexity >= filters.minComplexity &&
        rating.creaminess >= filters.minCreaminess &&
        (!filters.search || rating.cheese_name.toLowerCase().includes(filters.search.toLowerCase()))
      );
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'overall_rating_desc': return b.overall_rating - a.overall_rating;
        case 'overall_rating_asc': return a.overall_rating - b.overall_rating;
        case 'intensity_desc': return b.flavor_intensity - a.flavor_intensity;
        case 'intensity_asc': return a.flavor_intensity - b.flavor_intensity;
        case 'complexity_desc': return b.complexity - a.complexity;
        case 'complexity_asc': return a.complexity - b.complexity;
        case 'creaminess_desc': return b.creaminess - a.creaminess;
        case 'creaminess_asc': return a.creaminess - b.creaminess;
        case 'name_asc': return a.cheese_name.localeCompare(b.cheese_name);
        case 'name_desc': return b.cheese_name.localeCompare(a.cheese_name);
        case 'type_asc': return a.type.localeCompare(b.type);
        case 'type_desc': return b.type.localeCompare(a.type);
        case 'origin_asc': return a.origin.localeCompare(b.origin);
        case 'origin_desc': return b.origin.localeCompare(a.origin);
        default: return 0;
      }
    });

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(10 - rating);
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      origin: '',
      minOverallRating: 0,
      minFlavorIntensity: 0,
      minComplexity: 0,
      minCreaminess: 0,
      search: ''
    });
    setSortBy('');
  };

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    if (!selectedRating) return;
    const currentIndex = filteredRatings.findIndex(r => r.id === selectedRating.id);
    if (currentIndex === -1) return;

    let newIndex = currentIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredRatings.length;
    } else if (direction === 'prev') {
      newIndex = (currentIndex - 1 + filteredRatings.length) % filteredRatings.length;
    }

    setSelectedRating(filteredRatings[newIndex]);
  }, [filteredRatings, selectedRating]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters Section - NO LONGER STICKY */}
      <div className="bg-background pt-8 pb-4">
        {/* Filters Section */}
        <div className="bg-background rounded-lg shadow-md p-6 border border-foreground/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Filter & Sort</h2>
            <button 
              onClick={resetFilters}
              className="text-sm text-foreground/70 hover:text-foreground"
            >
              Clear All Filters
            </button>
          </div>
          
          {/* New responsive grid for all filter/sort controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Search Cheese */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Search Cheese
              </label>
              <input
                type="text"
                className="w-full bg-background border border-foreground/10 rounded-lg px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="  Search by name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            
            {/* Cheese Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cheese Type
              </label>
              <select 
                className="w-full bg-background border border-foreground/10 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Origin */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Origin
              </label>
              <select 
                className="w-full bg-background border border-foreground/10 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={filters.origin}
                onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
              >
                <option value="">All Origins</option>
                {uniqueOrigins.map(origin => (
                  <option key={origin} value={origin}>{origin}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sort By
              </label>
              <select 
                className="w-full bg-background border border-foreground/10 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Default</option>
                <option value="overall_rating_desc">Overall Rating (High to Low)</option>
                <option value="overall_rating_asc">Overall Rating (Low to High)</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="intensity_desc">Intensity (High to Low)</option>
                <option value="intensity_asc">Intensity (Low to High)</option>
                <option value="complexity_desc">Complexity (High to Low)</option>
                <option value="complexity_asc">Complexity (Low to High)</option>
                <option value="creaminess_desc">Creaminess (High to Low)</option>
                <option value="creaminess_asc">Creaminess (Low to High)</option>
                <option value="type_asc">Type (A-Z)</option>
                <option value="type_desc">Type (Z-A)</option>
                <option value="origin_asc">Origin (A-Z)</option>
                <option value="origin_desc">Origin (Z-A)</option>
              </select>
            </div>
          </div>
          
          {/* Rating Filter Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 mt-6">
            {/* Overall Rating Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">
                  Min Overall Rating
                </label>
                <span className="text-sm text-amber-500 font-semibold">
                  {filters.minOverallRating}/10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={filters.minOverallRating}
                onChange={(e) => setFilters({ ...filters, minOverallRating: parseInt(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
            
            {/* Flavor Intensity Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">
                  Min Intensity
                </label>
                <span className="text-sm text-amber-500 font-semibold">
                  {filters.minFlavorIntensity}/10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={filters.minFlavorIntensity}
                onChange={(e) => setFilters({ ...filters, minFlavorIntensity: parseInt(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
            
            {/* Complexity Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">
                  Min Complexity
                </label>
                <span className="text-sm text-amber-500 font-semibold">
                  {filters.minComplexity}/10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={filters.minComplexity}
                onChange={(e) => setFilters({ ...filters, minComplexity: parseInt(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
            
            {/* Creaminess Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">
                  Min Creaminess
                </label>
                <span className="text-sm text-amber-500 font-semibold">
                  {filters.minCreaminess}/10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={filters.minCreaminess}
                onChange={(e) => setFilters({ ...filters, minCreaminess: parseInt(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-foreground text-sm mb-2">
        Showing {filteredRatings.length} of {ratings.length} items
      </div>
      
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {filteredRatings.length > 0 ? (
          filteredRatings.map(rating => (
            <div 
              key={rating.id}
              onClick={() => setSelectedRating(rating)} 
              className="bg-background opacity-90 rounded-lg shadow-md p-6 border border-foreground/10 cursor-pointer hover:shadow-lg transition-shadow"
            >
              {/* Image display */}
              <div className="mb-4 h-48 overflow-hidden rounded-lg">
                {rating.image_url ? (
                  <img
                    src={rating.image_url}
                    alt={`Image of ${rating.cheese_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center bg-gray-200 dark:bg-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <h3 className="text-xl font-bold text-foreground mb-2">{rating.cheese_name}</h3>
                <div className="text-yellow-500 font-bold">{rating.overall_rating}/10</div>
              </div>
              <div className="text-foreground text-sm mb-4">{rating.type} • {rating.origin}</div>
              
              {/* Ratings Stars */}
              <div className="mb-2 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-foreground">Flavor Intensity:</span>
                  <span className="text-yellow-500">{renderStars(rating.flavor_intensity)}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-foreground">Complexity:</span>
                  <span className="text-yellow-500">{renderStars(rating.complexity)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Creaminess:</span>
                  <span className="text-yellow-500">{renderStars(rating.creaminess)}</span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-primary hover:text-primary-dark inline-block">
                  View Details
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-foreground">
            <p className="text-lg mb-2">No ratings match your current filters</p>
            <button 
              onClick={resetFilters}
              className="text-primary hover:text-primary-dark"
            >
              Reset Filters
            </button>
          </div>
        )}
        
        {/* Modal overlay for selected rating */}
        {selectedRating && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRating(null)}
          >
            <InlineRatingCard 
              rating={selectedRating}
              onClose={() => setSelectedRating(null)}
              renderStars={renderStars}
              onNavigate={handleNavigate}
            />
          </div>
        )}
      </div>
    </div>
  );
} 