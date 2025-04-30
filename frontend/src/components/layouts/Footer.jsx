import { Link } from 'react-router-dom';
import { Film, Instagram, Twitter, Facebook, Github, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Footer links
  const footerLinks = {
    about: [
      { name: 'About Us', path: '/about' },
      { name: 'FAQ', path: '/faq' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacypolicy' },

    ],
    categories: [
      { name: 'Action', path: '/collection?category=action' },
      { name: 'Comedy', path: '/collection?category=comedy' },
      { name: 'Drama', path: '/collection?category=drama' },
      { name: 'Horror', path: '/collection?category=horror' },
      { name: 'Sci-Fi', path: '/collection?category=scifi' }
    ],
    regions: [
      { name: 'Hollywood', path: '/collection?region=us' },
      { name: 'Bollywood', path: '/collection?region=in' },
      { name: 'Korean', path: '/collection?region=kr' },
      { name: 'Japanese', path: '/collection?region=jp' }
    ]
  };
  
  
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Film size={32} className="text-blue-500" />
              <span className="text-xl font-bold text-white">MovieHub</span>
            </Link>
            <p className="text-sm mb-4">
              Discover and watch the latest movies and TV shows from around the world. 
              Your ultimate streaming companion.
            </p>
          </div>
          
          {/* About Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-blue-400 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-blue-400 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-blue-400 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/*  Regions */}
          <div>
            <h3 className="text-white font-semibold mb-4">Regions</h3>
            <ul className="space-y-2">
              {footerLinks.regions.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-blue-400 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            © {currentYear} MovieHub. All rights reserved.
          </p>
          <p className="text-sm flex items-center">
            Made with <Heart size={14} className="mx-1 text-red-500" /> by MovieHub Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;