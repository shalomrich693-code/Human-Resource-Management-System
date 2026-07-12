import React from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserCircle, FaSignOutAlt, FaBell } from 'react-icons/fa';
import '../dashboard/AdminSidebar.css'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="navbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="navbar-content">
        <div className="navbar-left">
          <motion.div 
            className="navbar-user"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <FaUserCircle className="user-icon" />
            <div className="user-info">
              <span className="welcome-text">Welcome back,</span>
              <span className="user-name">{user?.name}</span>
            </div>
          </motion.div>
        </div>

        <div className="navbar-right">
          <motion.button 
            className="notification-btn"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaBell />
            <span className="notification-badge">2</span>
          </motion.button>

          <motion.button 
            className="logout-btn"
            onClick={handleLogout}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;