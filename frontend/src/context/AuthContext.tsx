import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nutrimeasure_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('nutrimeasure_token');
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('nutrimeasure_user', JSON.stringify(res.data.user));
          }
        } catch {
          // Invalid token, clear state
          setToken(null);
          setUser(null);
          localStorage.removeItem('nutrimeasure_token');
          localStorage.removeItem('nutrimeasure_user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('nutrimeasure_token', newToken);
    localStorage.setItem('nutrimeasure_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('nutrimeasure_token');
      localStorage.removeItem('nutrimeasure_user');
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('nutrimeasure_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
