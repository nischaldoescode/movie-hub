import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMovieContext } from '../context/MovieContext';
import MovieGrid from '../movie/MovieGrid';
import FilterBar from '../ui/FilterBar';
import Loader from '../ui/Loader';
import Pagination from '../ui/Pagination';
import { Search, AlertCircle } from 'lucide-react';

const CollectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const { searchMovies, discoverMovies, discoverTVShows } = useMovieContext();
  
  // Get mediaType from URL (default to 'movie' if not specified)
  const mediaType = searchParams.get('mediaType') || 'movie';
  
  // State management
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filter state from URL params
  const categoryNameToId = {
    'action': '28',
    'comedy': '35',
    'drama': '18',
    'horror': '27',
    'scifi': '878'
  };
  // Handle filters and discovery API
  const categoryParam = searchParams.get('category') || 'all';
  const category = categoryNameToId[categoryParam] || categoryParam;
  const region = searchParams.get('region') || 'all';
  const sort = searchParams.get('sort') || 'popularity';
  useEffect(() => {
    const fetchFilteredItems = async () => {
      if (isSearching) return; // Don't run this when searching
      
      try {
        setLoading(true);
        setError(null);
        
        // Enforce the maximum page limit
        const maxAllowedPages = 500;
        const effectivePage = Math.min(currentPage, maxAllowedPages);
        
        // Base parameters
        const params = {
          page: effectivePage,
          sort_by: sort === 'popularity' ? 'popularity.desc' : 
                   sort === 'rating' ? 'vote_average.desc' : 
                   'release_date.desc',
          "vote_count.gte": 20 // Ensure we get items with some votes
        };
        
        // Add language filter if region selected
        if (region === 'in') {
          params.with_original_language = 'hi';
        } else if (region === 'us') {
          params.with_original_language = 'en';
        } else if (region === 'kr') {
          params.with_original_language = 'ko';
        } else if (region === 'jp') {
          params.with_original_language = 'ja';
        }
        
        // Add genre filter if category selected
        if (category !== 'all') {
          params.with_genres = category;
        }
        
        // Choose the appropriate API endpoint based on mediaType
        let response;
        if (mediaType === 'tvshow') {
          response = await discoverTVShows(params);
        } else {
          response = await discoverMovies(params);
        }
        
        // Filter out items without poster
        const filteredResults = response.results.filter(item => item.poster_path);
        
        // For TV shows, ensure they have the correct media_type property
        const formattedResults = mediaType === 'tvshow' 
          ? filteredResults.map(item => ({ ...item, media_type: 'tv' }))
          : filteredResults.map(item => ({ ...item, media_type: 'movie' }));
        
        setItems(formattedResults);
        
        // Limit total pages to 500 (TMDB's practical limit)
        const limitedTotalPages = Math.min(response.total_pages || 1, maxAllowedPages);
        setTotalPages(limitedTotalPages);
        
        setLoading(false);
      } catch (err) {
        setError(`Failed to load ${mediaType === 'tvshow' ? 'TV shows' : 'movies'}. Please try again later.`);
        setLoading(false);
      }
    };
    
    fetchFilteredItems();
  }, [category, region, sort, currentPage, isSearching, mediaType, discoverMovies, discoverTVShows]);
  
  // Handle search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (!isSearching || !searchQuery.trim()) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Enforce the maximum page limit
        const maxAllowedPages = 500;
        const effectivePage = Math.min(currentPage, maxAllowedPages);
        
        const response = await searchMovies(searchQuery, effectivePage);
        
        // Filter results based on mediaType
        let filteredResults = response.results.filter(item => item.poster_path);
        
        if (mediaType === 'tvshow') {
          filteredResults = filteredResults.filter(item => item.media_type === 'tv');
        } else {
          filteredResults = filteredResults.filter(item => item.media_type === 'movie');
        }
        
        setItems(filteredResults);
        
        // Limit total pages to 500 (TMDB's practical limit)
        const limitedTotalPages = Math.min(response.total_pages || 1, maxAllowedPages);
        setTotalPages(limitedTotalPages);
        
        setLoading(false);
      } catch (err) {
        setError('Search failed. Please try again.');
        setLoading(false);
      }
    };
    
    performSearch();
  }, [searchQuery, currentPage, isSearching, mediaType, searchMovies]);
  
  // Handle search submit
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    updateUrlParams({ page: 1, search: searchQuery });
    setCurrentPage(1);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateUrlParams({ page });
    window.scrollTo(0, 0);
  };
  
  // Clear search and return to filtered view
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    updateUrlParams({ page: 1, search: null });
    setCurrentPage(1);
  };
  
  // Update URL parameters without losing existing parameters
  const updateUrlParams = (updates) => {
    const params = new URLSearchParams(location.search);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
  
  // Set filters and navigate
  const setFilter = (type, value) => {
    updateUrlParams({ [type]: value, page: 1 });
    setCurrentPage(1);
  };
  
  // New function to handle clearing all filters at once
  const handleClearAllFilters = () => {
    // Update all filters to default values in URL
    updateUrlParams({
      category: 'all',
      region: 'all',
      sort: 'popularity',
      page: 1
    });
    // Reset page to 1
    setCurrentPage(1);
  };
  
  // Initialize search query from URL
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
      setIsSearching(true);
    }

    // window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {mediaType === 'tvshow' ? 'TV Shows Collection' : 'Movie Collection'}
        </h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search for ${mediaType === 'tvshow' ? 'TV shows' : 'movies'}...`}
              className="w-full bg-gray-800 text-white rounded-full py-3 px-5 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </button>
          </div>
        </form>
        
        {/* Active Search Badge */}
        {isSearching && (
          <div className="flex items-center mb-4 bg-blue-900/30 px-4 py-2 rounded-lg">
            <span className="mr-2">Searching for: <strong>{searchQuery}</strong></span>
            <button 
              onClick={clearSearch}
              className="ml-auto text-xs bg-blue-700 hover:bg-blue-800 px-2 py-1 rounded transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
        
        {/* Filters */}
        <FilterBar 
          category={category}
          region={region}
          sort={sort}
          onCategoryChange={(value) => setFilter('category', value)}
          onRegionChange={(value) => setFilter('region', value)}
          onSortChange={(value) => setFilter('sort', value)}
          onClearAll={handleClearAllFilters} // Pass the clear all handler
          disabled={isSearching}
        />
        
        {loading && <Loader />}
        
        {error && (
          <div className="flex items-center justify-center py-10 text-center">
            <AlertCircle className="text-red-500 mr-2" size={24} />
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <>
            <MovieGrid movies={items} />
            
            {/* No Results Message */}
            {items.length === 0 && (
              <div className="text-center py-16">
                <div className="mb-4">
                  <AlertCircle className="mx-auto text-yellow-500" size={48} />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  No {mediaType === 'tvshow' ? 'TV shows' : 'movies'} found
                </h2>
                <p className="text-gray-400">
                  {isSearching 
                    ? `We couldn't find any ${mediaType === 'tvshow' ? 'TV shows' : 'movies'} matching "${searchQuery}".` 
                    : `No ${mediaType === 'tvshow' ? 'TV shows' : 'movies'} match your selected filters.`}
                </p>
                {isSearching && (
                  <button 
                    onClick={clearSearch}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition-colors duration-300"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && items.length > 0 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;