import React, { useState, useEffect } from 'react';
import SummaryCard from './SummaryCard';
import { 
  FaBuilding, FaCheckCircle, FaFileAlt, 
  FaHourglassHalf, FaMoneyBillWave, FaTimesCircle, FaUsers 
} from 'react-icons/fa';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminSummary = () => {
  const [summaryData, setSummaryData] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    monthlySalary: 0,
    leaveApplied: 0,
    leaveApproved: 0,
    leavePending: 0,
    leaveReject: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/dashboard/summary', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSummaryData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="admin-summary">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="header-actions"
        style={{ marginBottom: '2rem' }}
      >
        <div>
          <h2>Dashboard Overview</h2>
          <p style={{ color: 'var(--text-muted)' }}>Welcome to ITSC Human Resource Management System</p>
        </div>
      </motion.div>
      
      <div className="summary-cards-container">
        <SummaryCard 
          icon={<FaUsers />} 
          text="Total Employees" 
          number={loading ? '--' : summaryData.totalEmployees} 
          color="blue"
        />
        <SummaryCard 
          icon={<FaBuilding />} 
          text="Total Departments" 
          number={loading ? '--' : summaryData.totalDepartments} 
          color="purple"
        />
        <SummaryCard 
          icon={<FaMoneyBillWave />} 
          text="Monthly Payroll" 
          number={loading ? '--' : formatCurrency(summaryData.monthlySalary)} 
          color="emerald"
        />
      </div>

      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: '1rem', marginTop: '1rem' }}
      >
        Leave Requests Overview
      </motion.h3>
      
      <div className="second-cards-container">
        <SummaryCard 
          icon={<FaFileAlt />} 
          text="Total Applied" 
          number={loading ? '--' : summaryData.leaveApplied} 
          color="blue"
        />
        <SummaryCard 
          icon={<FaHourglassHalf />} 
          text="Pending Approval" 
          number={loading ? '--' : summaryData.leavePending} 
          color="amber"
        />
        <SummaryCard 
          icon={<FaCheckCircle />} 
          text="Approved" 
          number={loading ? '--' : summaryData.leaveApproved} 
          color="green"
        />
        <SummaryCard 
          icon={<FaTimesCircle />} 
          text="Rejected" 
          number={loading ? '--' : summaryData.leaveReject} 
          color="rose"
        />
      </div>
    </div>
  );
};

export default AdminSummary;