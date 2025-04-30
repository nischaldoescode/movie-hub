import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ExploreMoreButton = ({ to = '/collection', text = 'Explore More' }) => {
  return (
    <div className="w-full flex justify-center mt-8 mb-12 relative z-10">
      <Link
        to={to}
        className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full text-lg font-medium transition-all duration-300 flex items-center shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_25px_rgba(37,99,235,0.7)]"
      >
        {text}
        <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
        
        {/* Glowing effect */}
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 transform -skew-x-12 -translate-x-full animate-shimmer"></span>
      </Link>
    </div>
  );
};

export default ExploreMoreButton;