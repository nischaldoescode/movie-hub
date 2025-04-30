import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";
import MovieGrid from "../movie/MovieGrid";
import Loader from "../ui/Loader";
import {
  Search,
  AlertCircle,
  Film,
  Tv,
  User,
  ArrowLeft,
  ArrowRight,
  X
} from "lucide-react";
import Pagination from "../ui/Pagination";

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchMovies } = useMovieContext();

  // Get query and page from URL
  const query = searchParams.get("query") || searchParams.get("q") || "";
  const pageParam = searchParams.get("page");

  // State management
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(
    pageParam ? parseInt(pageParam) : 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [mediaFilter, setMediaFilter] = useState(
    searchParams.get("filter") || "all"
  );
  
  // State for the search input on the page
  const [searchInput, setSearchInput] = useState(query);
  const [validationError, setValidationError] = useState("");

  // Fetch search results when query or page changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await searchMovies(query, currentPage);

        if (data.results.length === 0 && currentPage > 1) {
          // If we get no results but we're on a page > 1,
          // it means we've exceeded available pages, redirect to page 1
          setCurrentPage(1);
          setSearchParams({ query: query, filter: mediaFilter, page: 1 });
          return;
        }

        setResults(data.results);

        // FIX: Calculate actual total pages based on total results
        // Instead of blindly taking total_pages from API, ensure it makes sense
        const calculatedTotalPages = Math.ceil(data.total_results / 20); // Assuming 20 items per page
        const actualTotalPages =
          data.total_results > 0 ? Math.max(1, calculatedTotalPages) : 0;

        // Only use the minimum between our calculated value and what API returns
        setTotalPages(Math.min(actualTotalPages, data.total_pages));
        setTotalResults(data.total_results);
        setLoading(false);
      } catch (err) {
        setError("Failed to load search results. Please try again.");
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage, searchMovies, mediaFilter, setSearchParams]);

  // Update search input when query changes
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSearchParams({
        query: query,
        filter: mediaFilter,
        page: newPage.toString(),
      });
      window.scrollTo(0, 0);
    }
  };

 useEffect(() => {
    // This will run once when the component mounts/loads
    window.onbeforeunload = null;
    window.scrollTo(0, 0);
    return () => {
      // Clean up - ensure it's null when component unmounts
      window.onbeforeunload = null;
    };
  }, []);

  // Handle media type filter change
  const handleFilterChange = (filter) => {
    setMediaFilter(filter);
    setCurrentPage(1);
    setSearchParams({
      query: query,
      filter: filter,
      page: "1",
    });
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    // Clear validation error when user starts typing again
    if (validationError) {
      setValidationError("");
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    // Validate the search input
    if (!searchInput || searchInput.trim() === "") {
      setValidationError("Please enter a search term");
      return;
    }

    // Update search params and reset page to 1
    setCurrentPage(1);
    setSearchParams({
      query: searchInput.trim(),
      filter: mediaFilter,
      page: "1",
    });
  };

  // Clear search input
  const clearSearchInput = () => {
    setSearchInput("");
    setValidationError("");
  };

  // Apply media type filter to results
  const filteredResults = results.filter((item) => {
    if (mediaFilter === "all") return true;
    return item.media_type === mediaFilter;
  });

  // Calculate filtered total pages
  const filteredTotalPages =
    mediaFilter === "all"
      ? totalPages
      : Math.ceil(filteredResults.length / 20) || 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4 flex items-center mt-8">
            <Search className="mr-3 text-blue-400" size={28} />
            {query ? `Results for "${query}"` : "Search Movies & TV Shows"}
          </h1>

          {/* Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="mb-6 mt-4">
            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="Search movies & TV shows..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-xl py-3 pl-12 pr-12
                  focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                aria-label="Search movies and TV shows"
              />
              
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search size={20} className="text-blue-400" />
              </div>
              
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearchInput}
                  className="absolute inset-y-0 right-12 pr-2 flex items-center text-gray-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
              
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <div className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full text-white text-sm transition-colors">
                  Search
                </div>
              </button>
            </div>
            
            {/* Validation Error Message */}
            {validationError && (
              <p className="text-red-400 text-sm mt-2">{validationError}</p>
            )}
          </form>

          {!loading && !error && (
            <p className="text-gray-400">
              {totalResults > 0 ? (
                <>
                  Found {totalResults}{" "}
                  {totalResults === 1 ? "result" : "results"}
                </>
              ) : (
                query ? "No results found" : "Enter a search term above to find movies and TV shows"
              )}
            </p>
          )}
        </div>

        {/* Media Type Filter Tabs */}
        {!loading && !error && results.length > 0 && (
          <div className="mb-6 border-b border-gray-800">
            <div className="flex space-x-1">
              <FilterTab
                active={mediaFilter === "all"}
                onClick={() => handleFilterChange("all")}
                icon={<Search size={16} />}
                label="All"
                count={results.length}
              />
              <FilterTab
                active={mediaFilter === "movie"}
                onClick={() => handleFilterChange("movie")}
                icon={<Film size={16} />}
                label="Movies"
                count={
                  results.filter((item) => item.media_type === "movie").length
                }
              />
              <FilterTab
                active={mediaFilter === "tv"}
                onClick={() => handleFilterChange("tv")}
                icon={<Tv size={16} />}
                label="TV Shows"
                count={
                  results.filter((item) => item.media_type === "tv").length
                }
              />
              {/* <FilterTab 
                active={mediaFilter === 'person'}
                onClick={() => handleFilterChange('person')}
                icon={<User size={16} />}
                label="People"
                count={results.filter(item => item.media_type === 'person').length}
              /> */}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-64">
            <Loader />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 bg-red-900/20 rounded-xl">
            <AlertCircle className="mx-auto text-red-400 mb-4" size={40} />
            <p className="text-red-400 text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && (
          <>
            {filteredResults.length > 0 ? (
              <MovieGrid movies={filteredResults} />
            ) : (
              query ? (
                <div className="text-center py-16 bg-gray-800/30 rounded-xl">
                  <AlertCircle
                    className="mx-auto text-yellow-400 mb-4"
                    size={40}
                  />
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-gray-400 mb-4">
                    {mediaFilter !== "all"
                      ? `No ${
                          mediaFilter === "movie"
                            ? "movies"
                            : mediaFilter === "tv"
                            ? "TV shows"
                            : "people"
                        } found matching "${query}".`
                      : `We couldn't find anything matching "${query}". Try different keywords.`}
                  </p>
                  {mediaFilter !== "all" && (
                    <button
                      onClick={() => handleFilterChange("all")}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white"
                    >
                      Show All Results
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-800/30 rounded-xl">
                  <Search className="mx-auto text-gray-500 mb-4" size={48} />
                  <h3 className="text-xl font-semibold mb-2">Search for movies and TV shows</h3>
                  <p className="text-gray-400">
                    Enter a search term in the search bar above to find movies and TV shows.
                  </p>
                </div>
              )
            )}

            {/* Pagination - Use the Pagination component when applicable */}
            {filteredTotalPages > 1 && filteredResults.length > 0 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={filteredTotalPages}
                onPageChange={handlePageChange}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

// Helper component for filter tabs
const FilterTab = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-1 px-4 py-3 border-b-2 ${
      active
        ? "border-blue-500 text-blue-400"
        : "border-transparent text-gray-400 hover:text-gray-200"
    }`}
  >
    <span className="flex items-center">
      {icon}
      <span className="ml-1">{label}</span>
    </span>
    {count > 0 && (
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          active ? "bg-blue-500/20 text-blue-300" : "bg-gray-700 text-gray-300"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

export default SearchResultsPage;
