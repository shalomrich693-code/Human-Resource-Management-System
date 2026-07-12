import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import './Salary.css';

const ViewSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalaryHistory();
  }, [id]);

  const fetchSalaryHistory = async () => {
    try {
      setLoading(true);
      console.log('Fetching salary history for employee:', id);
      
      const [employeeRes, salaryRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/employees/${id}`),
        axios.get(`http://localhost:3000/api/salaries/employee/${id}`)
      ]);

      console.log('Employee data:', employeeRes.data);
      console.log('Salary history:', salaryRes.data);

      setEmployee(employeeRes.data);
      setSalaryHistory(salaryRes.data);
    } catch (error) {
      console.error('Error fetching salary history:', error);
      setError('Failed to fetch salary history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <div className="salary-container">Loading salary history...</div>;
  }

  if (error) {
    return <div className="salary-container">Error: {error}</div>;
  }

  return (
    <div className="salary-container">
      <div className="salary-header">
        <div className="header-left">
          <button
            className="back-button"
            onClick={() => navigate('/admin-dashboard/employees')}
          >
            <FaArrowLeft />
          </button>
          <h2>Salary History</h2>
        </div>
        {employee && (
          <div className="employee-info">
            <h3>{employee.name}</h3>
            <p>Employee ID: {employee.employeeId}</p>
          </div>
        )}
      </div>

      <div className="salary-history-container">
        {salaryHistory.length === 0 ? (
          <div className="no-records">No salary records found</div>
        ) : (
          <div className="salary-records">
            {salaryHistory.map((salary) => (
              <div key={salary._id} className="salary-record">
                <div className="record-header">
                  <h4>Pay Date: {formatDate(salary.payDate)}</h4>
                </div>
                <div className="record-details">
                  <div className="detail-item">
                    <label>Basic Salary:</label>
                    <span>{formatCurrency(salary.basicSalary)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Allowances:</label>
                    <span>{formatCurrency(salary.allowances || 0)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Deductions:</label>
                    <span>{formatCurrency(salary.deductions || 0)}</span>
                  </div>
                  <div className="detail-item net-salary">
                    <label>Net Salary:</label>
                    <span>{formatCurrency(salary.netSalary)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSalary;