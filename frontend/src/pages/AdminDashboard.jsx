import React, { useState } from 'react'; 
import { useAuth } from '../context/authContext';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/dashboard/AdminSidebar';
import Navbar from '../components/dashboard/Navbar';
import '../components/dashboard/AdminSidebar.css';
import AdminSummary from '../components/dashboard/AdminSummary';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const mainContentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        when: "beforeChildren"
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="dashboard-container">
      <AdminSidebar isCollapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
      <motion.div 
        className="main-content"
        variants={mainContentVariants}
        initial="hidden"
        animate="visible"
        style={{
          marginLeft: sidebarCollapsed ? "80px" : "280px",
          width: `calc(100% - ${sidebarCollapsed ? "80px" : "280px"})`,
          transition: "all 0.3s ease"
        }}
      >
        <motion.div 
          className="content-wrapper"
          variants={childVariants}
        >
          <Navbar />
          <motion.div 
            className="dashboard-main"
            variants={childVariants}
          >
            <motion.div 
              className="content-container"
              variants={childVariants}
            >
              <Outlet />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;