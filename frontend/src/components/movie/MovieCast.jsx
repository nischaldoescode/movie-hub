import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MovieCast = ({ cast }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  if (!cast || cast.length === 0) {
    return null;
  }
  
  // Handle horizontal scrolling
  const scroll = (direction) => {
    const container = document.getElementById('cast-container');
    if (!container) return;
    
    const scrollAmount = direction === 'left' ? -300 : 300;
    const newPosition = scrollPosition + scrollAmount;
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };
  
  return (
    <div className="mt-8 bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Cast</h2>
      
      <div className="relative">
        {/* Cast scrollable container */}
        <div 
          id="cast-container"
          className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {cast.map((person) => (
            <div 
              key={person.id} 
              className="flex-shrink-0 w-32"
            >
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                {person.profile_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                    alt={person.name}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-600 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="mt-2">
                <h4 className="font-medium text-white text-sm truncate">{person.name}</h4>
                <p className="text-gray-400 text-xs truncate">{person.character}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Scroll buttons */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 bg-gray-900/80 text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 bg-gray-900/80 text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default MovieCast;