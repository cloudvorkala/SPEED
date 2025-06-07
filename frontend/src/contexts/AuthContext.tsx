import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_ENDPOINTS } from '../config/api';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
  isModerator: boolean;
  isAnalyst: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        console.log('Parsed user data from localStorage:', userData);
        const validatedUser: User = {
          _id: userData._id || userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          isAdmin: userData.isAdmin || userData.role === 'ADMIN',
          isModerator: userData.isModerator || userData.role === 'MODERATOR',
          isAnalyst: userData.isAnalyst || userData.role === 'ANALYST',
        };
        console.log('Validated user:', validatedUser);
        setUser(validatedUser);
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    console.log('Login response data:', data);
    const loggedInUser: User = {
      _id: data.user.id || data.user._id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
      isAdmin: data.user.isAdmin || data.user.role === 'ADMIN',
      isModerator: data.user.isModerator || data.user.role === 'MODERATOR',
      isAnalyst: data.user.isAnalyst || data.user.role === 'ANALYST',
    };
    console.log('Parsed logged in user:', loggedInUser);
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_ENDPOINTS.AUTH}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error('Registration failed');
    const data = await res.json();
    console.log('Register response data:', data);
    const registeredUser: User = {
      _id: data.user.id || data.user._id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
      isAdmin: data.user.isAdmin || data.user.role === 'ADMIN',
      isModerator: data.user.isModerator || data.user.role === 'MODERATOR',
      isAnalyst: data.user.isAnalyst || data.user.role === 'ANALYST',
    };
    console.log('Parsed registered user:', registeredUser);
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(registeredUser));
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
