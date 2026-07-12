import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await login({ email, password });
      
      if (result.success) {
        const role = result.data.user.role || 'employee';
        if (role === 'admin') {
          navigate('/admin-dashboard/');
        } else {
          navigate("/employee-dashboard");
        }
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Invalid credentials. Please check your email and password.');
        } else if (error.response.status === 404) {
          setErrorMessage('User not found. Please check your email.');
        } else if (error.response.status === 400) {
          setErrorMessage(error.response.data.error || 'Please provide both email and password.');
        } else {
          setErrorMessage('Login failed. Please try again.');
        }
      } else {
        setErrorMessage('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-left-panel">
        <motion.div 
          className="login-brand"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1>Next-Gen HRMS</h1>
          <p>
            Streamline your human resource operations with our powerful, 
            intuitive, and beautiful management system. Built for modern teams.
          </p>
        </motion.div>
      </div>

      <div className="login-right-panel">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {errorMessage && (
              <motion.div 
                className="login-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaExclamationCircle />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-container">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-container">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <motion.button 
              type="submit" 
              className="login-btn"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </motion.button>
          </form>

          <div className="login-footer">
            &copy; 2026 ITSC HRMS. All rights reserved.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;