import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, FaUser, FaMoneyBillWave, 
  FaCalendarAlt, FaCogs, FaSignOutAlt, FaClock
} from 'react-icons/fa';
import { useAuth } from '../../../context/authContext';
import { motion } from 'framer-motion';
import '../AdminSidebar.css'; // Inherit premium styling

const EmployeeSidebar = () => {
  const { logout, user } = useAuth();
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
    <div className="admin-sidebar"> {/* Use admin-sidebar class for consistent styling */}
      <div className="sidebar-brand">
        <h3>ITSC HRMS</h3>
      </div>
      
      <div className="sidebar-menu">
        <div className="menu-category">Main Menu</div>
        
        <motion.div custom={0} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/employee-dashboard" end className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
        </motion.div>

        <motion.div custom={1} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/employee-dashboard/profile" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <FaUser />
            <span>My Profile</span>
          </NavLink>
        </motion.div>

        <div className="menu-category">Activity</div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/employee-dashboard/attendance" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <FaClock />
            <span>Attendance</span>
          </NavLink>
        </motion.div>

        <motion.div custom={3} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/employee-dashboard/leave" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <FaCalendarAlt />
            <span>Leaves</span>
          </NavLink>
        </motion.div>

        <motion.div custom={4} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/employee-dashboard/salary" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <FaMoneyBillWave />
            <span>Salary</span>
          </NavLink>
        </motion.div>

        <div className="menu-category">System</div>

        <motion.div custom={5} initial="hidden" animate="visible" variants={navItemVariants}>
          <NavLink to="/employee-dashboard/settings" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
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

export default EmployeeSidebar;
