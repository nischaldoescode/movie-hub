import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Calendar, Clock } from 'lucide-react';

// Move animations to a separate CSS file or use styled-components/emotion
// Here we'll use a style element in the component instead
const MovieCarousel = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [mouseEntered, setMouseEntered] = useState(false);
  
  const autoPlayRef = useRef(null);
  const carouselRef = useRef(null);
  
  const filteredMovies = movies?.filter(movie => 
    movie.backdrop_path && (movie.overview || '').length > 20
  ) || [];
  
  // If no valid movies, show nothing
  if (filteredMovies.length === 0) {
    return null;
  }
  
  // Detect if user is on mobile device and adjust carousel height
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768; // Consider devices smaller than 768px as mobile
      setIsMobile(isMobileView);
      
      // Adjust carousel height for mobile view
      if (carouselRef.current) {
        if (isMobileView) {
          // Set a fixed height on mobile to ensure full coverage
          const viewportHeight = window.innerHeight;
          carouselRef.current.style.height = `${viewportHeight}px`;
        } else {
          carouselRef.current.style.height = '100vh';
        }
      }
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Format runtime
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };
  
  // Handle image preloading
  useEffect(() => {
    const newImagesLoaded = { ...imagesLoaded };
    
    filteredMovies.forEach((movie, index) => {
      if (!newImagesLoaded[index]) {
        const backdropImg = new Image();
        backdropImg.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
        
        const posterImg = new Image();
        posterImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        
        Promise.all([
          new Promise(resolve => backdropImg.onload = resolve),
          new Promise(resolve => posterImg.onload = resolve)
        ]).then(() => {
          setImagesLoaded(prev => ({
            ...prev,
            [index]: true
          }));
        });
      }
    });
  }, [filteredMovies]);
  
  // Next slide with smooth transition
  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === filteredMovies.length - 1 ? 0 : prevIndex + 1
    );
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 800);
  };
  
  // Previous slide with smooth transition
  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? filteredMovies.length - 1 : prevIndex - 1
    );
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 800);
  };
  
  // Set up auto-scroll with animation
  useEffect(() => {
    // Auto scroll when not hovering
    if (!mouseEntered) {
      autoPlayRef.current = setTimeout(() => {
        nextSlide();
      }, 5000); // 5 seconds
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [currentIndex, isTransitioning, mouseEntered]);
  
  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
    setMouseEntered(true);
  };
  
  // Resume autoplay on mouse leave
  const handleMouseLeave = () => {
    setMouseEntered(false);
    autoPlayRef.current = setTimeout(() => {
      nextSlide();
    }, 5000);
  };
  
  // Get current movie
  const currentMovie = filteredMovies[currentIndex];
  const mediaType = currentMovie.media_type || 'movie';
  
  // Function to handle text truncation
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <div className="px-2 py-14">
      {/* Add the CSS for animations in a regular style tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes float {
          0% { transform: translateY(0) rotate(0); }
          100% { transform: translateY(-10px) rotate(3deg); }
        }
        
        @keyframes moveLight {
          0% { transform: translateX(-100%) scale(1); opacity: 0.1; }
          50% { opacity: 0.3; }
          100% { transform: translateX(100%) scale(1.5); opacity: 0.1; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes textShine {
          0% { transform: translateX(-100%); }
          20%, 100% { transform: translateX(100%); }
        }
        
        @keyframes pulseColor {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(45deg); }
          100% { filter: hue-rotate(0deg); }
        }
        
        @keyframes twinkle {
          0% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
          100% { opacity: 0.3; transform: scale(1); }
        }
        
        @keyframes borderPulse {
          0% { opacity: 0.5; }
          100% { opacity: 0.8; }
        }
        
        @keyframes moveFog {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
      `}} />
      
      <div 
        ref={carouselRef}
        className="relative h-screen md:h-screen w-full overflow-hidden rounded-md"
        style={{ minHeight: isMobile ? '100vh' : 'auto' }}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Image with enhanced effects */}
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
          {/* Background particle effect */}
          <div className="absolute inset-0 bg-black opacity-60 z-0">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full bg-white/30"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  boxShadow: '0 0 10px 2px rgba(255,255,255,0.3)',
                  animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate-reverse ease-in-out ${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
          
          <div 
            className={`absolute inset-0 bg-cover bg-center transform transition-all duration-1500 ease-out ${
              isTransitioning ? 'opacity-0 scale-105' : 'opacity-60 scale-110'
            }`}
            style={{ 
              backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
              filter: `blur(${isMobile ? '0px' : '1px'}) brightness(${isMobile ? '0.95' : '0.85'})`,
              transform: `scale(${isTransitioning ? '1.15' : '1.1'})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              height: '100%',
              width: '100%',
              top: '0',
              left: '0',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          >
            {/* Mobile-specific image overlay to ensure full coverage */}
            {isMobile && (
              <img 
                src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ 
                  opacity: 0.6,
                  filter: 'brightness(0.95)'
                }}
              />
            )}
          </div>
          
          {/* Enhanced gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/20 transition-opacity duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent transition-opacity duration-1000" />
          
          {/* Dynamic color overlay based on movie theme */}
          <div className={`absolute inset-0 mix-blend-overlay transition-opacity duration-1000 ${
            isTransitioning ? 'opacity-0' : 'opacity-30'
          }`} style={{ 
            background: `radial-gradient(circle at top right, 
              hsl(${(currentIndex * 40) % 360}, 70%, 50%), 
              transparent 70%)`
          }} />
          
          {/* Animated light rays - enhanced */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-1/2 h-full bg-blue-500/20 rotate-45 transform -translate-x-full" style={{ animation: 'moveLight 8s infinite alternate' }} />
            <div className="absolute top-0 right-1/4 w-1/3 h-full bg-purple-500/15 -rotate-45 transform translate-x-full" style={{ animation: 'moveLight 12s infinite alternate' }} />
            <div className="absolute bottom-0 left-1/3 w-1/4 h-full bg-pink-500/15" style={{ transform: 'rotate(30deg) translateY(-50%)', animation: 'moveLight 15s infinite alternate' }} />
          </div>
          
          {/* Ambient particles - enhanced */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {[...Array(25)].map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full bg-white/20"
                style={{
                  width: `${Math.random() * 8 + 2}px`,
                  height: `${Math.random() * 8 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s infinite alternate ease-in-out`,
                  filter: `blur(${Math.random() * 2}px)`,
                  boxShadow: '0 0 15px 5px rgba(255,255,255,0.15)'
                }}
              />
            ))}
          </div>
          
          {/* Cinematic lens flare */}
          <div 
            className={`absolute inset-0 pointer-events-none ${isTransitioning ? 'opacity-0' : 'opacity-70'}`}
            style={{
              background: 'radial-gradient(circle at 75% 25%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              transition: 'opacity 1.5s ease-in-out'
            }}
          />
          
          {/* Moving fog effect */}
          <div 
            className="absolute inset-0 opacity-20 overflow-hidden"
            style={{
              background: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 800 800%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22a%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.005%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23a)%22 opacity=%22.5%22/%3E%3C/svg%3E")',
              animation: 'moveFog 120s linear infinite'
            }}
          />
          
          {/* Pulse effect on transition */}
          <div className={`absolute inset-0 bg-white transition-opacity duration-500 ${
            isTransitioning ? 'opacity-5' : 'opacity-0'
          }`} />
        </div>
        
        {/* Main Content Container - centered vertically */}
        <div 
          className={`relative h-full flex items-center justify-center transition-all duration-800 ${
            isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'
          }`}
        >
          <div className="container mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-center h-full">
            {/* Desktop Layout */}
            <div className="hidden md:flex w-full max-w-6xl items-center justify-between gap-8 lg:gap-12">
              {/* Text Content - LEFT side with title included */}
              <div className="w-full md:w-3/5 space-y-4 text-left flex flex-col justify-center" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                {/* Title with enhanced shine effect */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight line-clamp-2 relative break-words overflow-hidden">
                  <span className="relative inline-block w-full">
                    {currentMovie.title || currentMovie.name}
                    {/* Enhanced text shine effect */}
                    <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ width: '150%', transform: 'translateX(-100%)', animation: 'textShine 3s ease-in-out infinite' }}></span>
                  </span>
                  {/* Text glow effect */}
                  <span className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 blur-sm rounded-lg opacity-60 -z-10" style={{ animation: 'pulse 2s infinite' }}></span>
                </h1>
                
                <div className="flex flex-wrap items-center justify-start gap-3 text-sm md:text-base text-gray-300">
                  {/* Rating */}
                  <div className="flex items-center">
                    <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 mr-1" fill="currentColor" style={{ animation: 'pulse 4s infinite' }} />
                    <span>{currentMovie.vote_average?.toFixed(1) || 'N/A'}</span>
                  </div>
                  
                  {/* Year */}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-blue-400 mr-1" />
                    <span>
                      {(currentMovie.release_date || currentMovie.first_air_date || '').split('-')[0] || 'N/A'}
                    </span>
                  </div>
                  
                  {/* Runtime */}
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-green-400 mr-1" />
                    <span>{formatRuntime(currentMovie.runtime)}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 max-w-xl text-xs sm:text-sm md:text-base line-clamp-4 lg:line-clamp-5 overflow-hidden relative">
                  <span className="relative inline-block">
                    {currentMovie.overview}
                    {/* Text highlight effect with enhanced shimmer */}
                    <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ width: '150%', transform: 'translateX(-100%)', animation: 'textShine 4s ease-in-out infinite' }}></span>
                  </span>
                </p>
                
                <div className="pt-2">
                  <Link 
                    to={`/${mediaType}/${currentMovie.id}`}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm md:text-base py-1.5 px-4 sm:py-2 sm:px-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 relative overflow-hidden group"
                  >
                    {/* Button glow effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out"></span>
                    
                    <Play className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" fill="currentColor" style={{ animation: 'pulse 2s infinite' }} />
                    Watch Now
                  </Link>
                </div>
              </div>
              
              {/* Poster Image - RIGHT - for desktop only */}
              <div className="w-1/3 md:w-1/3 lg:w-1/4 shrink-0 flex items-center justify-center" style={{ animation: 'fadeIn 1s ease-out' }}>
                <div className="rounded-lg overflow-hidden shadow-2xl transform transition-transform duration-300 hover:scale-105 relative w-full max-w-xs">
                  {/* Poster border glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-70 blur-sm" style={{ animation: 'borderPulse 4s infinite alternate' }}></div>
                  
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`} 
                      alt={currentMovie.title || currentMovie.name}
                      className="w-full h-auto object-cover"
                      style={{
                        opacity: imagesLoaded[currentIndex] ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out'
                      }}
                    />
                    
                    {/* Shimmer effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ transform: 'translateX(-100%)', animation: 'shimmer 2s infinite' }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Layout - stacked vertically with improved responsiveness */}
            <div className="md:hidden w-full max-w-xl flex flex-col items-center justify-center space-y-4 px-3">
              {/* Movie title with enhanced shine effect */}
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight tracking-tight text-center mb-2 break-words w-full px-2 line-clamp-2 relative overflow-hidden">
                <span className="relative inline-block w-full">
                  {currentMovie.title || currentMovie.name}
                  {/* Enhanced text shine effect for mobile - using wider gradient that extends beyond container */}
                  <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ width: '200%', transform: 'translateX(-100%)', animation: 'textShine 3s ease-in-out infinite' }}></span>
                </span>
                <span className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 blur-sm rounded-lg opacity-60 -z-10" style={{ animation: 'pulse 2s infinite' }}></span>
              </h1>
              
              {/* Rating, Year, Runtime */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" style={{ animation: 'pulse 4s infinite' }} />
                  <span>{currentMovie.vote_average?.toFixed(1) || 'N/A'}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-blue-400 mr-1" />
                  <span>
                    {(currentMovie.release_date || currentMovie.first_air_date || '').split('-')[0] || 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-green-400 mr-1" />
                  <span>{formatRuntime(currentMovie.runtime)}</span>
                </div>
              </div>
              
              {/* Overview - improved contrast and responsiveness with proper ellipsis only when needed */}
              <div className="w-full bg-black/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-lg">
                <p className="text-gray-100 text-xs sm:text-sm overflow-hidden text-center">
                  {/* Using CSS line-clamp with proper overflow handling for ellipsis */}
                  <span className="line-clamp-5 sm:line-clamp-6 relative overflow-hidden">
                    {currentMovie.overview}
                    {/* Enhanced text shine effect for description */}
                    <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ width: '200%', transform: 'translateX(-100%)', animation: 'textShine 4s ease-in-out infinite' }}></span>
                  </span>
                </p>
              </div>
              
              {/* Watch now button */}
              <div className="pt-2 text-center">
                <Link 
                  to={`/${mediaType}/${currentMovie.id}`}
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm py-2 px-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out"></span>
                  <Play className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" fill="currentColor" style={{ animation: 'pulse 2s infinite' }} />
                  Watch Now
                </Link>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MovieCarousel;
