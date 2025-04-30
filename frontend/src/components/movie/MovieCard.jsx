import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Calendar, Award, Play, Plus, Heart } from 'lucide-react';

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
      className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${cardClasses}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card Container */}
      <div className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-900">
          {/* Skeleton Loader */}
          <div className={`absolute inset-0 ${getGradientColors()} animate-pulse ${imageError || !movie.poster_path ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
            <div className="flex items-center justify-center h-full">
              {imageError && (
                <div className="text-center p-4">
                  <span className="text-white font-medium">{movie.title || movie.name}</span>
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
              className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 blur-sm brightness-50' : ''}`}
              onError={handleImageError}
              loading="lazy"
            />
          )}
          
          {/* Favorite Button */}
          
          {/* Rating Badge */}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center text-xs font-bold">
            <Star size={12} className="mr-1 text-yellow-400" />
            {rating}
          </div>
          
          {/* Media Type Badge */}
          <div className="absolute bottom-2 left-2 bg-blue-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-xs uppercase font-medium">
            {mediaType === 'tv' ? 'TV' : 'Movie'}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-3 bg-gray-900 text-white flex-grow">
          <h3 className="font-semibold truncate text-sm sm:text-base">
            {movie.title || movie.name}
          </h3>
          <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>{year || 'Unknown'}</span>
            </div>
            {movie.runtime && (
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>{movie.runtime} min</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hover Overlay - Enhanced with animation */}
      <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-900/70 flex flex-col justify-between p-4 transition-all duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div>
          <h3 className="font-bold text-white text-lg mb-1">{movie.title || movie.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center bg-yellow-600/30 px-2 py-0.5 rounded text-yellow-400 text-xs">
              <Star size={12} className="mr-1" fill="currentColor" />
              {rating}/10
            </div>
            {year && (
              <div className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded text-xs">
                {year}
              </div>
            )}
          </div>
          <p className="text-gray-300 text-sm line-clamp-3 mb-3">
            {movie.overview || 'No description available for this title.'}
          </p>
        </div>
        
        <div className="space-y-2">
          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1">
            {movie.genre_ids?.slice(0, 2).map((genre, index) => (
              <span key={index} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                {typeof genre === 'string' ? genre : `Genre ${genre}`}
              </span>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
              <Play size={16} />
              <span>Watch</span>
            </button>
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
    <div key={`skeleton-${index}`} className="rounded-xl overflow-hidden shadow-lg bg-gray-800 animate-pulse">
      <div className="aspect-[2/3] bg-gray-700"></div>
      <div className="p-3">
        <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  ));
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-5">
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
  );
};

export default MovieCard;