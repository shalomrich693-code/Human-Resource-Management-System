import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Department.css';

const AddDepartment = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/departments', formData);
      navigate('/admin-dashboard/departments');
    } catch (error) {
      console.error('Error adding department:', error);
      setError('Failed to add department. Please try again.');
    }
  };

  return (
    <div className="department-form-container">
      <h2>Add New Department</h2>
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
          <button type="submit" className="submit-button">Add Department</button>
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

export default AddDepartment;