import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, FaUsers, FaBuilding, 
  FaCalendarAlt, FaMoneyBillWave, FaCogs,
  FaSignOutAlt, FaClock
} from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import { motion } from 'framer-motion';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1, 
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4
      }
    })
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-brand">
        <h3>ITSC HRMS</h3>
      </div>
      
      <div className="sidebar-menu">
        <div className="menu-category">Main Menu</div>
        
        <motion.div custom={0} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/admin-dashboard" end className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
        </motion.div>

        <motion.div custom={1} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/admin-dashboard/employees" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <FaUsers />
            <span>Employees</span>
          </NavLink>
        </motion.div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/admin-dashboard/departments" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <FaBuilding />
            <span>Departments</span>
          </NavLink>
        </motion.div>

        <div className="menu-category">Management</div>

        <motion.div custom={3} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/admin-dashboard/attendance" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <FaClock />
            <span>Attendance</span>
          </NavLink>
        </motion.div>

        <motion.div custom={4} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/admin-dashboard/leaves" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <FaCalendarAlt />
            <span>Leave Requests</span>
          </NavLink>
        </motion.div>

        <motion.div custom={5} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/admin-dashboard/salary" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <FaMoneyBillWave />
            <span>Payroll</span>
          </NavLink>
        </motion.div>

        <div className="menu-category">System</div>

        <motion.div custom={6} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/admin-dashboard/settings" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <FaCogs />
            <span>Settings</span>
          </NavLink>
        </motion.div>
      </div>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn-sidebar">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
