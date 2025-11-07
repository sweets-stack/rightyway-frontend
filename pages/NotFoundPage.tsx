
import React from 'react';
import { Link } from 'react-router-dom';
import Meta from '../components/seo/Meta';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Meta title="404 - Page Not Found" />
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="text-center p-8">
          <h1 className="text-9xl font-extrabold text-brand-maroon">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-brand-slate">Page Not Found</h2>
          <p className="mt-4 text-lg text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block bg-brand-maroon text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-gold transition-colors duration-300"
          >
            Go back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
