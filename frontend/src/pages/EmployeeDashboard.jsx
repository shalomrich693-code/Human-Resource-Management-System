import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from '../components/dashboard/employee-dashboard/EmployeeSidebar';
import Navbar from '../components/dashboard/Navbar';
import '../components/dashboard/AdminSidebar.css';

const EmployeeDashboard = () => {
  return (
    <div className="employee-dashboard">
      <EmployeeSidebar />
      <div 
        className="main-content"
        style={{
          marginLeft: '280px',
          width: 'calc(100% - 280px)',
          transition: 'all 0.3s ease'
        }}
      >
        <Navbar />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;