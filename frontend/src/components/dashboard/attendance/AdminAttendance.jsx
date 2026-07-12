import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import SummaryCard from '../SummaryCard';
import { FaUsers, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      
      const [attendanceRes, summaryRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/attendance/admin/by-date?date=${date}`, { headers }),
        axios.get(`http://localhost:3000/api/attendance/admin/summary`, { headers })
      ]);
      
      setAttendance(attendanceRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: 'Employee',
      selector: row => row.employee?.name || 'Unknown',
      sortable: true,
    },
    {
      name: 'Department',
      selector: row => row.employee?.department?.name || 'Unknown',
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
      sortable: true,
    },
  ];

  if (loading && !summary) return <div className="loading">Loading attendance...</div>;

  return (
    <div className="admin-attendance">
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Attendance Overview</h2>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          style={{ width: 'auto' }}
        />
      </div>
      
      {summary && (
        <div className="summary-cards-container">
          <SummaryCard 
            icon={<FaUsers />} 
            text="Total Employees" 
            number={summary.totalEmployees || 0} 
            color="blue"
          />
          <SummaryCard 
            icon={<FaCheckCircle />} 
            text="Present Today" 
            number={summary.presentToday || 0} 
            color="green"
          />
          <SummaryCard 
            icon={<FaClock />} 
            text="Late Today" 
            number={summary.lateToday || 0} 
            color="amber"
          />
          <SummaryCard 
            icon={<FaTimesCircle />} 
            text="Absent Today" 
            number={summary.absentToday || 0} 
            color="rose"
          />
        </div>
      )}

      <div className="table-container" style={{ marginTop: '20px' }}>
        <DataTable
          columns={columns}
          data={attendance}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  );
};

export default AdminAttendance;
