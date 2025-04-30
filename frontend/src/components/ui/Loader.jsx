// components/ui/Loader.jsx
const Loader = ({ size = 'default', fullScreen = false }) => {
  // Size variants
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    default: 'w-12 h-12 border-4',
    large: 'w-24 h-24 border-8'
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.default;
  
  // Create the spinner element
  const spinner = (
    <div 
      className={`${spinnerSize} border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}
      aria-label="Loading"
    ></div>
  );
  
  // If fullScreen, show in the middle of the screen
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50">
        {spinner}
      </div>
    );
  }
  
  // Default return for non-fullscreen - this was missing in your original code
  return (
    <div className="flex items-center justify-center p-4 centre">
      {spinner}
    </div>
  );
};

export default Loader;