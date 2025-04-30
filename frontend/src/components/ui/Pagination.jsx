import { ArrowLeft, ArrowRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // TMDB API typically has a maximum of 500 pages
  const maxAllowedPages = 500;
  const effectiveTotalPages = Math.min(totalPages, maxAllowedPages);
  
  // Handle circular pagination when clicking next at max page
  const handleNextPage = () => {
    if (currentPage >= effectiveTotalPages) {
      // If at last page, go to page 1
      onPageChange(1);
    } else {
      onPageChange(currentPage + 1);
    }
  };
  
  // Handle circular pagination when clicking previous at page 1
  const handlePreviousPage = () => {
    if (currentPage <= 1) {
      // If at first page, go to last page
      onPageChange(effectiveTotalPages);
    } else {
      onPageChange(currentPage - 1);
    }
  };
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
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
    
    return pages;
  };

  // Page number button component
  const PageButton = ({ page, isActive, onClick }) => (
    <button
      onClick={() => onClick(page)}
      className={`relative inline-flex items-center px-4 py-2 border ${
        isActive
          ? 'z-10 bg-blue-600 border-blue-500 text-white'
          : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {page}
    </button>
  );

  return (
    <div className="flex justify-center mt-8 mb-4">
      <div className="flex items-center rounded-md shadow-sm">
        {/* Previous Page Button - never disabled for circular pagination */}
        <button
          onClick={handlePreviousPage}
          className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 border border-gray-700 bg-gray-800 hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Previous
        </button>
        
        {/* First Page (always show) */}
        {currentPage > 3 && (
          <>
            <PageButton page={1} isActive={currentPage === 1} onClick={onPageChange} />
            {currentPage > 4 && (
              <span className="relative inline-flex items-center px-2 py-2 border border-gray-700 bg-gray-800 text-gray-300">
                ...
              </span>
            )}
          </>
        )}
        
        {/* Page Numbers */}
        {getPageNumbers().map(page => (
          <PageButton 
            key={page} 
            page={page} 
            isActive={currentPage === page} 
            onClick={onPageChange} 
          />
        ))}
        
        {/* Last Page (always show if not in view) */}
        {currentPage < effectiveTotalPages - 2 && (
          <>
            {currentPage < effectiveTotalPages - 3 && (
              <span className="relative inline-flex items-center px-2 py-2 border border-gray-700 bg-gray-800 text-gray-300">
                ...
              </span>
            )}
            <PageButton 
              page={effectiveTotalPages} 
              isActive={currentPage === effectiveTotalPages} 
              onClick={onPageChange} 
            />
          </>
        )}
        
        {/* Next Page Button - never disabled for circular pagination */}
        <button
          onClick={handleNextPage}
          className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 border border-gray-700 bg-gray-800 hover:bg-gray-700"
        >
          Next
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
    </div>
  );
};

export default Pagination;