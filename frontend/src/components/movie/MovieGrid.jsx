import { useState } from 'react';
import MovieCard from './MovieCard';
import ExploreMoreButton from '../ui/ExploreMoreButton';

const MovieGrid = ({ movies, title, showExploreMore = false, maxMovies = 50, explorePath = '/collection' }) => {
  // Calculate how many movies to display initially
  const displayMovies = movies?.slice(0, maxMovies) || [];
  
  // For empty state
  if (!movies || movies.length === 0) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-400">{title}</h2>
        <p className="mt-4 text-gray-500">No movies available at the moment.</p>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      {title && <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 relative">
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
      
      {/* Explore More Button */}
      {showExploreMore && movies.length > maxMovies && (
        <ExploreMoreButton to={explorePath} />
      )}
    </div>
  );
};

export default MovieGrid;