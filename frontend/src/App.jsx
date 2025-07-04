import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy, useState, useEffect } from 'react'
import Navbar from './components/layouts/Nabar'
import Footer from './components/layouts/Footer'
import Loader from './components/ui/Loader'
import SearchModal from './components/ui/Searchbar'
import SideAd from "./components/ui/Horizontal";
import SideAd2 from "./components/ui/Horizontal2";
import SideAd3 from "./components/ui/Horizontal3";

// Lazy load pages for better performance
const HomePage = lazy(() => import('./components/pages/Homepage'))
const MoviePage = lazy(() => import('./components/pages/MoviePage'))
const TvShowPage = lazy(() => import('./components/pages/TvShowPage'))
const CollectionPage = lazy(() => import('./components/pages/CollectionPage'))
const SearchResultsPage = lazy(() => import('./components/pages/SearchResultsPage'))
const PrivacyPolicy = lazy(() => import('./components/pages/PrivacyPolicy'))
const Faq = lazy(() => import('./components/pages/Faq'))
const About = lazy(() => import('./components/pages/About'))
const Notfound = lazy(() => import('./components/pages/404'))

function App() {
  // Manage loading state directly in App
  const [isLoading, setIsLoading] = useState(true)
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Simulate loading or fetch data here
  useEffect(() => {
    // Example of a mock loading process
    const timer = setTimeout(() => {
      setIsLoading(false) // Once loading is done, set isLoading to false
    }, 2000) // Simulate loading for 2 seconds

    return () => clearTimeout(timer) // Cleanup the timer when component unmounts
  }, [])

  useEffect(() => {
    // Function to handle search button click from navbar
    const handleSearchButtonClick = (event) => {
      // Check if the clicked element is the search button or its child
      if (
        event.target.closest('[data-search-trigger]') || 
        event.target.hasAttribute('data-search-trigger')
      ) {
        setIsSearchOpen(true);
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // Add event listener to the document
    document.addEventListener('click', handleSearchButtonClick);

    return () => {
      document.removeEventListener('click', handleSearchButtonClick);
    };
  }, []);

  if (isLoading) {
    return <Loader /> // Show the loader while loading
  }

  return (
    <>
      <Navbar />
      <SideAd3 />
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      <main className="min-h-screen pt-16 bg-gray-900">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/tv/:id" element={<TvShowPage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/tvshow" element={<TvShowPage />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/faq" element={<Faq />} />
            
            <Route path="*" element={<Notfound />} />
          </Routes>
        </Suspense>
       <SideAd />
        <SideAd2 />
      </main>
      <Footer />
    </>
  )
}

export default App
