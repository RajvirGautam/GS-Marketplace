import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(Cookies.get('accessToken') || null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  // Axios instance with auth header
  const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add token to requests
  authAxios.interceptors.request.use((config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle token refresh on 401
  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = Cookies.get('refreshToken');
          if (!refreshToken) throw new Error('No refresh token');

          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          
          Cookies.set('accessToken', data.accessToken, { expires: 7 });
          setAccessToken(data.accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return authAxios(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // Fetch current user
  const fetchUser = async () => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await authAxios.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, userData);
      
      // Save tokens
      Cookies.set('accessToken', data.accessToken, { expires: 7 });
      Cookies.set('refreshToken', data.refreshToken, { expires: 30 });
      setAccessToken(data.accessToken);
      setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      // Save tokens
      Cookies.set('accessToken', data.accessToken, { expires: 7 });
      Cookies.set('refreshToken', data.refreshToken, { expires: 30 });
      setAccessToken(data.accessToken);
      setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authAxios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setAccessToken(null);
      setUser(null);
    }
  };

  // Google OAuth
  const loginWithGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  // Check auth on mount
  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    accessToken,
    register,
    login,
    logout,
    loginWithGoogle,
    authAxios,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};