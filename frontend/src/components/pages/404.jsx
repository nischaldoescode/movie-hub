import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Oops! Page Not Found</title>
        <meta
          name="description"
          content="Oops! Seems you got lost, the page you are looking for does not exist."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-900 p-9">
        <img src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-1932.jpg" alt="Not Found" className="w-[32rem] h-[28rem] md:w-[32rem] md:h-[28rem] mb-8 mt-10 object-fill" />
        <h1 className="text-4xl font-bold mb-4 text-white">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-300 mb-8 max-w-lg">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Go Back Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300"
          >
            Previous Page
          </button>
        </div>
      </div>
    </>
  );
};

export default Notfound;