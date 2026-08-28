import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Leaf, LogOut, User as UserIcon, Shield, Camera, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-gray-900 tracking-tight">NutriMeasure <span className="text-emerald-600">AI</span></span>
              <span className="block text-[10px] text-gray-400 font-medium -mt-1">Hostel Nutrition Intelligence</span>
            </div>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/analyze"
                className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition"
              >
                <Camera className="w-4 h-4" /> Analyze Meal
              </Link>
              
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-xl transition text-xs font-medium text-gray-700"
              >
                <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline font-semibold">{user?.name}</span>
              </Link>

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition"
                  title="Admin Dashboard"
                >
                  <Shield className="w-5 h-5" />
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-semibold text-gray-700 hover:text-emerald-600 px-3 py-2 transition">
                Sign In
              </Link>
              <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
