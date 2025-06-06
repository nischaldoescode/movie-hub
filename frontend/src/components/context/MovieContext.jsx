import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

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
  const [activeServer, setActiveServer] = useState("server1");

  // TMDB API configuration
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";

  // Create an axios instance for TMDB
  const tmdbAxios = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: TMDB_API_KEY,
      include_adult: false, // Add this line
    },
  });

  // Helper function to filter out WWE content
  // Helper function to filter out WWE content - FIXED version
  const filterWWEContent = (items) => {
    return items.filter((item) => {
      const title = item.title || item.name || "";
      const overview = item.overview || "";
      const adult = item.adult === true;

      // Only check for these keywords in English content to avoid false positives with foreign films
      const isEnglishContent = item.original_language === "en";

      const wweKeywords = [
        "wwe",
        "wrestling",
        "raw",
        "smackdown",
        "wrestlemania",
        "ufc",
        "mixed martial arts",
        "cage fighting",
        "combat",
      ];
      const adultKeywords = ["xxx", "porn", "adult film", "erotic", "sex tape"];

      const lowerTitle = title.toLowerCase();
      const lowerOverview = overview.toLowerCase();

      // Filter out adult content regardless of language
      const containsAdultKeywords = adultKeywords.some(
        (keyword) =>
          lowerTitle.includes(keyword) || lowerOverview.includes(keyword)
      );

      // Only apply WWE filter to English content to prevent false positives with foreign films
      const containsWWEKeywords =
        isEnglishContent &&
        wweKeywords.some(
          (keyword) =>
            lowerTitle.includes(keyword) || lowerOverview.includes(keyword)
        );

      // Debug log for problematic cases
      if (
        !adult &&
        !containsAdultKeywords &&
        !containsWWEKeywords &&
        item.original_language !== "en" &&
        wweKeywords.some(
          (keyword) =>
            lowerTitle.includes(keyword) || lowerOverview.includes(keyword)
        )
      ) {
        console.log(
          "🔍 Preventing false positive filter on non-English content:",
          title,
          "Lang:",
          item.original_language
        );
      }

      // Filter out if adult, or contains forbidden keywords or garbage characters
      return (
        !adult &&
        !lowerTitle.includes("??") &&
        !lowerOverview.includes("??") &&
        !containsWWEKeywords &&
        !containsAdultKeywords
      );
    });
  };

  const fetchTrending = useCallback(async () => {
    try {
      const response = await tmdbAxios.get("/trending/all/week");
      if (response.data && response.data.results) {
        // Filter out WWE content
        const filteredResults = filterWWEContent(response.data.results);
        setTrendingMovies(filteredResults);
      }
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      setError("Failed to fetch trending movies");
    }
  }, []);

  const fetchPopular = useCallback(async () => {
    try {
      const response = await tmdbAxios.get("/movie/popular");
      if (response.data && response.data.results) {
        // Filter out WWE content
        const filteredResults = filterWWEContent(response.data.results);
        setPopularMovies(filteredResults);
      }
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      setError("Failed to fetch popular movies");
    }
  }, []);

  const fetchHomePageMovies = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch Hollywood movies (English language)
      const hollywoodResponse = await tmdbAxios.get("/discover/movie", {
        params: {
          language: "en-US",
          with_original_language: "en",
          sort_by: "popularity.desc",
          page: 1,
        },
      });

      // Fetch Bollywood movies (Hindi language)
      const bollywoodResponse = await tmdbAxios.get("/discover/movie", {
        params: {
          with_original_language: "hi",
          page: 1,
          include_adult: false,
        },
      });

      // Safely access results and filter out WWE content
      const hollywoodResults =
        hollywoodResponse.data && hollywoodResponse.data.results
          ? filterWWEContent(hollywoodResponse.data.results).slice(0, 20)
          : [];

      const bollywoodResults =
        bollywoodResponse.data && bollywoodResponse.data.results
          ? filterWWEContent(bollywoodResponse.data.results).slice(0, 30)
          : [];

      setHollywoodMovies(hollywoodResults);
      setBollywoodMovies(bollywoodResults);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching homepage movies:", error);
      setError("Failed to fetch movies");
      setLoading(false);
    }
  }, []);

  // Get movie details
  const getMovieDetails = async (id, mediaType = "movie") => {
    try {
      const response = await tmdbAxios.get(`/${mediaType}/${id}`, {
        params: {
          append_to_response: "videos,credits,similar,recommendations",
        },
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
      const response = await tmdbAxios.get(
        `/tv/${tvShowId}/season/${seasonNumber}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching TV show season details:", error);
      throw new Error("Failed to fetch TV show season details");
    }
  };

  // Search movies
  // Improved searchMovies function with better handling of non-English content
  const searchMovies = async (query, page = 1) => {
    try {
      // console.log("⭐ Searching for:", query);

      // First try multi search for the exact query
      const multiResponse = await tmdbAxios.get("/search/multi", {
        params: {
          query,
          page,
          include_adult: false,
        },
      });

      // Log raw API response for debugging
      // console.log("📊 Raw API response:", multiResponse.data);
      // console.log(
      //   "📊 Result count from API:",
      //   multiResponse.data.results?.length || 0
      // );

      // If no results from multi search and potentially a non-English title, try keyword search
      let formattedResults = multiResponse.data.results || [];
      // console.log(
      //   "📝 Initial results:",
      //   formattedResults.map((r) => r.title || r.name || "unknown")
      // );

      if (formattedResults.length === 0) {
        // console.log("🔍 No results from multi search, trying movie search");
        // Try searching movies directly (better for alternate titles)
        const movieResponse = await tmdbAxios.get("/search/movie", {
          params: {
            query,
            page,
            include_adult: false,
          },
        });

        // console.log(
        //   "📊 Movie search result count:",
        //   movieResponse.data.results?.length || 0
        // );

        // Add media_type to movie results since they don't have it by default
        formattedResults = (movieResponse.data.results || []).map((item) => ({
          ...item,
          media_type: "movie", // Add missing media_type for proper filtering
        }));
      }

      // console.log("📝 Before filtering:", formattedResults.length);

      // Log which items don't have poster_path
      const missingPosters = formattedResults.filter(
        (item) => !item.poster_path
      );
      if (missingPosters.length > 0) {
        // console.log(
        //   "🚨 Items missing poster_path:",
        //   missingPosters.map((i) => ({ title: i.title || i.name, id: i.id }))
        // );
      }

      // Filter results to keep only movies and TV shows
      // Keep more results by not filtering on poster_path for non-English content
      const validResults = formattedResults.filter((item) => {
        // Make the poster_path requirement more lenient for non-English content
        const isNonEnglishContent =
          item.original_language && item.original_language !== "en";
        const isPosterRequired = !isNonEnglishContent; // Only require posters for English content

        const isValid =
          (item.media_type === "movie" ||
            item.media_type === "tv" ||
            !item.media_type) &&
          (item.poster_path || !isPosterRequired);

        // If this would get filtered, log it
        // if (!isValid) {
        //   console.log(
        //     "❌ Filtering out:",
        //     item.title || item.name,
        //     "| media_type:",
        //     item.media_type || "none",
        //     "| has_poster:",
        //     !!item.poster_path,
        //     "| original_language:",
        //     item.original_language
        //   );
        // }

        return isValid;
      });

      // console.log(
      //   "📝 After media_type & poster filtering:",
      //   validResults.length
      // );

      // Filter out WWE content from search results
      const beforeWWE = validResults.length;
      const filteredResults = filterWWEContent(validResults);
      // console.log(
      //   "📝 After WWE filtering:",
      //   filteredResults.length,
      //   filteredResults.length < beforeWWE
      //     ? `(Removed ${beforeWWE - filteredResults.length} WWE results)`
      //     : ""
      // );

      return {
        results: filteredResults,
        total_pages: multiResponse.data.total_pages || 0,
        total_results: filteredResults.length || 0,
        page: multiResponse.data.page || 1,
      };
    } catch (error) {
      // console.error("🚨 Error searching movies:", error);
      throw new Error("Failed to search movies and TV shows");
    }
  };

  // Discover movies (new function for better filtering)
  const discoverMovies = async (params = {}) => {
    try {
      const response = await tmdbAxios.get("/discover/movie", {
        params: {
          sort_by: "popularity.desc",
          include_adult: false,
          include_video: false,
          page: 1,
          "vote_count.gte": 50,
          ...params,
        },
      });

      // Filter out WWE content
      const filteredResults = filterWWEContent(response.data.results || []);

      return {
        results: filteredResults,
        total_pages: response.data.total_pages || 0,
        total_results: response.data.total_results || 0,
        page: response.data.page || 1,
      };
    } catch (error) {
      console.error("Error discovering movies:", error);
      throw new Error("Failed to discover movies");
    }
  };

  // Get streaming URL
  const getStreamingUrl = (
    id,
    mediaType = "movie",
    season = null,
    episode = null
  ) => {
    setPlayerLoading(true);

    if (activeServer === "server1") {
      // Server 1 (vidlink.pro)
      if (mediaType === "movie") {
        // return `https://player.vidsrc.c/embed/movie/${id}`;
        return `https://player.embed-api.stream/?id=${id}&type=movie`;
      } else if (mediaType === "tv" && season && episode) {
        // return `https://player.vidsrc.co/embed/tv/${id}/${season}/${episode}`;
        // https://player.embed-api.stream/?id={tmdbId}&s={season}&e={episode}
        return `https://player.vidsrc.co/?id=${id}&s=${season}&e=${episode}`;
      }
    } else {
      // Server 2 (vidsrc.icu)
      if (mediaType === "movie") {
        return `https://vidsrc.icu/embed/movie/${id}`;
      } else if (mediaType === "tv" && season && episode) {
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
  const getMovieVideos = async (id, mediaType = "movie") => {
    try {
      const response = await tmdbAxios.get(`/${mediaType}/${id}/videos`);
      return response.data.results;
    } catch (error) {
      console.error(`Error fetching ${mediaType} videos:`, error);
      throw new Error(`Failed to fetch ${mediaType} videos`);
    }
  };

  // Get movie credits (cast and crew)
  const getMovieCredits = async (id, mediaType = "movie") => {
    try {
      const response = await tmdbAxios.get(`/${mediaType}/${id}/credits`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${mediaType} credits:`, error);
      throw new Error(`Failed to fetch ${mediaType} credits`);
    }
  };

  // Get similar movies
  const getSimilarMovies = async (id, mediaType = "movie") => {
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
      const response = await tmdbAxios.get("/movie/upcoming");
      // Filter out WWE content from upcoming movies
      const filteredResults = filterWWEContent(response.data.results || []);
      return filteredResults;
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      throw new Error("Failed to fetch upcoming movies");
    }
  };

  // Get movie genres
  const getGenres = async () => {
    try {
      const response = await tmdbAxios.get("/genre/movie/list");
      return response.data.genres;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw new Error("Failed to fetch genres");
    }
  };

  const discoverTVShows = async (params = {}) => {
    try {
      const response = await tmdbAxios.get("/discover/tv", {
        params: {
          sort_by: "popularity.desc",
          include_adult: false,
          page: 1,
          "vote_count.gte": 50,
          ...params,
        },
      });

      // Filter out WWE content from TV shows
      const filteredResults = filterWWEContent(response.data.results || []);

      return {
        results: filteredResults,
        total_pages: response.data.total_pages || 0,
        total_results: response.data.total_results || 0,
        page: response.data.page || 1,
      };
    } catch (error) {
      console.error("Error discovering TV shows:", error);
      throw new Error("Failed to discover TV shows");
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
          fetchHomePageMovies(),
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing movie data:", error);
        setError("Failed to initialize movie data");
        setLoading(false);
      }
    };

    initialize();
  }, [fetchTrending, fetchPopular, fetchHomePageMovies]);

  // Make sure we have arrays before combining
  const combinedMovies = [
    ...(bollywoodMovies || []),
    ...(hollywoodMovies || []),
  ].slice(0, 50);

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
        switchServer,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MovieContext;
