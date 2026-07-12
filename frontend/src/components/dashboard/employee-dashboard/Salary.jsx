import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaMoneyBillWave, 
  FaCalendar, 
  FaCheckCircle, 
  FaTimesCircle 
} from 'react-icons/fa';

const Salary = () => {
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalaryHistory();
  }, []);

  const fetchSalaryHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/salary/employee/history');
      setSalaryHistory(response.data);
      setError('');
    } catch (error) {
      setError('Error fetching salary history');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading salary history...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="salary-container">
      <h2>Salary History</h2>

      <div className="salary-history">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {salaryHistory.map((salary, index) => (
              <tr key={index}>
                <td>
                  {new Date(salary.month).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </td>
                <td>${salary.basicSalary.toFixed(2)}</td>
                <td>${salary.allowances.toFixed(2)}</td>
                <td>${salary.deductions.toFixed(2)}</td>
                <td className="net-salary">${salary.netSalary.toFixed(2)}</td>
                <td>
                  {salary.status === 'paid' ? (
                    <span className="status paid">
                      <FaCheckCircle /> Paid
                    </span>
                  ) : salary.status === 'cancelled' ? (
                    <span className="status cancelled">
                      <FaTimesCircle /> Cancelled
                    </span>
                  ) : (
                    <span className="status pending">
                      <FaCalendar /> Pending
                    </span>
                  )}
                </td>
                <td>
                  {salary.paymentDate 
                    ? new Date(salary.paymentDate).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="salary-summary">
        <h3>Salary Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <FaMoneyBillWave className="summary-icon" />
            <div className="summary-details">
              <h4>Total Earnings</h4>
              <p>${salaryHistory.reduce((acc, curr) => acc + curr.netSalary, 0).toFixed(2)}</p>
            </div>
          </div>
          <div className="summary-item">
            <FaMoneyBillWave className="summary-icon" />
            <div className="summary-details">
              <h4>Average Monthly</h4>
              <p>${(salaryHistory.reduce((acc, curr) => acc + curr.netSalary, 0) / salaryHistory.length).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salary;
