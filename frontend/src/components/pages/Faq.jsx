import React, { useState } from 'react';
import './styles.css';

const FAQ = () => {
  const [expandedSections, setExpandedSections] = useState({
    streaming: false,
    content: false,
    technical: false,
    dmca: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-100 bg-gray-900">
      <h1 className="text-3xl font-bold mb-2 text-center text-purple-400">Frequently Asked Questions</h1>
      <p className="text-center text-gray-400 mb-12">Get answers to the most common questions about Movie Hub</p>
      
      {/* Streaming Questions */}
      <div 
        className={`mb-6 p-5 border border-gray-700 rounded-lg transition-all duration-300 ${expandedSections.streaming ? 'bg-gray-800' : 'hover:bg-gray-800 cursor-pointer'}`}
        onClick={() => toggleSection('streaming')}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-purple-300">Streaming Options</h3>
          <span className="text-xl transform transition-transform duration-300 text-purple-400">
            {expandedSections.streaming ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.streaming && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            <div className="border-b border-gray-700 pb-4">
              <h4 className="font-medium mb-2">What streaming quality options are available?</h4>
              <p className="text-gray-300">
                Movie Hub offers streaming in multiple quality options depending on your internet connection speed.
                Our adaptive streaming technology automatically adjusts the quality to provide the best experience
                based on your current connection.
              </p>
            </div>
            
            <div className="border-b border-gray-700 pb-4">
              <h4 className="font-medium mb-2">How many devices can I stream on simultaneously?</h4>
              <p className="text-gray-300">
                Movie Hub allows streaming on multiple devices. Please note that excessive concurrent streams 
                from the same account may be limited to maintain service quality for all users.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Can I download content to watch offline?</h4>
              <p className="text-gray-300">
                Currently, our platform does not support downloading content for offline viewing as we serve as an
                aggregator of third-party content. All streaming is done online through our platform.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content Related */}
      <div 
        className={`mb-6 p-5 border border-gray-700 rounded-lg transition-all duration-300 ${expandedSections.content ? 'bg-gray-800' : 'hover:bg-gray-800 cursor-pointer'}`}
        onClick={() => toggleSection('content')}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-purple-300">Content Library</h3>
          <span className="text-xl transform transition-transform duration-300 text-purple-400">
            {expandedSections.content ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.content && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            <div className="border-b border-gray-700 pb-4">
              <h4 className="font-medium mb-2">How often is new content added?</h4>
              <p className="text-gray-300">
                As a platform that aggregates content from third-party providers, our library updates regularly
                based on what our partners make available. New content may appear on our platform as it becomes
                available through our third-party sources.
              </p>
            </div>
            
            <div className="border-b border-gray-700 pb-4">
              <h4 className="font-medium mb-2">Why was a title removed from Movie Hub?</h4>
              <p className="text-gray-300">
                Content availability changes due to agreements between content owners and our third-party providers.
                Movie Hub does not control when content is added or removed, as we do not own or host the videos 
                displayed on our platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Can I request specific movies or shows?</h4>
              <p className="text-gray-300">
                While we welcome content suggestions from our users, we cannot guarantee that specific 
                requests will be fulfilled as we do not directly license or host content. We will forward
                popular requests to our content partners for consideration.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Technical Issues */}
      <div 
        className={`mb-6 p-5 border border-gray-700 rounded-lg transition-all duration-300 ${expandedSections.technical ? 'bg-gray-800' : 'hover:bg-gray-800 cursor-pointer'}`}
        onClick={() => toggleSection('technical')}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-purple-300">Technical Support</h3>
          <span className="text-xl transform transition-transform duration-300 text-purple-400">
            {expandedSections.technical ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.technical && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            <div className="border-b border-gray-700 pb-4">
              <h4 className="font-medium mb-2">What can I do if videos buffer frequently?</h4>
              <p className="text-gray-300">
                Buffering issues are typically related to your internet connection. Try:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>Checking your internet speed (we recommend at least 5 Mbps for smooth streaming)</li>
                <li>Connecting via ethernet instead of Wi-Fi</li>
                <li>Closing other applications that may be using bandwidth</li>
                <li>Restarting your router or device</li>
              </ul>
            </div>
            
            <div className="border-b border-gray-700 pb-4">
              <h4 className="font-medium mb-2">Which devices support Movie Hub?</h4>
              <p className="text-gray-300">
                Movie Hub is available on most modern web browsers, smart TVs, gaming consoles (PlayStation, Xbox), 
                streaming devices (Roku, Apple TV, Chromecast), and mobile devices (iOS and Android).
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">How do I fix audio sync issues?</h4>
              <p className="text-gray-300">
                Audio sync problems can usually be resolved by:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>Refreshing the page or restarting the app</li>
                <li>Checking for app updates</li>
                <li>Trying a different browser or device</li>
                <li>Contacting our support team if the issue persists</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* DMCA & Legal */}
      <div 
        className={`mb-6 p-5 border border-gray-700 rounded-lg transition-all duration-300 ${expandedSections.dmca ? 'bg-gray-800' : 'hover:bg-gray-800 cursor-pointer'}`}
        onClick={() => toggleSection('dmca')}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-purple-300">DMCA & Legal</h3>
          <span className="text-xl transform transition-transform duration-300 text-purple-400">
            {expandedSections.dmca ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.dmca && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            <div className="border-b border-gray-700 pb-4">
              <h4 className="font-medium mb-2">How does Movie Hub handle copyright claims?</h4>
              <p className="text-gray-300">
                Movie Hub respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). 
                If you believe your copyrighted work has been improperly used on our platform, you can submit a DMCA takedown 
                notice through our Contact page.
              </p>
            </div>
            
            <div className="border-b border-gray-700 pb-4">
              <h4 className="font-medium mb-2">What information should a DMCA notice include?</h4>
              <p className="text-gray-300">
                A proper DMCA notice should include:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>Identification of the copyrighted work claimed to be infringed</li>
                <li>Identification of the material that is claimed to be infringing</li>
                <li>Your contact information</li>
                <li>A statement that you have a good faith belief that use is not authorized</li>
                <li>A statement that the information is accurate and, under penalty of perjury, you are authorized to act</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">How quickly does Movie Hub respond to takedown notices?</h4>
              <p className="text-gray-300">
                We aim to respond to all properly filed DMCA notices within 1-2 business days. If the claim is valid, 
                we will promptly remove or disable access to the content in question.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mt-12">
        <h3 className="font-medium mb-4 text-center text-purple-300">Still have questions?</h3>
        <p className="text-center text-gray-300 mb-4">
          Our support team is ready to help you with any other questions you might have.
        </p>
        <div className="flex justify-center">
          <p className="text-center">
            Contact us at: <a href="mailto:connect.moviehub@gmail.com" className="text-purple-400 hover:underline">support@moviehub.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;