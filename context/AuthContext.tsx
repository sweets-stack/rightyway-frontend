import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { API_BASE_URL } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('authUser', null);
  const [loading, setLoading] = useState(true);

  // Verify token on app start
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('${API_BASE_URL}/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });


        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // Backend returned HTML instead of JSON - endpoint doesn't exist
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
          return;
        }

        if (response.ok) {
          const data = await response.json();
          // Token is valid, user remains logged in
        } else {
          // Token is invalid, log out
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [setUser]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
