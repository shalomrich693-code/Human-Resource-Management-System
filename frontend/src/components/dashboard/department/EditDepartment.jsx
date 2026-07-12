import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Department.css';

const EditDepartment = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/departments/${id}`);
        setFormData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching department:', error);
        setError('Failed to load department details');
      } finally {
        setLoading(false);
      }
    };
    fetchDepartment();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/departments/${id}`, formData);
      navigate('/admin-dashboard/departments');
    } catch (error) {
      console.error('Error updating department:', error);
      setError('Failed to update department. Please try again.');
    }
  };

  if (loading) {
    return <div className="department-form-container">Loading department details...</div>;
  }

  if (error) {
    return (
      <div className="department-form-container">
        <div className="error-message">{error}</div>
        <button 
          className="cancel-button"
          onClick={() => navigate('/admin-dashboard/departments')}
        >
          Back to Departments
        </button>
      </div>
    );
  }

  return (
    <div className="department-form-container">
      <h2>Edit Department</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="department-form">
        <div className="form-group">
          <label htmlFor="name">Department Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-button">Update Department</button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/admin-dashboard/departments')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDepartment;