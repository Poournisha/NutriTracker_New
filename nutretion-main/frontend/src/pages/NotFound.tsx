import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 text-center space-y-4">
      <h1 className="text-6xl font-extrabold text-emerald-600">404</h1>
      <h2 className="text-xl font-bold text-gray-900">Page Not Found</h2>
      <p className="text-xs text-gray-500 max-w-sm">
        The requested page does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center gap-2"
      >
        <Home className="w-4 h-4" /> Back to Dashboard
      </Link>
    </div>
  );
};
