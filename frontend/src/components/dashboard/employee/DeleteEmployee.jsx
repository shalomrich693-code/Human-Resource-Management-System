import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteEmployee = ({ employeeId }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.delete(`http://localhost:3000/api/employees/${employeeId}`, config);
      navigate('/admin-dashboard/employees');
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <button onClick={handleDelete}>Delete Employee</button>
  );
};

export default DeleteEmployee;
