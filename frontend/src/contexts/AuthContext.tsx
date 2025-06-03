import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
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
  const [loading, setLoading] = useState(true);  // increase loading state to true initially

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          _id: payload.sub,  // check if your JWT payload has 'sub' or 'id'
          email: payload.email,
          name: payload.name || '',
          role: payload.role,
        });
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);  // mark loading as false after checking token
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    const loggedInUser: User = {
      _id: data.user.id || data.user._id,  // make sure to use the correct field
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
    };
    localStorage.setItem('token', data.access_token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error('Registration failed');
    const data = await res.json();
    const registeredUser: User = {
      _id: data.user.id || data.user._id,
      email,
      name,
      role: 'USER',
    };
    localStorage.setItem('token', data.access_token);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
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
