import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // State to detect mobile screens
  const [isMobile, setIsMobile] = useState(false);
  
  // Effect to detect mobile screens and window resizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Set initial value
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // TMDB API typically has a maximum of 500 pages
  const maxAllowedPages = 500;
  const effectiveTotalPages = Math.min(totalPages, maxAllowedPages);

  // Effect to handle URL navigation and ensure page is within valid range
  useEffect(() => {
    // If currentPage exceeds max allowed pages, set it to max
    if (currentPage > effectiveTotalPages) {
      onPageChange(effectiveTotalPages);
    }
    // If currentPage is less than 1, set it to 1
    else if (currentPage < 1) {
      onPageChange(1);
    }
  }, [currentPage, effectiveTotalPages, onPageChange]);
  
  // Handle next page click - no circular pagination
  const handleNextPage = () => {
    if (currentPage < effectiveTotalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  // Handle previous page click - no circular pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  // Dynamic page numbers based on current position
  const getPageNumbers = () => {
    const pages = [];
    
    if (isMobile) {
      // Mobile logic - always show current page and next page only
      // NEVER show page 1 here (it will be shown separately if needed)
      pages.push(currentPage);
      
      if (currentPage + 1 <= effectiveTotalPages) {
        pages.push(currentPage + 1);
      }
    } else {
      // Desktop behavior - show 5 pages centered around current page
      const maxVisiblePages = 5;
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(effectiveTotalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Page number button component
  const PageButton = ({ page, isActive, onClick }) => (
    <button
      onClick={() => onClick(page)}
      className={`relative inline-flex items-center px-2 sm:px-4 py-2 border ${
        isActive
          ? 'z-10 bg-blue-600 border-blue-500 text-white'
          : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {page}
    </button>
  );

  // Determine if we need to show ellipses and last page
  const showLastPageSection = getPageNumbers()[getPageNumbers().length - 1] < effectiveTotalPages;

  // Determine if we need to show first page and ellipses
  // For mobile: only when current page > 2
  // For desktop: when current page > 3
  const showFirstPageSection = isMobile
    ? currentPage > 2
    : currentPage > 3;

  return (
    <div className="flex justify-center mt-8 mb-4">
      <div className="flex flex-wrap justify-center items-center rounded-md shadow-sm">
        {/* Previous Page Button - disabled when on page 1 */}
        <button
          onClick={handlePreviousPage}
          disabled={currentPage <= 1}
          className={`relative inline-flex items-center rounded-l-md px-2 sm:px-3 py-2 border border-gray-700 bg-gray-800 
            ${currentPage <= 1 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-gray-400 hover:bg-gray-700'}`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className={isMobile ? "hidden" : "ml-1"}>Previous</span>
        </button>
        
        {/* First Page Section - only show on both mobile and desktop when not included in main pages */}
        {showFirstPageSection && (
          <>
            <PageButton page={1} isActive={currentPage === 1} onClick={onPageChange} />
            <span className="relative inline-flex items-center px-1 sm:px-2 py-2 border border-gray-700 bg-gray-800 text-gray-300">
              ...
            </span>
          </>
        )}
        
        {/* Dynamic Page Numbers */}
        {getPageNumbers().map(page => (
          <PageButton 
            key={page} 
            page={page} 
            isActive={currentPage === page} 
            onClick={onPageChange} 
          />
        ))}
        
        {/* Last Page Section */}
        {showLastPageSection && (
          <>
            <span className="relative inline-flex items-center px-1 sm:px-2 py-2 border border-gray-700 bg-gray-800 text-gray-300">
              ...
            </span>
            <PageButton 
              page={effectiveTotalPages} 
              isActive={currentPage === effectiveTotalPages} 
              onClick={onPageChange} 
            />
          </>
        )}
        
        {/* Next Page Button - disabled when on max page */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= effectiveTotalPages}
          className={`relative inline-flex items-center rounded-r-md px-2 sm:px-3 py-2 border border-gray-700 bg-gray-800 
            ${currentPage >= effectiveTotalPages 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-gray-400 hover:bg-gray-700'}`}
        >
          <span className={isMobile ? "hidden" : "mr-1"}>Next</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
