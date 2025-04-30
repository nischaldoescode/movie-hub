// Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Film,
  Flame,
  TrendingUp,
  Tv,
  Clock,
  Search,
} from "lucide-react";
import SearchBar from "../ui/Searchbar";
import SearchModal from "../ui/Searchbar"; // Import the SearchModal component

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // New state for the modal
  const searchRef = useRef(null);

  // Navigation links with icons
  const navLinks = [
    { name: "Home", path: "/", icon: <Flame size={16} className="mr-2" /> },
    {
      name: "Movies",
      path: "/collection?mediaType=movie",
      icon: <Film size={16} className="mr-2" />,
    },
    {
      name: "TV Shows",
      path: "/collection?mediaType=tvshow",
      icon: <Tv size={16} className="mr-2" />,
    },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setModalOpen(false); // Close modal on route change
  }, [location.pathname]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search toggle based on device size
  const handleSearchClick = () => {
    // For mobile: open modal
    if (window.innerWidth < 768) {
      setModalOpen(true);
    } 
    // For desktop: toggle dropdown
    else {
      setSearchOpen(!searchOpen);
    }
  };

  // Determine if a nav link is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path.split("?")[0]);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled || mobileMenuOpen
            ? "bg-gray-900/95 backdrop-blur-sm shadow-lg"
            : "bg-gradient-to-b from-gray-900/90 to-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo with animation */}
            <Link
              to="/"
              className="flex items-center space-x-2 group"
              aria-label="Movie Hub Home"
            >
              <div className="relative">
                <Film
                  size={32}
                  className="text-blue-500 transition-transform duration-300 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-25 group-hover:opacity-75"
                  style={{ animationDuration: "3s" }}
                ></div>
              </div>
              <span className="text-xl font-bold text-white transition-all duration-300 group-hover:text-blue-400">
                MovieHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center text-lg font-medium relative transition-all duration-200 
                    hover:text-blue-400 hover:scale-105 ${
                    isActive(link.path)
                      ? "text-blue-400"
                      : "text-gray-300"
                  }`}
                >
                  {link.icon}
                  {link.name}
                  <span className="absolute left-0 right-0 bottom-[-8px] h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </Link>
              ))}
            </nav>

            {/* Right side items - Desktop */}
            <div className="hidden md:flex items-center">
              <div ref={searchRef} className="relative">
                <button
                  onClick={handleSearchClick}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    searchOpen
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                  aria-label="Search"
                  data-search-trigger
                >
                  <Search size={20} />
                </button>

                {searchOpen && (
                  <div className="absolute right-0 mt-2 w-80 origin-top-right transition-all duration-200 scale-100 opacity-100">
                    <SearchBar />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button and search */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={handleSearchClick} // Use the new handler
                className={`p-2 rounded-full transition-colors ${
                  searchOpen
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-full text-gray-300 hover:text-white transition-transform duration-300 ${
                  mobileMenuOpen ? "rotate-90" : ""
                }`}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu with animations */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-sm border-t border-gray-700">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md transition-all duration-300 transform ${
                    isActive(link.path)
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } animate-fade-in-down`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal - Will be shown for mobile devices */}
      <SearchModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;