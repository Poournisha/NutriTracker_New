import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, History, BarChart3, Sparkles, MessageSquare, User, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/analyze', label: 'Analyze Food', icon: <Camera className="w-4 h-4" /> },
    { to: '/history', label: 'Meal History', icon: <History className="w-4 h-4" /> },
    { to: '/reports', label: 'Weekly Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/recommendations', label: 'Recommendations', icon: <Sparkles className="w-4 h-4" /> },
    { to: '/chatbot', label: 'AI Nutrition Assistant', icon: <MessageSquare className="w-4 h-4" /> },
    { to: '/profile', label: 'Profile Settings', icon: <User className="w-4 h-4" /> },
  ];

  if (user?.role === 'ADMIN') {
    links.push({ to: '/admin', label: 'Admin Portal', icon: <Shield className="w-4 h-4" /> });
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] p-4 hidden md:block shrink-0">
      <div className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
