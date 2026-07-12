import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaMoneyBillWave, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../../context/authContext.jsx';

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    pendingLeaves: 0,
    totalSalary: 0,
    totalDays: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Set token globally when it changes
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    fetchDashboardStats();
  }, [token]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const api = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const [leavesResponse, salaryResponse] = await Promise.all([
        api.get('/leave/employee/stats').catch(err => {
          console.error('Error fetching leave stats:', err);
          return { data: null };
        }),
        api.get('/salaries/stats/employee').catch(err => {
          console.error('Error fetching salary stats:', err);
          return { data: null };
        })
      ]);
      
      console.log('Leave response:', leavesResponse);
      console.log('Salary response:', salaryResponse);
      
      // Handle partial success
      const stats = {
        pendingLeaves: 0,
        totalSalary: 0,
        totalDays: 0
      };

      if (leavesResponse?.data) {
        stats.pendingLeaves = leavesResponse.data.pendingLeaves || 0;
        stats.totalDays = leavesResponse.data.totalDays || 0;
      }

      if (salaryResponse?.data) {
        stats.totalSalary = salaryResponse.data.totalEarnings || 0;
      }

      setStats(stats);
      setError('');
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      if (error.response) {
        setError(`Server Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        setError('No response from server. Please check if the server is running.');
      } else {
        setError(error.message || 'Error fetching dashboard stats. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message">
    <p>{error}</p>
    <button onClick={fetchDashboardStats} className="retry-button">
      Retry
    </button>
  </div>;

  return (
    <div className="dashboard">
      <h2>Welcome to Your Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <FaCalendarCheck className="stat-icon" />
          <h3>Pending Leaves</h3>
          <p className="stat-value">{stats.pendingLeaves}</p>
        </div>

        <div className="stat-card">
          <FaMoneyBillWave className="stat-icon" />
          <h3>Total Salary</h3>
          <p className="stat-value">${stats.totalSalary.toFixed(2)}</p>
        </div>

        <div className="stat-card">
          <FaUser className="stat-icon" />
          <h3>Working Days</h3>
          <p className="stat-value">{stats.totalDays} days</p>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <div className="action-card">
            <Link to="/employee-dashboard/leave" className="action-link">
              <FaCalendarCheck /> Apply for Leave
            </Link>
          </div>
          <div className="action-card">
            <Link to="/employee-dashboard/salary" className="action-link">
              <FaMoneyBillWave /> View Salary
            </Link>
          </div>
          <div className="action-card">
            <Link to="/employee-dashboard/profile" className="action-link">
              <FaUser /> Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
