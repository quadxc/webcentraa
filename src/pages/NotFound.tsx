import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-950 px-4 text-center">
      <div className="rounded-full bg-dark-800 p-6">
        <AlertTriangle className="h-16 w-16 text-warning-500" />
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-2 text-xl">Page Not Found</p>
      <p className="mt-4 text-gray-400">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary mt-8">
        <Home className="mr-2 h-5 w-5" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;