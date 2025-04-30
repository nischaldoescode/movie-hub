import { Star, Clock, Calendar, Globe, Tag, Play } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const MovieDetailHero = ({ movie, streamingUrl, onPlayClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const bgRef = useRef(null);
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Function to handle background image positioning on scroll
    const handleScroll = () => {
      if (bgRef.current) {
        const scrollPosition = window.scrollY;
        bgRef.current.style.transform = `translateY(${scrollPosition * 0.4}px) scale(1.05)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlayClick = () => {
    if (typeof onPlayClick === 'function') {
      onPlayClick(streamingUrl);
    }
    
    // Smooth scroll to the video section if needed
    const videoSection = document.getElementById('video-player-section');
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!movie) return null;
  
  // Format runtime from minutes to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };
  
  // Format year from release date
  const year = movie.release_date 
    ? movie.release_date.split('-')[0] 
    : movie.first_air_date 
      ? movie.first_air_date.split('-')[0] 
      : 'N/A';
  
  return (
    <div className={`relative transition-opacity duration-700 overflow-hidden min-h-screen ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Image with Parallax Effect - Fixed positioning to prevent cutoff */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat top-0"
          style={{ 
            backgroundImage: movie.backdrop_path 
              ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` 
              : 'none',
            height: '120%', // Extra height to prevent top cutoff
            top: '-10%', // Start higher to prevent top cutoff
          }}>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-900/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10 min-h-screen flex flex-col justify-center">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Poster - Smaller on mobile, normal on desktop */}
          <div className="w-full sm:w-2/5 md:w-1/4 flex-shrink-0 mx-auto md:mx-0">
            <div className="rounded-lg overflow-hidden shadow-2xl transform transition-transform duration-300 hover:scale-105 relative group">
              <img 
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                  : 'https://cdn4.iconfinder.com/data/icons/picture-sharing-sites/32/No_Image-1024.png'}
                alt={movie.title || movie.name}
                className="w-full h-auto"
                loading="eager"
              />
              {/* Poster hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button 
                  onClick={handlePlayClick}
                  className="bg-red-600 text-white p-3 rounded-full transform transition-transform duration-300 hover:scale-110"
                  aria-label="Play movie"
                >
                  <Play className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="md:w-3/4 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 transition-all duration-300 ease-in-out">
              {movie.title || movie.name}
            </h1>
            
            <div className="text-lg text-gray-400 mb-4 transition-all duration-300 ease-in-out">
              {movie.tagline && <p className="italic">{movie.tagline}</p>}
            </div>
            
            {/* Stats Row - More responsive layout */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6 text-xs sm:text-sm text-gray-300">
              {/* Rating */}
              <div className="flex items-center bg-gray-800/50 px-2 sm:px-3 py-1 rounded-full">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                <span className="text-gray-400 ml-1">({movie.vote_count || 0})</span>
              </div>
              
              {/* Year */}
              <div className="flex items-center bg-gray-800/50 px-2 sm:px-3 py-1 rounded-full">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-1" />
                <span>{year}</span>
              </div>
              
              {/* Runtime */}
              <div className="flex items-center bg-gray-800/50 px-2 sm:px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-1" />
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
              
              {/* Language */}
              <div className="flex items-center bg-gray-800/50 px-2 sm:px-3 py-1 rounded-full">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mr-1" />
                <span>{movie.original_language?.toUpperCase() || 'N/A'}</span>
              </div>
            </div>
            
            {/* Genres */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-2 flex items-center justify-center md:justify-start">
                <Tag className="w-4 h-4 mr-1" />
                Genres
              </h3>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {movie.genres?.map(genre => (
                  <span 
                    key={genre.id} 
                    className="px-3 py-1 bg-blue-900/60 text-blue-100 rounded-full text-sm transition-all duration-300 hover:bg-blue-800"
                  >
                    {genre.name}
                  </span>
                )) || 'N/A'}
              </div>
            </div>
            
            {/* Overview/Synopsis */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-2">Synopsis</h3>
              <p className="text-gray-300 leading-relaxed max-h-40 md:max-h-full overflow-y-auto md:overflow-visible">
                {movie.overview || 'No synopsis available.'}
              </p>
            </div>
            
            {/* Watch Button */}
            <div className="mt-6">
              <button 
                onClick={handlePlayClick}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center mx-auto md:mx-0 gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 w-full sm:w-auto"
              >
                <Play className="w-5 h-5" />
                Watch Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailHero;