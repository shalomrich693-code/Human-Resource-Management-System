import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClock, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import DataTable from 'react-data-table-component';

const EmployeeAttendance = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      
      const [todayRes, historyRes] = await Promise.all([
        axios.get('http://localhost:3000/api/attendance/today', { headers }),
        axios.get('http://localhost:3000/api/attendance/my-history', { headers })
      ]);
      
      setTodayAttendance(todayRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.post('http://localhost:3000/api/attendance/check-in', {}, { headers });
      fetchAttendanceData();
    } catch (error) {
      setError(error.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.post('http://localhost:3000/api/attendance/check-out', {}, { headers });
      fetchAttendanceData();
    } catch (error) {
      setError(error.response?.data?.message || 'Check-out failed');
    }
  };

  const columns = [
    {
      name: 'Date',
      selector: row => new Date(row.date).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Check In',
      selector: row => row.checkIn ? new Date(row.checkIn).toLocaleTimeString() : '-',
    },
    {
      name: 'Check Out',
      selector: row => row.checkOut ? new Date(row.checkOut).toLocaleTimeString() : '-',
    },
    {
      name: 'Hours',
      selector: row => row.hoursWorked || '-',
    },
    {
      name: 'Status',
      selector: row => row.status,
      cell: row => (
        <span className={`status ${row.status.toLowerCase()}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
  ];

  if (loading) return <div className="loading">Loading attendance...</div>;

  return (
    <div className="employee-attendance dashboard-content">
      <h2>My Attendance</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="attendance-action-card dashboard-card" style={{ marginBottom: '20px', padding: '20px' }}>
        <h3>Today: {new Date().toLocaleDateString()}</h3>
        <div className="action-buttons" style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
          <button 
            onClick={handleCheckIn} 
            disabled={todayAttendance?.checkIn}
            className="submit-button"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaCheckCircle /> {todayAttendance?.checkIn ? 'Checked In' : 'Check In'}
          </button>
          
          <button 
            onClick={handleCheckOut} 
            disabled={!todayAttendance?.checkIn || todayAttendance?.checkOut}
            className="cancel-button"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e11d48' }}
          >
            <FaSignOutAlt /> {todayAttendance?.checkOut ? 'Checked Out' : 'Check Out'}
          </button>
        </div>
        
        {todayAttendance?.checkIn && (
          <p style={{ marginTop: '15px', color: '#94a3b8' }}>
            <FaClock /> Checked in at: {new Date(todayAttendance.checkIn).toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="table-container">
        <h3>Attendance History</h3>
        <DataTable
          columns={columns}
          data={history}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  );
};

export default EmployeeAttendance;
