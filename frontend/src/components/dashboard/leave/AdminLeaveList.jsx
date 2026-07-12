import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import DataTable from 'react-data-table-component';

const AdminLeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/leave/admin/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:3000/api/leave/admin/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchLeaves();
    } catch (error) {
      console.error('Error updating leave status:', error);
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
      name: 'Type',
      selector: row => row.type || row.leaveType,
      sortable: true,
    },
    {
      name: 'Dates',
      selector: row => `${new Date(row.startDate).toLocaleDateString()} - ${new Date(row.endDate).toLocaleDateString()}`,
    },
    {
      name: 'Reason',
      selector: row => row.reason || row.description,
      wrap: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      cell: row => (
        <span className={`status ${row.status.toLowerCase()}`}>
          {row.status === 'approved' && <FaCheckCircle />}
          {row.status === 'rejected' && <FaTimesCircle />}
          {row.status === 'pending' && <FaClock />}
          {' ' + row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        row.status === 'pending' ? (
          <div className="action-buttons">
            <button onClick={() => updateLeaveStatus(row._id, 'approved')} className="btn-approve">Approve</button>
            <button onClick={() => updateLeaveStatus(row._id, 'rejected')} className="btn-reject">Reject</button>
          </div>
        ) : '-'
      ),
    },
  ];

  if (loading) return <div className="loading">Loading leaves...</div>;

  return (
    <div className="admin-leave-list">
      <div className="header-actions">
        <h2>Leave Management</h2>
      </div>
      <div className="table-container">
        <DataTable
          columns={columns}
          data={leaves}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  );
};

export default AdminLeaveList;
