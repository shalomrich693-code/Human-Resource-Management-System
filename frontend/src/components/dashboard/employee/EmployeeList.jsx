import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Employee.css';
import { FaEdit, FaTrash, FaEye, FaMoneyBillWave, FaCalendarAlt, FaUserPlus } from 'react-icons/fa';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/employees');
      setEmployees(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/employees/search?employeeId=${searchId}`);
      setEmployees(response.data);
      setError(null);
    } catch (error) {
      console.error('Error searching employees:', error);
      setError('Failed to search employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:3000/api/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="employee-container">Loading employees...</div>;
  }

  if (error) {
    return <div className="employee-container">Error: {error}</div>;
  }

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h2>Employees</h2>
        <button 
          className="add-button"
          onClick={() => navigate('/admin-dashboard/employees/add')}
        >
          <FaUserPlus /> Add Employee
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Employee ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="search-input"
        />
        <button className="action-button view-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Department</th>
              <th>Date of Birth</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.employeeId}</td>
                <td>
                  <img 
                    src={employee.image || '/default-avatar.png'} 
                    alt={employee.name} 
                    className="employee-image"
                  />
                </td>
                <td>{employee.name}</td>
                <td>{employee.department?.name}</td>
                <td>{formatDate(employee.dateOfBirth)}</td>
                <td>{employee.position}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-button view-button"
                      onClick={() => navigate(`/admin-dashboard/employees/view/${employee._id}`)}
                      title="View Employee"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="action-button edit-button"
                      onClick={() => navigate(`/admin-dashboard/employees/edit/${employee._id}`)}
                      title="Edit Employee"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(employee._id)}
                      title="Delete Employee"
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="action-button salary-button"
                      onClick={() => navigate(`/admin-dashboard/employees/salary/${employee._id}`)}
                      title="Salary History"
                    >
                      <FaMoneyBillWave />
                    </button>
                    <button
                      className="action-button leave-button"
                      onClick={() => navigate(`/admin-dashboard/employees/leave/${employee._id}`)}
                      title="Leave History"
                    >
                      <FaCalendarAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;