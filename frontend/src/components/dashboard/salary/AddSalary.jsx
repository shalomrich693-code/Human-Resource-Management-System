import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Salary.css';

const AddSalary = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    department: '',
    employee: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    payDate: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/departments');
      setDepartments(response.data);
    } catch (error) {
      setError('Failed to fetch departments');
    }
  };

  const fetchEmployeesByDepartment = async (departmentId) => {
    if (!departmentId) return;
    
    try {
      setLoading(true);
      setEmployees([]); // Clear previous employees
      console.log('Fetching employees for department:', departmentId);
      
      const response = await axios.get(`http://localhost:3000/api/employees/department/${departmentId}`);
      console.log('Employees received:', response.data);
      
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'department') {
      console.log('Department changed to:', value);
      setFormData(prev => ({
        ...prev,
        department: value,
        employee: ''
      }));
      // Call fetchEmployeesByDepartment directly here as well
      fetchEmployeesByDepartment(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/api/salaries', {
        employee: formData.employee,
        basicSalary: parseFloat(formData.basicSalary),
        allowances: parseFloat(formData.allowances) || 0,
        deductions: parseFloat(formData.deductions) || 0,
        payDate: formData.payDate
      });

      navigate('/admin-dashboard/employees');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add salary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salary-container">
      <div className="salary-header">
        <div className="header-left">
          <button
            className="back-button"
            onClick={() => navigate('/admin-dashboard/employees')}
          >
            ←
          </button>
          <h2>Add Salary Details</h2>
        </div>
      </div>

      <div className="salary-form-container">
        <form className="salary-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="employee">Employee</label>
              <select
                id="employee"
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                required
                disabled={!formData.department || loading}
              >
                <option value="">
                  {loading ? 'Loading employees...' : 'Select Employee'}
                </option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="basicSalary">Basic Salary</label>
              <input
                type="number"
                id="basicSalary"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="allowances">Allowances</label>
              <input
                type="number"
                id="allowances"
                name="allowances"
                value={formData.allowances}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="deductions">Deductions</label>
              <input
                type="number"
                id="deductions"
                name="deductions"
                value={formData.deductions}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="payDate">Pay Date</label>
              <input
                type="date"
                id="payDate"
                name="payDate"
                value={formData.payDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/admin-dashboard/employees')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Salary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalary;