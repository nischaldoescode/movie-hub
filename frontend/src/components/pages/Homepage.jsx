import { useState, useEffect } from 'react';
import { useMovieContext } from '../context/MovieContext';
import MovieCarousel from '../movie/MovieCarousel';
import MovieGrid from '../movie/MovieGrid';
import FilterBar from '../ui/FilterBar';
import Loader from '../ui/Loader';

const HomePage = () => {
  const context = useMovieContext();
  
  // State for filters
  const [category, setCategory] = useState('all');
  const [region, setRegion] = useState('all');
  const [sort, setSort] = useState('popularity');
  
  // If context is undefined, the provider is missing
  if (!context) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Context Error</h2>
        <p className="text-red-500">
          MovieContext Provider is missing. Make sure your app is wrapped with MovieProvider.
        </p>
      </div>
    );
  }
  
  const {
    trendingMovies,
    bollywoodMovies,
    hollywoodMovies,
    allHomeMovies,
    loading,
    error
  } = context;
  
  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div className="container mx-auto px-8 text-center">
        <h2 className="text-xl font-bold mb-2">Error loading movies</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  // Filter handling functions
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };
  
  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
  };
  
  const handleSortChange = (newSort) => {
    setSort(newSort);
  };
  
  const handleClearAll = () => {
    setCategory('all');
    setRegion('all');
    setSort('popularity');
  };
  
  // Filter movies based on selected filters
  const getFilteredMovies = () => {
    let filteredMovies = [...allHomeMovies];
    
    // Filter by category/genre
    if (category !== 'all') {
      filteredMovies = filteredMovies.filter(movie => 
        movie.genre_ids && movie.genre_ids.includes(Number(category))
      );
    }
    
    // Filter by region
    if (region !== 'all') {
      if (region === 'us') {
        filteredMovies = filteredMovies.filter(movie => 
          movie.original_language === 'en'
        );
      } else if (region === 'in') {
        filteredMovies = filteredMovies.filter(movie => 
          movie.original_language === 'hi'
        );
      } else if (region === 'kr') {
        filteredMovies = filteredMovies.filter(movie => 
          movie.original_language === 'ko'
        );
      } else if (region === 'jp') {
        filteredMovies = filteredMovies.filter(movie => 
          movie.original_language === 'ja'
        );
      }
    }
    
    // Sort movies
    if (sort === 'popularity') {
      filteredMovies.sort((a, b) => b.popularity - a.popularity);
    } else if (sort === 'rating') {
      filteredMovies.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sort === 'release_date') {
      filteredMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    }
    
    return filteredMovies;
  };
  
  const filteredMovies = getFilteredMovies();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 xl:px-24">
      {/* Hero Carousel */}
      {trendingMovies && trendingMovies.length > 0 && (
        <MovieCarousel movies={trendingMovies} />
      )}
      
      <FilterBar 
        category={category}
        region={region}
        sort={sort}
        onCategoryChange={handleCategoryChange}
        onRegionChange={handleRegionChange}
        onSortChange={handleSortChange}
        onClearAll={handleClearAll}
        disabled={loading}
      />
      
      {/* All Movies */}
      <MovieGrid 
        title="All Movies" 
        movies={filteredMovies} 
        loading={loading} 
      />
      
      {/* Bollywood Movies */}
      {bollywoodMovies && bollywoodMovies.length > 0 && (
        <MovieGrid 
          title="Bollywood Movies" 
          movies={bollywoodMovies} 
          loading={loading}
        />
      )}
      
      {/* Hollywood Movies */}
      {hollywoodMovies && hollywoodMovies.length > 0 && (
        <MovieGrid 
          title="Hollywood Movies" 
          movies={hollywoodMovies} 
          loading={loading}
        />
      )}
    </div>
  );
};

export default HomePage;