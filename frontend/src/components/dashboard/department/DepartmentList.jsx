import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Department.css';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/departments');
      setDepartments(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to load departments');
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`http://localhost:3000/api/departments/${id}`);
        fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('Failed to delete department');
      }
    }
  };

  if (loading) {
    return <div className="department-container">Loading departments...</div>;
  }

  if (error) {
    return <div className="department-container">Error: {error}</div>;
  }

  return (
    <div className="department-container">
      <div className="department-header">
        <h2>Departments</h2>
        <button 
          className="add-button"
          onClick={() => navigate('/admin-dashboard/departments/add')}
        >
          <FaPlus /> Add Department
        </button>
      </div>

      <div className="table-container">
        <table className="department-table">
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments && departments.length > 0 ? (
              departments.map((dept) => (
                <tr key={dept._id}>
                  <td>{dept.name}</td>
                  <td>{dept.description}</td>
                  <td className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => navigate(`/admin-dashboard/departments/edit/${dept._id}`)}
                      title="Edit Department"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(dept._id)}
                      title="Delete Department"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-departments">
                  No departments found. Click "Add Department" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentList;