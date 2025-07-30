import { useState, useEffect } from "react";
import { useMovieContext } from "../context/MovieContext";
import MovieCarousel from "../movie/MovieCarousel";
import MovieGrid from "../movie/MovieGrid";
import FilterBar from "../ui/FilterBar";
import Loader from "../ui/Loader";
import { Helmet, HelmetProvider } from "react-helmet-async";

const HomePage = () => {
  const context = useMovieContext();

  // State for filters
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("popularity");

  // If context is undefined, the provider is missing
  if (!context) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Context Error</h2>
        <p className="text-red-500">
          MovieContext Provider is missing. Make sure your app is wrapped with
          MovieProvider.
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
    error,
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
    setCategory("all");
    setRegion("all");
    setSort("popularity");
  };

  // Filter movies based on selected filters
  const getFilteredMovies = () => {
    let filteredMovies = [...allHomeMovies];

    // Filter by category/genre
    if (category !== "all") {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.genre_ids && movie.genre_ids.includes(Number(category))
      );
    }

    // Filter by region
    if (region !== "all") {
      if (region === "us") {
        filteredMovies = filteredMovies.filter(
          (movie) => movie.original_language === "en"
        );
      } else if (region === "in") {
        filteredMovies = filteredMovies.filter(
          (movie) => movie.original_language === "hi"
        );
      } else if (region === "kr") {
        filteredMovies = filteredMovies.filter(
          (movie) => movie.original_language === "ko"
        );
      } else if (region === "jp") {
        filteredMovies = filteredMovies.filter(
          (movie) => movie.original_language === "ja"
        );
      }
    }

    // Sort movies
    if (sort === "popularity") {
      filteredMovies.sort((a, b) => b.popularity - a.popularity);
    } else if (sort === "rating") {
      filteredMovies.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sort === "release_date") {
      filteredMovies.sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date)
      );
    }

    return filteredMovies;
  };

  const filteredMovies = getFilteredMovies();

  return (
    <>
      <HelmetProvider>
        <Helmet>
        {/* Basic Meta Tags */}
        <title>
          MovieDen - Watch Movies Online Free | HD Movies & TV Shows
        </title>
        <meta
          name="description"
          content="Watch latest movies and TV shows online for free in HD quality. Stream Hollywood, Bollywood, and international films. No registration required. MovieDen - Your ultimate entertainment destination."
        />
        <meta
          name="keywords"
          content="watch movies online, free movies, HD movies, streaming, TV shows, Hollywood movies, Bollywood movies, latest movies, online cinema, movie streaming, free streaming, watch online, entertainment, films, series, episodes, MovieDen, Movie Den, Movie-Den, Movie Den, Movie Den, movie-watch, stream movie, stream movie free, watch movie for free, stream movie for free,"
        />
        <meta name="author" content="MovieDen" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="language" content="en" />
        <meta name="revisit-after" content="1 day" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="copyright" content="MovieDen" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-navbutton-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#1f2937" />
          
        {/* Canonical URL */}
        <link rel="canonical" href="https://movieDen.space" />

        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="MovieDen - Watch Movies Online Free | HD Movies & TV Shows"
        />
        <meta
          property="og:description"
          content="Watch latest movies and TV shows online for free in HD quality. Stream Hollywood, Bollywood, and international films. No registration required."
        />
        <meta property="og:url" content="https://movieDen.space" />
        <meta property="og:site_name" content="MovieDen" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dd7yplbta/image/upload/v1751558020/image_1_r7k55v.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="MovieDen - Watch Movies Online Free"
        />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="MovieDen - Watch Movies Online Free | HD Movies & TV Shows"
        />
        <meta
          name="twitter:description"
          content="Watch latest movies and TV shows online for free in HD quality. Stream Hollywood, Bollywood, and international films. No registration required."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dd7yplbta/image/upload/v1751558020/image_1_r7k55v.png"
        />
        <meta
          name="twitter:image:alt"
          content="MovieDen - Watch Movies Online Free"
        />
        <meta name="twitter:site" content="@MovieDen" />
        <meta name="twitter:creator" content="@MovieDen" />

        {/* Additional SEO Tags */}
        <meta name="application-name" content="MovieDen" />
        <meta
          name="msapplication-TileImage"
          content="https://res.cloudinary.com/dd7yplbta/image/upload/v1751558020/image_1_r7k55v.png"
        />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="MovieDen" />
        <meta name="theme-color" content="#1f2937" />

        {/* Additional Meta Tags for Movie Site */}
        <meta name="category" content="Entertainment" />
        <meta name="coverage" content="Worldwide" />
        <meta name="identifier-URL" content="https://movieden.space" />
        <meta name="owner" content="MovieDen" />
        <meta name="url" content="https://movieden.space" />
        <meta name="pagename" content="MovieDen - Watch Movies Online Free" />
        <meta name="subtitle" content="HD Movies & TV Shows Streaming" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="audience" content="all" />
        <meta name="googlebot" content="index,follow" />
        <meta name="bingbot" content="index,follow" />

        <meta
          name="google-site-verification"
          content="DT5o0TqvvaZKDfpG1b3-cYsN9r55LveNRXibwJ1YI9Y"
        />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//tmbd.org" />
          <link rel="dns-prefetch" href="//pl27291960.profitableratecpm.com" />
          <script type='text/javascript' src='//pl27291960.profitableratecpm.com/52/a3/f1/52a3f1cd263224425bfb07c95a7e98ee.js'></script>
          <script async="async" data-cfasync="false" src="//pl27292121.profitableratecpm.com/d462e4cf49daea77f391535f1e045eb0/invoke.js"></script>
          <script type="text/javascript">
          	atOptions = {
          		'key' : 'd1e54e44823315bf2810d13afe01a386',
          		'format' : 'iframe',
          		'height' : 300,
          		'width' : 160,
          		'params' : {}
          	};
      </script>
      <script type="text/javascript" src="//www.highperformanceformat.com/d1e54e44823315bf2810d13afe01a386/invoke.js"></script>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-QKRDMZMXVJ"
        ></script>
        <script>
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QKRDMZMXVJ');
        `}
        </script>

        </Helmet>
      </HelmetProvider>
      <div className="min-h-screen bg-gray-900 text-white px-6 xl:px-24">
        {/* Hero Carousel */}
        {trendingMovies && trendingMovies.length > 0 && (
          <MovieCarousel movies={trendingMovies} />
        )}

        <div id="container-d462e4cf49daea77f391535f1e045eb0"></div>
        
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
          <div id="container-d462e4cf49daea77f391535f1e045eb0"></div>
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
        
      <div id="container-d462e4cf49daea77f391535f1e045eb0"></div>
        
        {/* Hollywood Movies */}
        {hollywoodMovies && hollywoodMovies.length > 0 && (
          <MovieGrid
            title="Hollywood Movies"
            movies={hollywoodMovies}
            loading={loading}
          />
        )}
      </div>
    </>
  );
};

export default HomePage;
