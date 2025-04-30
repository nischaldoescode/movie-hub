import React from 'react';
import './styles.css';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-100 bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-purple-400">Movie Hub Privacy Policy</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Content Usage Terms</h2>
          <p className="mb-4">
            Movie Hub provides access to a variety of movies and TV shows for entertainment purposes. All content 
            available through our service is provided "as is" and may be subject to copyright protection.
          </p>
          <p className="mb-4">
            <strong>Please Note:</strong> We do not own, create, or host any of the content streamed through our platform. 
            All content is provided by various third-party sources, and we are not responsible for the nature, 
            content, or availability of videos shown through our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-purple-300">DMCA Compliance</h2>
          <p className="mb-4">
            Movie Hub respects intellectual property rights and responds to notices of alleged copyright infringement.
            If you believe that content available through our service infringes your copyright, please send a notification
            to our designated agent.
          </p>
          <p className="mb-4">
            We reserve the right to remove content that may infringe on intellectual property rights without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Streaming Quality and Limitations</h2>
          <p className="mb-4">
            The quality and availability of streaming content may vary based on your location, internet connection,
            device capabilities, and other factors. We do not guarantee uninterrupted or error-free service.
          </p>
          <p className="mb-4">
            Movie Hub may limit the number of concurrent streams from the same account to maintain service quality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-purple-300">User Responsibilities</h2>
          <p className="mb-4">
            By using Movie Hub, you agree not to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Record, download, or redistribute any content obtained through our service</li>
            <li>Attempt to bypass any technological measures used to protect the content</li>
            <li>Use VPNs or other technologies to misrepresent your location</li>
            <li>Share your account credentials with others</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Content Availability</h2>
          <p className="mb-4">
            The availability of movies and TV shows on Movie Hub may change over time due to licensing agreements 
            between content owners and our third-party providers. We do not guarantee specific content will remain 
            available indefinitely.
          </p>
          <p className="mb-4">
            As we do not own or control the content on our platform, we cannot be held responsible for the removal 
            or unavailability of any specific movies or TV shows.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Service Changes and Termination</h2>
          <p className="mb-4">
            We reserve the right to modify or discontinue Movie Hub, with or without notice. We may also restrict access 
            to some or all features to users at our discretion.
          </p>
          <p className="mb-4">
            Movie Hub may terminate or suspend access to our service immediately, without prior notice, for conduct 
            that we believe violates these terms or is harmful to other users or us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Third-Party Content Disclaimer</h2>
          <p className="mb-4">
            Movie Hub acts solely as an aggregator of third-party content. We do not review, censor, or edit the 
            content provided through our platform. We are not responsible for and do not endorse any opinions, 
            views, or content that may be found in videos accessible through our service.
          </p>
          <p className="mb-4">
            Any concerns regarding the content should be directed to the third-party provider responsible for 
            making such content available.
          </p>
        </section>

        <div className="mt-8 p-5 bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2 text-purple-300">Final Acknowledgment</h3>
          <p className="text-gray-300 mb-4">
            By continuing to use Movie Hub, you agree to the terms outlined above. These terms may be updated 
            from time to time without prior notice.
          </p>
          <p className="text-gray-300">
            If you have any questions about our privacy policy, please contact us at: 
            <a href="mailto:connect.moviehub@gmail.com" className="text-purple-300 ml-1 hover:underline">connect.moviehub@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;