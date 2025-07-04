import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {
  Film,
} from "lucide-react";
import './styles.css';
import HorizontalAd from "../ui/Horizontal";
import SideAd2 from "./components/ui/Horizontal2";
import SideAd3 from "./components/ui/Horizontal3";
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
    <>
      <HelmetProvider>
        <title>About Movie Den - Your Gateway to Entertainment | HD Movies & TV Shows</title>
        <meta name="description" content="Learn about Movie Den, your ultimate entertainment destination. Discover our mission to provide access to quality movies and TV shows from third-party sources. Join our community of entertainment enthusiasts." />
        <meta name="keywords" content="about Movie Den, movie streaming platform, entertainment destination, movie community, TV shows, HD movies, streaming service, movie platform, about us, Movie Den story, entertainment portal, online movies, free streaming, movie aggregator" />
        <meta name="author" content="Movie Den" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="language" content="en" />
        <meta name="revisit-after" content="1 day" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="copyright" content="Movie Den" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-navbutton-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#1f2937" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://movieden.space/about" />
        
        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Movie Den - Your Gateway to Entertainment | HD Movies & TV Shows" />
        <meta property="og:description" content="Learn about Movie Den, your ultimate entertainment destination. Discover our mission to provide access to quality movies and TV shows from third-party sources." />
        <meta property="og:url" content="https://movieden.space/about" />
        <meta property="og:site_name" content="Movie Den" />
        <meta property="og:image" content="https://res.cloudinary.com/dd7yplbta/image/upload/v1751558020/image_1_r7k55v.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Movie Den - About Us" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Movie Den - Your Gateway to Entertainment | HD Movies & TV Shows" />
        <meta name="twitter:description" content="Learn about Movie Den, your ultimate entertainment destination. Discover our mission to provide access to quality movies and TV shows from third-party sources." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dd7yplbta/image/upload/v1751558020/image_1_r7k55v.png" />
        <meta name="twitter:image:alt" content="Movie Den - About Us" />
        
        {/* Additional SEO Tags */}
        <meta name="application-name" content="Movie Den" />
        <meta name="msapplication-TileImage" content="https://res.cloudinary.com/dd7yplbta/image/upload/v1751558020/image_1_r7k55v.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Movie Den" />
        <meta name="theme-color" content="#1f2937" />
        
        {/* Additional Meta Tags for Movie Site */}
        <meta name="category" content="Entertainment" />
        <meta name="coverage" content="Worldwide" />
        <meta name="identifier-URL" content="https://movieden.space/about" />
        <meta name="owner" content="Movie Den" />
        <meta name="url" content="https://movieden.space/about" />
        <meta name="directory" content="submission" />
        <meta name="pagename" content="About Movie Den - Your Gateway to Entertainment" />
        <meta name="subtitle" content="Learn About Our Entertainment Platform" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="audience" content="all" />
        <meta name="googlebot" content="index,follow" />
        <meta name="bingbot" content="index,follow" />
        <meta name="google-adsense-account" content="ca-pub-8779876482236769" />
          
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//tmbd.org" />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-QKRDMZMXVJ"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QKRDMZMXVJ');
        `}
      </script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8779876482236769"
     crossorigin="anonymous"></script>
      </HelmetProvider>

     <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-100 bg-gray-900">
       <SideAd2 />
       <SideAd3 />
        <h1 className="text-4xl font-bold mb-8 text-center text-purple-400 fade-in">About Movie Den</h1>
        
        <div className="flex flex-col md:flex-row items-center mb-16 gap-8 justify-center">
          <div className="md:w-1/2 fade-in delay-400">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">Your Gateway to Entertainment</h2>
            <p className="mb-4">
              Movie Den started in 2025 with a simple mission: to bring quality entertainment to viewers around the world.
              We provide access to a vast library of movies and TV shows across different genres, from action and adventure to drama and documentaries.
            </p>
            <p className="mb-4">
              <strong>Important Notice:</strong> Movie Den does not own or host any of the videos displayed on our platform. 
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
              At Movie Den, we're committed to providing a platform that connects users with entertainment content 
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
            Movie Den aims to create a community of entertainment enthusiasts. 
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
       <HorizontalAd />
      </div>
    </>
  );
};

export default AboutUs;
