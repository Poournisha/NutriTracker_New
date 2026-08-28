import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';
import { Leaf, UserPlus, Lock, Mail, User } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password });
      if (res.success && res.data.token) {
        login(res.data.token, res.data.user);
        navigate('/profile'); // Direct to profile setup first
      } else {
        setError(res.error?.message || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-emerald-200">
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-xs text-gray-500 mt-1">Start tracking your hostel nutrition with AI</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Student"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@hostel.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-emerald-100 transition flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
