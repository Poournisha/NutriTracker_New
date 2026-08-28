import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { AnalyzeFood } from './pages/AnalyzeFood';
import { MealHistory } from './pages/MealHistory';
import { WeeklyReports } from './pages/WeeklyReports';
import { Recommendations } from './pages/Recommendations';
import { Chatbot } from './pages/Chatbot';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {isAuthenticated && <Sidebar />}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/profile" replace /> : <Register />} />

            {/* User Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/analyze" element={<AnalyzeFood />} />
              <Route path="/history" element={<MealHistory />} />
              <Route path="/reports" element={<WeeklyReports />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/chatbot" element={<Chatbot />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
