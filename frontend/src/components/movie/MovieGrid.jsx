import { useState } from 'react';
import MovieCard from './MovieCard';
import ExploreMoreButton from '../ui/ExploreMoreButton';
import { Helmet, HelmetProvider } from "react-helmet-async";

const MovieGrid = ({ movies, title, showExploreMore = false, maxMovies = 50, explorePath = '/collection' }) => {
  // Calculate how many movies to display initially
  const displayMovies = movies?.slice(0, maxMovies) || [];
  
  // For empty state
  if (!movies || movies.length === 0) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-400">{title}</h2>
        <div className="mt-6 space-y-4">
          <p className="text-gray-500">No movies available at the moment.</p>
          <div className="max-w-2xl mx-auto text-sm text-gray-400 leading-relaxed">
            <p>We're constantly updating our collection with the latest releases and timeless classics. 
            Our platform aggregates content from various sources to provide you with comprehensive movie information, 
            ratings, and details about your favorite films.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
        <>

    <div className="py-6">
      <div id="container-d462e4cf49daea77f391535f1e045eb0"></div>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3 text-white">{title}</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-gray-300 text-sm">
                Discover {displayMovies.length} carefully curated titles from our extensive collection
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-500 backdrop-blur-sm">
              <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
                <p>
                  Our movie collection features comprehensive information sourced from multiple databases and platforms. 
                  Each title includes detailed metadata, ratings, cast information, and plot summaries to help you 
                  make informed viewing decisions.
                </p>
                <p>
                  We aggregate content from various entertainment sources to provide you with the most complete 
                  movie discovery experience. Our platform serves as a comprehensive guide for movie enthusiasts, 
                  featuring everything from blockbuster hits to indie gems.
                </p>
                <div className="pt-2 border-t border-gray-700 mt-3">
                  <p className="text-xs text-gray-400">
                    Content is regularly updated and synchronized with major entertainment databases for accuracy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div id="container-d462e4cf49daea77f391535f1e045eb0"></div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 relative">
        {displayMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
        
        {/* Show explore more button if needed */}
        {showExploreMore && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full w-full bg-gradient-to-b from-transparent via-transparent to-black/40" />
          </div>
        )}
      </div>
      
      {/* Additional Information Section */}
      <div className="mt-8 bg-gradient-to-r from-gray-800/40 to-gray-900/40 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">About Our Movie Database</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-300 mb-2">Content Aggregation</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Our platform combines information from multiple entertainment databases to provide comprehensive 
              movie details, including cast information, plot summaries, ratings, and technical specifications. 
              We continuously synchronize data to ensure accuracy and completeness.
            </p>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-300 mb-2">Discovery Features</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Advanced filtering and search capabilities help you discover new content based on genres, ratings, 
              release years, and cast members. Our recommendation system suggests titles based on viewing patterns 
              and user preferences to enhance your movie discovery experience.
            </p>
          </div>
        </div>
        
      </div>
      
      {/* Explore More Button */}
      {showExploreMore && movies.length > maxMovies && (
        <div className="mt-6">
          <ExploreMoreButton to={explorePath} />
        </div>
      )}
    </div>
        </>
  );
};

export default MovieGrid;
