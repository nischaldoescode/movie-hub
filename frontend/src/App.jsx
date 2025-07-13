import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy, useState, useEffect } from 'react'
import Navbar from './components/layouts/Nabar'
import Footer from './components/layouts/Footer'
import Loader from './components/ui/Loader'
import SearchModal from './components/ui/Searchbar'

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
  const [showDevicePopup, setShowDevicePopup] = useState(false);

  // Device detection function
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth < 768;
  };

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

  // Show popup on every visit if on mobile
  useEffect(() => {
    if (!isLoading && isMobileDevice()) {
      const timer = setTimeout(() => {
        setShowDevicePopup(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loader /> // Show the loader while loading
  }

  return (
    <>
      <Navbar />
  <div id="ezoic-pub-ad-placeholder-114"></div>
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      {/* Device Detection Popup */}
      {showDevicePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Better Viewing Experience</h2>
                <button
                  onClick={() => setShowDevicePopup(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-3">
                  📱 <strong>Mobile Device Detected</strong>
                </p>
                <p className="text-gray-600 mb-3">
                  For the best experience, please use a laptop/desktop with Microsoft Edge browser.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Chrome Browser Limitations:</strong>
                  </p>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Chrome's MutationObserver restrictions may affect functionality</li>
                    <li>• Cross-origin blocking can interfere with third-party services</li>
                    <li>• Some features may not work as expected</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>🛡️ Recommended:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Use Microsoft Edge browser for optimal performance</li>
                    <li>• Enable an ad blocker for better experience</li>
                    <li>• Switch to laptop/desktop for full functionality</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDevicePopup(false)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Continue Anyway
                </button>
                <button
                  onClick={() => setShowDevicePopup(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
          <div id="ezoic-pub-ad-placeholder-101"></div>
      </main>
      <Footer />
    </>
  )
}

export default App
