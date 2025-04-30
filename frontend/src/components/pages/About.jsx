import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Film,
} from "lucide-react";
import './styles.css';

const AboutUs = () => {
  useEffect(() => {
    // Animation for elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
      observer.observe(element);
    });
    
    return () => {
      fadeElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-100 bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-400 fade-in">About Movie Hub</h1>
      
      <div className="flex flex-col md:flex-row items-center mb-16 gap-8 justify-center">
        <div className="md:w-1/2 fade-in delay-400">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Your Gateway to Entertainment</h2>
          <p className="mb-4">
            Movie Hub started in 2025 with a simple mission: to bring quality entertainment to viewers around the world.
            We provide access to a vast library of movies and TV shows across different genres, from action and adventure to drama and documentaries.
          </p>
          <p className="mb-4">
            <strong>Important Notice:</strong> Movie Hub does not own or host any of the videos displayed on our platform. 
            All content is managed and provided by third-party sources. We are not responsible for the nature, content, 
            or availability of videos shown through our service.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md fade-in delay-200">
          <h3 className="text-xl font-semibold mb-3 text-purple-300">Diverse Content</h3>
          <p>Access a wide variety of titles across multiple genres, from classic films to recent releases provided by our third-party partners.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md fade-in delay-400">
          <h3 className="text-xl font-semibold mb-3 text-purple-300">Quality Viewing</h3>
          <p>Enjoy content with adaptive streaming that automatically adjusts to match your connection speed for a buffer-free experience.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md fade-in delay-600">
          <h3 className="text-xl font-semibold mb-3 text-purple-300">Multi-Device Access</h3>
          <p>Watch on your TV, computer, tablet, or smartphone—your experience syncs across all your devices for maximum convenience.</p>
        </div>
      </div>
      
      <div className="mb-16 fade-in">
        <h2 className="text-2xl font-semibold mb-6 text-center text-purple-300">Our Commitment</h2>
        <div className="bg-gray-800 p-8 rounded-lg shadow-md">
          <p className="mb-4">
            At Movie Hub, we're committed to providing a platform that connects users with entertainment content 
            in an accessible way. While we don't create or control the content available through our service, 
            we strive to:
          </p>
          <ul className="list-disc pl-8 space-y-2 mb-4">
            <li>Maintain a user-friendly interface that makes discovering content easy</li>
            <li>Ensure our platform is reliable and accessible across various devices</li>
            <li>Respond promptly to user feedback and technical issues</li>
            <li>Respect intellectual property rights and comply with DMCA regulations</li>
          </ul>
          <p>
            We aim to be transparent about our role as a platform that aggregates third-party content and 
            does not assume responsibility for the videos provided through our service.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center fade-in">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">Join Our Community</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Movie Hub aims to create a community of entertainment enthusiasts. 
          We're continuously improving our platform to deliver the best possible user experience 
          while providing access to a diverse range of content from our third-party providers.
        </p>
        <a 
          href="/" 
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
        >
          Start Watching Now
        </a>
      </div>
    </div>
  );
};

export default AboutUs;