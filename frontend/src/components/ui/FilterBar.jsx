import { useState, useEffect, useRef } from 'react';
import { Filter, ChevronDown, X, ChevronRight } from 'lucide-react';

const FilterBar = ({ 
  category = 'all', 
  region = 'all', 
  sort = 'popularity',
  onCategoryChange,
  onRegionChange,
  onSortChange,
  onClearAll, // Add this new prop to handle clear all action
  disabled = false
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const filterRef = useRef(null);
  
  // Common genre IDs
  const genres = [
    { id: 'all', name: 'All Genres' },
    { id: '28', name: 'Action' },
    { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '18', name: 'Drama' },
    { id: '14', name: 'Fantasy' },
    { id: '27', name: 'Horror' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Sci-Fi' },
    { id: '53', name: 'Thriller' }
  ];
  
  // Region options
  const regionOptions = [
    { id: 'all', name: 'All Regions' },
    { id: 'us', name: 'Hollywood' },
    { id: 'in', name: 'Bollywood' },
    { id: 'kr', name: 'K-Drama' },
    { id: 'jp', name: 'Anime/Japan' }
  ];
  
  // Sort options
  const sortOptions = [
    { id: 'popularity', name: 'Popularity' },
    { id: 'rating', name: 'Rating' },
    { id: 'release_date', name: 'Release Date' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle window resize to reset mobile filters
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setIsFilterExpanded(true);
      } else {
        setIsFilterExpanded(false);
      }
    };

    // Set initial state based on window size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = (e, name) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Handle filter changes
  const handleCategoryChange = (id) => {
    if (onCategoryChange) {
      onCategoryChange(id);
    }
    setOpenDropdown(null);
  };

  const handleRegionChange = (id) => {
    if (onRegionChange) {
      onRegionChange(id);
    }
    setOpenDropdown(null);
  };

  const handleSortChange = (id) => {
    if (onSortChange) {
      onSortChange(id);
    }
    setOpenDropdown(null);
  };

  // Clear all filters - with visual feedback
  const clearAllFilters = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    // Use the onClearAll prop if provided (preferred approach)
    if (onClearAll) {
      onClearAll();
    } else {
      // Fallback to individual handlers if onClearAll is not provided
      if (onCategoryChange) onCategoryChange('all');
      if (onRegionChange) onRegionChange('all');
      if (onSortChange) onSortChange('popularity');
    }
    
    // Also close any open dropdowns
    setOpenDropdown(null);
  };

  // Toggle filter visibility for mobile
  const toggleFilterVisibility = () => {
    setIsFilterExpanded(!isFilterExpanded);
    // Close any open dropdowns when collapsing
    if (isFilterExpanded) {
      setOpenDropdown(null);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = category !== 'all' || region !== 'all';
  
  // Get active filter count
  const activeFilterCount = [
    category !== 'all',
    region !== 'all'
  ].filter(Boolean).length;
  
  return (
    <div className={`mb-8 w-full ${disabled ? 'opacity-70 pointer-events-none' : ''}`} ref={filterRef}>
      {/* Mobile Filter Toggle Button */}
      <div className="sm:hidden mb-3">
        <button 
          onClick={toggleFilterVisibility}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-2 px-3 flex items-center justify-between transition-colors"
          aria-expanded={isFilterExpanded}
          aria-controls="filter-panel"
        >
          <div className="flex items-center">
            <Filter size={18} className="mr-2" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <ChevronRight 
            size={20} 
            className={`transition-transform duration-300 ${isFilterExpanded ? 'rotate-90' : ''}`} 
          />
        </button>
      </div>
      
      {/* Filters Container - Animated for mobile */}
      <div 
        id="filter-panel"
        className={`
          transition-all duration-300 ease-in-out
          ${isFilterExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 sm:max-h-none sm:opacity-100'} 
        `}
      >
        <div className="flex flex-wrap gap-3 items-center">
          {/* Filter Icon */}
          <div className="hidden sm:flex items-center text-gray-400 mr-1">
            <Filter size={18} className="mr-2" />
            <span>Filters:</span>
          </div>
          
          {/* Category/Genre Filter */}
          <div className="relative">
            <button 
              onClick={(e) => toggleDropdown(e, 'category')}
              className={`bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-2 px-3 flex items-center justify-between min-w-[140px] transition-all ${
                openDropdown === 'category' ? 'ring-2 ring-blue-500' : ''
              } ${category !== 'all' ? 'border-l-4 border-blue-500' : ''}`}
              aria-expanded={openDropdown === 'category'}
              aria-haspopup="listbox"
            >
              <span className="truncate">{genres.find(g => g.id === category)?.name || 'All Genres'}</span>
              <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${openDropdown === 'category' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'category' && (
              <div className="absolute z-50 mt-1 bg-gray-800 rounded-lg shadow-lg overflow-y-auto min-w-[160px] w-full max-h-64 border border-gray-700" role="listbox">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => handleCategoryChange(genre.id)}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                      category === genre.id ? 'bg-gray-700 text-blue-400 font-semibold' : 'text-white'
                    }`}
                    role="option"
                    aria-selected={category === genre.id}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Region Filter */}
          <div className="relative">
            <button 
              onClick={(e) => toggleDropdown(e, 'region')}
              className={`bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-2 px-3 flex items-center justify-between min-w-[140px] transition-all ${
                openDropdown === 'region' ? 'ring-2 ring-blue-500' : ''
              } ${region !== 'all' ? 'border-l-4 border-blue-500' : ''}`}
              aria-expanded={openDropdown === 'region'}
              aria-haspopup="listbox"
            >
              <span className="truncate">{regionOptions.find(r => r.id === region)?.name || 'All Regions'}</span>
              <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${openDropdown === 'region' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'region' && (
              <div className="absolute z-50 mt-1 bg-gray-800 rounded-lg shadow-lg min-w-[160px] w-full border border-gray-700" role="listbox">
                {regionOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleRegionChange(option.id)}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                      region === option.id ? 'bg-gray-700 text-blue-400 font-semibold' : 'text-white'
                    }`}
                    role="option"
                    aria-selected={region === option.id}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Sort Filter */}
          <div className="relative">
            <button 
              onClick={(e) => toggleDropdown(e, 'sort')}
              className={`bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-2 px-3 flex items-center justify-between min-w-[140px] transition-all ${
                openDropdown === 'sort' ? 'ring-2 ring-blue-500' : ''
              }`}
              aria-expanded={openDropdown === 'sort'}
              aria-haspopup="listbox"
            >
              <span className="truncate">Sort: {sortOptions.find(s => s.id === sort)?.name || 'Popularity'}</span>
              <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'sort' && (
              <div className="absolute z-50 mt-1 bg-gray-800 rounded-lg shadow-lg min-w-[160px] w-full border border-gray-700" role="listbox">
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleSortChange(option.id)}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                      sort === option.id ? 'bg-gray-700 text-blue-400 font-semibold' : 'text-white'
                    }`}
                    role="option"
                    aria-selected={sort === option.id}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Clear All Button - Desktop Only */}
          {hasActiveFilters && (
            <div className="hidden sm:block ml-auto">
              <button 
                onClick={clearAllFilters}
                className="text-white hover:text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors duration-150"
                aria-label="Clear all filters"
              >
                <X size={16} className="mr-1" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Tags - Always visible when filters are active */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {category !== 'all' && (
            <div className="bg-blue-600 bg-opacity-30 text-blue-300 text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm">
              <span className="font-medium">{genres.find(g => g.id === category)?.name}</span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCategoryChange('all');
                }} 
                className="ml-2 hover:text-white transition-colors"
                aria-label={`Remove ${genres.find(g => g.id === category)?.name} filter`}
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          {region !== 'all' && (
            <div className="bg-blue-600 bg-opacity-30 text-blue-300 text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm">
              <span className="font-medium">{regionOptions.find(r => r.id === region)?.name}</span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRegionChange('all');
                }} 
                className="ml-2 hover:text-white transition-colors"
                aria-label={`Remove ${regionOptions.find(r => r.id === region)?.name} filter`}
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          {/* Clear All Button - Mobile & Tablet Only */}
          <div className="sm:hidden">
            <button 
              onClick={clearAllFilters}
              className="text-white hover:text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-colors duration-150"
              aria-label="Clear all filters"
            >
              <X size={14} className="mr-1" />
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;