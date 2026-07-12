import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshingToken, setRefreshingToken] = useState(false);

  // Create a queue for requests waiting for token refresh
  const refreshQueue = new Set();

  // Function to retry failed requests
  const retryWithNewToken = async (originalRequest) => {
    try {
      const response = await axios.request(originalRequest);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Add request interceptor to handle token refresh
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle token refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !refreshingToken) {
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            setRefreshingToken(true);
            
            // Get the new token from the response header
            const newToken = error.response.headers['x-refreshed-token'];
            if (newToken) {
              localStorage.setItem('token', newToken);
              setToken(newToken);
              
              // Retry the original request with the new token
              return retryWithNewToken(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Clear the old token if refresh fails
            localStorage.removeItem('token');
            setToken(null);
          } finally {
            setRefreshingToken(false);
          }
        }
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    // Check for token on mount and update axios defaults
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  // Update axios defaults whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      // Update the API endpoint to match your backend URL
      const response = await axios.post('http://localhost:3000/api/auth/login', credentials);
      
      const token = response.data.token;
      setUser(response.data.user);
      setToken(token);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login API Error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
export default AuthContext;
