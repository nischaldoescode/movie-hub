import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Calendar, Award, Play, Plus, Heart, Info, Users, TrendingUp, Globe } from 'lucide-react';

const MovieCard = ({ movie, featured = false }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine if it's a movie or TV show
  const mediaType = movie.media_type || 'movie';
  
  // Handle missing or broken poster images
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Format the rating to have one decimal place
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  
  // Get the year from release date or first air date
  const year = movie.release_date 
    ? movie.release_date.split('-')[0] 
    : movie.first_air_date 
      ? movie.first_air_date.split('-')[0] 
      : '';
  
  // Get genres as string
  const genres = movie.genre_ids ? 
    movie.genre_ids.slice(0, 2).join(', ') : 
    'Unknown';
  
  // Generate dynamic quality badge
  const getQualityBadge = () => {
    const qualityOptions = ['HD', '4K', 'Full HD', 'HDR'];
    const index = movie.id ? movie.id % qualityOptions.length : 0;
    return qualityOptions[index];
  };
  
  // Generate dynamic popularity indicator
  const getPopularityLevel = () => {
    if (movie.popularity > 50) return 'trending';
    if (movie.popularity > 20) return 'popular';
    return 'featured';
  };
  
  // Animation delay for skeleton loading
  useEffect(() => {
    // Simulate image loading delay for skeleton effect
    const timer = setTimeout(() => {
      if (!movie.poster_path) {
        setImageError(true);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [movie.poster_path]);
  
  // Desktop hover handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  // Generate placeholder gradient based on movie id
  const getGradientColors = () => {
    const colors = [
      ['bg-gradient-to-br', 'from-blue-900', 'to-purple-800'],
      ['bg-gradient-to-br', 'from-red-900', 'to-orange-800'],
      ['bg-gradient-to-br', 'from-emerald-900', 'to-teal-800'],
      ['bg-gradient-to-br', 'from-indigo-900', 'to-violet-800'],
      ['bg-gradient-to-br', 'from-pink-900', 'to-rose-800'],
      ['bg-gradient-to-br', 'from-amber-900', 'to-yellow-800'],
      ['bg-gradient-to-br', 'from-cyan-900', 'to-blue-800'],
      ['bg-gradient-to-br', 'from-violet-900', 'to-purple-800'],
    ];
    
    const index = movie.id ? movie.id % colors.length : 0;
    return colors[index].join(' ');
  };
  
  // Card sizes and layout based on featured flag
  const cardClasses = featured 
    ? 'sm:col-span-2 md:col-span-2 lg:col-span-2'
    : '';
  
  return (
    <Link 
      to={`/${mediaType}/${movie.id}`}
      className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${cardClasses} bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 hover:border-blue-500/50`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card Container */}
      <div className="flex flex-col h-full relative">
        {/* Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-900">
          {/* Skeleton Loader */}
          <div className={`absolute inset-0 ${getGradientColors()} animate-pulse ${imageError || !movie.poster_path ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
            <div className="flex items-center justify-center h-full">
              {imageError && (
                <div className="text-center p-4">
                  <div className="mb-2">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Play size={24} className="text-white" />
                    </div>
                  </div>
                  <span className="text-white font-medium text-sm">{movie.title || movie.name}</span>
                  <p className="text-white/70 text-xs mt-1">Premium Content Available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Actual Image */}
          {!imageError && (
            <img
              src={movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/api/placeholder/300/450'}
              alt={movie.title || movie.name}
              className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 blur-sm brightness-50' : ''}`}
              onError={handleImageError}
              loading="lazy"
            />
          )}
          
          {/* Quality Badge */}
          <div className="absolute top-2 right-2 bg-green-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-bold">
            {getQualityBadge()}
          </div>
          
          {/* Rating Badge */}
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center text-xs font-bold">
            <Star size={12} className="mr-1 text-yellow-400" fill="currentColor" />
            {rating}
          </div>
          
          {/* Popularity Indicator */}
          {getPopularityLevel() === 'trending' && (
            <div className="absolute top-12 left-2 bg-red-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-xs font-medium flex items-center">
              <TrendingUp size={10} className="mr-1" />
              Trending
            </div>
          )}
          
          {/* Media Type Badge */}
          <div className="absolute bottom-2 left-2 bg-blue-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-xs uppercase font-medium">
            {mediaType === 'tv' ? 'Series' : 'Movie'}
          </div>
          
          {/* Watch Status Indicator */}
          <div className="absolute bottom-2 right-2 bg-purple-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-xs font-medium">
            Available
          </div>
        </div>
        
        {/* Content */}
        <div className="p-3 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex-grow">
          <h3 className="font-semibold truncate text-sm sm:text-base mb-1 text-white">
            {movie.title || movie.name}
          </h3>
          
          <div className="flex justify-between items-center mb-2 text-xs text-gray-400">
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>{year || 'Recent'}</span>
            </div>
            {movie.runtime && (
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>{movie.runtime} min</span>
              </div>
            )}
          </div>
          
          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Globe size={10} className="mr-1" />
              <span>Multi-Language</span>
            </div>
            <div className="flex items-center">
              <Users size={10} className="mr-1" />
              <span>All Ages</span>
            </div>
          </div>
          
          {/* Content Description */}
          <p className="text-gray-400 text-xs mt-2 line-clamp-2">
            Experience premium entertainment with crystal clear quality and seamless streaming technology.
          </p>
        </div>
      </div>
      
      {/* Hover Overlay - Enhanced with animation */}
      <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-gray-900/80 flex flex-col justify-between p-4 transition-all duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div>
          <h3 className="font-bold text-white text-lg mb-2">{movie.title || movie.name}</h3>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="flex items-center bg-yellow-600/30 px-2 py-0.5 rounded text-yellow-400 text-xs">
              <Star size={12} className="mr-1" fill="currentColor" />
              {rating}/10
            </div>
            {year && (
              <div className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded text-xs">
                {year}
              </div>
            )}
            <div className="bg-green-900/30 text-green-400 px-2 py-0.5 rounded text-xs">
              {getQualityBadge()}
            </div>
          </div>
          
          <p className="text-gray-300 text-sm line-clamp-3 mb-3">
            {movie.overview || 'Discover this amazing title with our advanced streaming platform. Enjoy high-quality video, multiple language options, and an immersive viewing experience tailored for entertainment enthusiasts.'}
          </p>
          
          {/* Enhanced Features */}
          <div className="mb-3">
            <div className="flex items-center text-xs text-gray-400 mb-1">
              <Info size={12} className="mr-1" />
              <span>Premium Features Available</span>
            </div>
            <div className="flex flex-wrap gap-1 text-xs">
              <span className="bg-gray-800/50 text-gray-300 px-2 py-0.5 rounded">Subtitles</span>
              <span className="bg-gray-800/50 text-gray-300 px-2 py-0.5 rounded">HD Audio</span>
              <span className="bg-gray-800/50 text-gray-300 px-2 py-0.5 rounded">Mobile Ready</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1">
            {movie.genre_ids?.slice(0, 3).map((genre, index) => (
              <span key={index} className="text-xs bg-gray-800/70 text-gray-300 px-2 py-0.5 rounded border border-gray-700">
                {typeof genre === 'string' ? genre : `Category ${genre}`}
              </span>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105">
              <Play size={16} />
              <span>Watch Now</span>
            </button>
            <button className="flex items-center justify-center bg-gray-800/70 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 border border-gray-600 hover:border-gray-500">
              <Plus size={16} />
            </button>
          </div>
          
          {/* Additional Info */}
          <div className="text-xs text-gray-500 text-center mt-2">
            <p>Stream instantly with our advanced player technology</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Grid container component to properly display responsive cards
export const MovieCardGrid = ({ movies, loading = false }) => {
  // Generate skeleton cards when loading
  const skeletonCards = Array(8).fill().map((_, index) => (
    <div key={`skeleton-${index}`} className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-gray-800 to-gray-900 animate-pulse border border-gray-700">
      <div className="aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
        <div className="absolute top-2 left-2 w-12 h-6 bg-gray-600 rounded-full"></div>
        <div className="absolute top-2 right-2 w-8 h-6 bg-gray-600 rounded"></div>
        <div className="absolute bottom-2 left-2 w-16 h-5 bg-gray-600 rounded"></div>
      </div>
      <div className="p-3 space-y-2">
        <div className="h-5 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-3 bg-gray-700 rounded w-1/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="h-8 bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  ));
  
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Premium Entertainment Collection</h2>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
          Discover an extensive library of high-quality movies and series. Our platform provides seamless access to entertainment content with advanced streaming technology and user-friendly interface.
        </p>
      </div>
      
      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4 lg:gap-5 xl:gap-6">
        {loading 
          ? skeletonCards
          : movies.map((movie, index) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              featured={index === 0} 
            />
          ))
        }
      </div>
      
      {/* Footer Info */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-2">Enhanced Viewing Experience</h3>
          <p className="text-gray-400 text-sm">
            Our platform delivers content through advanced streaming infrastructure, ensuring optimal quality and performance. 
            Experience entertainment with multiple language support, subtitle options, and adaptive streaming technology.
          </p>
          <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
            <span>HD Quality</span>
            <span>•</span>
            <span>Multi-Language</span>
            <span>•</span>
            <span>All Devices</span>
            <span>•</span>
            <span>Instant Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
