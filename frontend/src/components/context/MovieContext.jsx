import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [bollywoodMovies, setBollywoodMovies] = useState([]);
  const [hollywoodMovies, setHollywoodMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [activeServer, setActiveServer] = useState('server1');
  
  // TMDB API configuration
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  
  // Create an axios instance for TMDB
  const tmdbAxios = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: TMDB_API_KEY,
      include_adult: false, // Add this line
    }
  });
  
  // Helper function to filter out WWE content
  const filterWWEContent = (items) => {
    return items.filter(item => {
      const title = item.title || item.name || '';
      const overview = item.overview || '';
      const adult = item.adult === true;
      
      // Check if title or overview contains WWE-related keywords
      const wweKeywords = ['wwe', 'wrestling', 'raw', 'smackdown', 'wrestlemania'];
      const adultKeywords = ['xxx', 'porn', 'adult', 'erotic', 'sex'];
      const lowerTitle = title.toLowerCase();
      const lowerOverview = overview.toLowerCase();
      
      // Return false (filter out) if it's marked as adult or contains adult keywords
      if (adult) return false;
      
      // Filter out WWE content and adult content based on keywords
      return !wweKeywords.some(keyword => 
        lowerTitle.includes(keyword) || 
        lowerOverview.includes(keyword)
      ) && !adultKeywords.some(keyword =>
        lowerTitle.includes(keyword) ||
        lowerOverview.includes(keyword)
      );
    });
  };
  
  const fetchTrending = useCallback(async () => {
    try {
      const response = await tmdbAxios.get('/trending/all/week');
      if (response.data && response.data.results) {
        // Filter out WWE content
        const filteredResults = filterWWEContent(response.data.results);
        setTrendingMovies(filteredResults);
      }
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      setError('Failed to fetch trending movies');
    }
  }, []);
  
  const fetchPopular = useCallback(async () => {
    try {
      const response = await tmdbAxios.get('/movie/popular');
      if (response.data && response.data.results) {
        // Filter out WWE content
        const filteredResults = filterWWEContent(response.data.results);
        setPopularMovies(filteredResults);
      }
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      setError('Failed to fetch popular movies');
    }
  }, []);
  
  
  const fetchHomePageMovies = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch Hollywood movies (English language)
      const hollywoodResponse = await tmdbAxios.get('/discover/movie', {
        params: {
          language: 'en-US',
          with_original_language: 'en',
          sort_by: 'popularity.desc',
          page: 1
        }
      });
      
      // Fetch Bollywood movies (Hindi language)
      const bollywoodResponse = await tmdbAxios.get('/discover/movie', {
        params: {
          with_original_language: 'hi',
          page: 1,
          include_adult: false
        }
      });
      
      // Safely access results and filter out WWE content
      const hollywoodResults = hollywoodResponse.data && hollywoodResponse.data.results 
        ? filterWWEContent(hollywoodResponse.data.results).slice(0, 20) 
        : [];
      
      const bollywoodResults = bollywoodResponse.data && bollywoodResponse.data.results 
        ? filterWWEContent(bollywoodResponse.data.results).slice(0, 30) 
        : [];
      
      setHollywoodMovies(hollywoodResults);
      setBollywoodMovies(bollywoodResults);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching homepage movies:', error);
      setError('Failed to fetch movies');
      setLoading(false);
    }
  }, []);
  
  // Get movie details
  const getMovieDetails = async (id, mediaType = 'movie') => {
    try {
      const response = await tmdbAxios.get(`/${mediaType}/${id}`, {
        params: {
          append_to_response: 'videos,credits,similar,recommendations'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${mediaType} details:`, error);
      throw new Error(`Failed to fetch ${mediaType} details`);
    }
  };
  
  // Get TV show season details with episodes
  const getTvShowSeasonDetails = async (tvShowId, seasonNumber) => {
    try {
      const response = await tmdbAxios.get(`/tv/${tvShowId}/season/${seasonNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show season details:', error);
      throw new Error('Failed to fetch TV show season details');
    }
  };
  
  // Search movies
  const searchMovies = async (query, page = 1) => {
    try {
      // Search for movies and TV shows
      const response = await tmdbAxios.get('/search/multi', {
        params: {
          query,
          page,
          include_adult: false
        }
      });
      
      // Filter out results without poster images, exclude people, and filter out WWE content
      const formattedResults = response.data.results 
        ? response.data.results
            .filter(item => 
              // Only include movies and TV shows with poster images
              (item.media_type === 'movie' || item.media_type === 'tv') && 
              item.poster_path
            )
        : [];
      
      // Filter out WWE content from search results
      const filteredResults = filterWWEContent(formattedResults);
      
      return {
        results: filteredResults,
        total_pages: response.data.total_pages || 0,
        total_results: filteredResults.length || 0,
        page: response.data.page || 1
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error('Failed to search movies and TV shows');
    }
  };
  
  // Discover movies (new function for better filtering)
  const discoverMovies = async (params = {}) => {
    try {
      const response = await tmdbAxios.get('/discover/movie', {
        params: {
          sort_by: 'popularity.desc',
          include_adult: false,
          include_video: false,
          page: 1,
          'vote_count.gte': 50,
          ...params
        }
      });
      
      // Filter out WWE content
      const filteredResults = filterWWEContent(response.data.results || []);
      
      return {
        results: filteredResults,
        total_pages: response.data.total_pages || 0,
        total_results: response.data.total_results || 0,
        page: response.data.page || 1
      };
    } catch (error) {
      console.error('Error discovering movies:', error);
      throw new Error('Failed to discover movies');
    }
  };
  
  // Get streaming URL
  const getStreamingUrl = (id, mediaType = 'movie', season = null, episode = null) => {
    setPlayerLoading(true);
    
    if (activeServer === 'server1') {
      // Server 1 (vidlink.pro)
      if (mediaType === 'movie') {
        return `https://player.vidsrc.co/embed/movie/${id}`;
      } else if (mediaType === 'tv' && season && episode) {
        return `https://player.vidsrc.co/embed/tv/${id}/${season}/${episode}`;
      }
    } else {
      // Server 2 (vidsrc.icu)
      if (mediaType === 'movie') {
        return `https://vidsrc.icu/embed/movie/${id}`;
      } else if (mediaType === 'tv' && season && episode) {
        return `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`;
      }
    }
    return null;
  };
  
  const switchServer = (server) => {
    setActiveServer(server);
  };
  // Handle iframe load completion
  const handlePlayerLoaded = () => {
    setPlayerLoading(false);
  };

  
  // Get movie videos (trailers, teasers)
  const getMovieVideos = async (id, mediaType = 'movie') => {
    try {
      const response = await tmdbAxios.get(`/${mediaType}/${id}/videos`);
      return response.data.results;
    } catch (error) {
      console.error(`Error fetching ${mediaType} videos:`, error);
      throw new Error(`Failed to fetch ${mediaType} videos`);
    }
  };
  
  // Get movie credits (cast and crew)
  const getMovieCredits = async (id, mediaType = 'movie') => {
    try {
      const response = await tmdbAxios.get(`/${mediaType}/${id}/credits`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${mediaType} credits:`, error);
      throw new Error(`Failed to fetch ${mediaType} credits`);
    }
  };
  
  // Get similar movies
  const getSimilarMovies = async (id, mediaType = 'movie') => {
    try {
      const response = await tmdbAxios.get(`/${mediaType}/${id}/similar`);
      // Filter out WWE content from similar movies
      const filteredResults = filterWWEContent(response.data.results || []);
      return filteredResults;
    } catch (error) {
      console.error(`Error fetching similar ${mediaType}:`, error);
      throw new Error(`Failed to fetch similar ${mediaType}`);
    }
  };
  
  // Get upcoming movies
  const getUpcomingMovies = async () => {
    try {
      const response = await tmdbAxios.get('/movie/upcoming');
      // Filter out WWE content from upcoming movies
      const filteredResults = filterWWEContent(response.data.results || []);
      return filteredResults;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw new Error('Failed to fetch upcoming movies');
    }
  };
  
  // Get movie genres
  const getGenres = async () => {
    try {
      const response = await tmdbAxios.get('/genre/movie/list');
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw new Error('Failed to fetch genres');
    }
  };
  
  const discoverTVShows = async (params = {}) => {
    try {
      const response = await tmdbAxios.get('/discover/tv', {
        params: {
          sort_by: 'popularity.desc',
          include_adult: false,
          page: 1,
          'vote_count.gte': 50,
          ...params
        }
      });
      
      // Filter out WWE content from TV shows
      const filteredResults = filterWWEContent(response.data.results || []);
      
      return {
        results: filteredResults,
        total_pages: response.data.total_pages || 0,
        total_results: response.data.total_results || 0,
        page: response.data.page || 1
      };
    } catch (error) {
      console.error('Error discovering TV shows:', error);
      throw new Error('Failed to discover TV shows');
    }
  };

  // Initialize data when context is loaded
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchTrending(),
          fetchPopular(),
          fetchHomePageMovies()
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing movie data:', error);
        setError('Failed to initialize movie data');
        setLoading(false);
      }
    };
    
    initialize();
  }, [fetchTrending, fetchPopular, fetchHomePageMovies]);
  
  // Make sure we have arrays before combining
  const combinedMovies = [...(bollywoodMovies || []), ...(hollywoodMovies || [])].slice(0, 50);
  
  return (
    <MovieContext.Provider
      value={{
        trendingMovies,
        popularMovies,
        bollywoodMovies,
        hollywoodMovies,
        allHomeMovies: combinedMovies,
        loading,
        playerLoading,
        error,
        getMovieDetails,
        getTvShowSeasonDetails,
        searchMovies,
        discoverMovies,
        getStreamingUrl,
        handlePlayerLoaded,
        fetchTrending,
        fetchPopular,
        getMovieVideos,
        getMovieCredits,
        getSimilarMovies,
        getUpcomingMovies,
        getGenres,
        discoverTVShows,
        activeServer,
        switchServer
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MovieContext;