import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Tv, Loader } from 'lucide-react';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  
  // Suggested search terms (non-clickable)
  const suggestedSearches = [
    "Action movies", 
    "Sci-fi", 
    "Comedy", 
    "Horror", 
    "Drama", 
    "Fantasy",
    "Animation"
  ];
  
  // Mock search function - replace with your actual API call
  const searchMovies = async (searchQuery) => {
    setIsSearching(true);
    
    try {
      // Simulating a response with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock results - replace with actual data processing
      const mockResults = [
        { id: 1, title: searchQuery + ' Movie', type: 'movie', poster_path: null },
        { id: 2, title: searchQuery + ' 2: The Sequel', type: 'movie', poster_path: null },
        { id: 3, title: searchQuery + ' TV Show', type: 'tv', poster_path: null },
      ];
      
      setSearchResults(mockResults);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Focus input when modal opens - fixes mobile responsiveness issue
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the modal is fully rendered
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          
          // Force mobile keyboard to appear
          if (window.innerWidth <= 768) {
            inputRef.current.click();
          }
        }
      }, 50);
    }
    
    // Clear search when modal closes
    if (!isOpen) {
      setQuery('');
      setSearchResults([]);
      setShowResults(false);
      setValidationError('');
    }
  }, [isOpen]);

  // Handle clicks outside the search container to close the modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle search input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear validation error when user starts typing again
    if (validationError) {
      setValidationError('');
    }
    
    if (value.length >= 2) {
      // Debounce search to avoid too many API calls
      const timeoutId = setTimeout(() => {
        searchMovies(value);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  // Handle search form submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Validate the search input
    if (!query || query.trim() === '') {
      setValidationError('Please enter a search term');
      return;
    }
    
    // Clear validation error
    setValidationError('');
    
    // Navigate to search results page
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setShowResults(false);
    setSearchResults([]);
    setValidationError('');
    inputRef.current?.focus();
  };

  // Navigate to details page
  const goToDetails = (item) => {
    const path = item.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;
    navigate(path);
    onClose();
  };
  
  // Helper function to manually set the search input value
  const useSearchTerm = (term) => {
    setQuery(term);
    searchMovies(term);
    setValidationError('');
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4">
      {/* Full screen backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal container */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-3xl bg-gray-900/90 rounded-2xl shadow-2xl border border-blue-500/20 overflow-hidden z-50"
        style={{
          boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.4)'
        }}
      >
        {/* Close button (X) in top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close search"
        >
          <X size={20} />
        </button>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search movies & TV shows..."
              value={query}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-xl py-4 pl-12 pr-12
                text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              aria-label="Search movies and TV shows"
            />
            
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search size={24} className="text-blue-400" />
            </div>
            
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                {isSearching ? <Loader size={22} className="animate-spin text-blue-400" /> : <X size={22} />}
              </button>
            )}
          </div>
          
          {/* Validation Error Message */}
          {validationError && (
            <p className="text-red-400 text-sm mt-2">{validationError}</p>
          )}
        </form>
        
        {/* Suggested search terms - non-clickable pills */}
        {!query && (
          <div className="px-4 pb-4">
            <p className="text-sm text-gray-400 mb-2">Suggested searches:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedSearches.map((term, index) => (
                <div
                  key={index}
                  className="bg-gray-800 text-blue-300 px-3 py-1 rounded-full text-sm cursor-pointer flex items-center hover:bg-gray-700 transition-colors"
                  onClick={() => useSearchTerm(term)}
                >
                  <Search size={14} className="mr-1" />
                  {term}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty div with ellipsis when no search is active */}
        {!query && !showResults && (
          <div className="px-4 py-8 text-center text-gray-500">
            <p className="text-2xl">Search ...</p>
            <p className="mt-2 text-sm">Type to search for movies and TV shows</p>
          </div>
        )}
        
        {/* Search results area */}
        <div className="max-h-96 overflow-y-auto">
          {showResults && searchResults.length > 0 ? (
            <div className="p-3 space-y-1">
              {searchResults.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => goToDetails(item)}
                  className="flex items-center p-4 hover:bg-blue-900/40 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-16 sm:w-14 sm:h-20 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center mr-4 shadow-md border border-blue-500/20">
                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      item.type === 'movie' ? (
                        <Film size={24} className="text-blue-400" />
                      ) : (
                        <Tv size={24} className="text-blue-400" />
                      )
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-white">{item.title}</p>
                    <p className="text-sm text-blue-300 mt-1">
                      {item.type === 'movie' ? 'Movie' : 'TV Show'}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="p-3 border-t border-blue-500/30">
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 text-center text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  View all results for "{query}"
                </button>
              </div>
            </div>
          ) : query.length >= 2 && !isSearching && searchResults.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No results found for "{query}"</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;