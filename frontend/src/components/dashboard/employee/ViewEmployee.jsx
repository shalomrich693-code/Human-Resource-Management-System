import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Employee.css';
import { FaEdit, FaArrowLeft, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from "../../../context/authContext.jsx";
const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Get user info from auth context

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/employees/${id}`);
      console.log('Employee data:', response.data); // Debug log
      setEmployee(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching employee:', err);
      setError(err.response?.data?.message || 'Failed to fetch employee data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBack = () => {
    navigate('/admin-dashboard/employees');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employee) return <div>Employee not found</div>;

  return (
    <div className="employee-container">
      <div className="employee-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="action-button view-button"
            onClick={handleBack}
            title="Back to List"
          >
            <FaArrowLeft />
          </button>
          <h2>Employee Details</h2>
        </div>
        <div className="action-buttons">
          <button
            className="action-button edit-button"
            onClick={() => navigate(`/admin-dashboard/employees/edit/${id}`)}
            title="Edit Employee"
          >
            <FaEdit /> Edit
          </button>
          <button
            className="action-button salary-button"
            onClick={() => {
              console.log('Navigating to salary history for employee:', id);
              navigate(`/admin-dashboard/salary/${id}`);
            }}
            title="Salary History"
          >
            <FaMoneyBillWave /> Salary History
          </button>
          <button
            className="action-button leave-button"
            onClick={() => navigate(`/admin-dashboard/employees/leave/${id}`)}
            title="Leave History"
          >
            <FaCalendarAlt /> Leave History
          </button>
        </div>
      </div>

      <div className="employee-form-container">
        <div className="view-employee-grid">
          {/* Left Column - Large Image */}
          <div className="view-left-column">
            <div className="large-image-container">
              <img
                src={employee.image || '/default-avatar.png'}
                alt={employee.name}
                className="large-profile-image"
              />
              <h2 className="employee-name">{employee.name || 'No Name'}</h2>
              <p className="employee-position">{employee.position || 'No Position'}</p>
            </div>
          </div>

          {/* Right Column - Employee Information */}
          <div className="view-right-column">
            <div className="info-section">
              <div className="info-group">
                <label>Employee ID</label>
                <div className="info-value">{employee.employeeId || 'Not provided'}</div>
              </div>

              <div className="info-group">
                <label>Department</label>
                <div className="info-value">{employee.department?.name || 'Not assigned'}</div>
              </div>

              <div className="info-group">
                <label>Date of Birth</label>
                <div className="info-value">{formatDate(employee.dateOfBirth)}</div>
              </div>

              <div className="info-group">
                <label>Email</label>
                <div className="info-value">{employee.email || 'Not provided'}</div>
              </div>

              <div className="info-group">
                <label>Phone</label>
                <div className="info-value">{employee.phone || 'Not provided'}</div>
              </div>

              <div className="info-group">
                <label>Join Date</label>
                <div className="info-value">{formatDate(employee.joinDate)}</div>
              </div>

              <div className="info-group full-width">
                <label>Address</label>
                <div className="info-value">{employee.address || 'Not provided'}</div>
              </div>

              {/* Show password only for admins */}
              {user?.role === 'admin' && (
                <div className="info-group">
                  <label>Password</label>
                  <div className="info-value">{employee.password}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;