import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaCalendarCheck, 
  FaCalendarTimes, 
  FaCheckCircle, 
  FaTimesCircle 
} from 'react-icons/fa';

const Leave = () => {
  const [leaveTypes] = useState([
    'Annual Leave',
    'Sick Leave',
    'Casual Leave',
    'Emergency Leave'
  ]);
  
  const [leaveRequest, setLeaveRequest] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/leave/employee/history');
      setLeaveHistory(response.data);
      setError('');
    } catch (error) {
      setError('Error fetching leave history');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:3000/api/leave/employee/request', leaveRequest);
      setSuccessMessage('Leave request submitted successfully');
      setLeaveRequest({
        type: '',
        startDate: '',
        endDate: '',
        reason: ''
      });
      fetchLeaveHistory();
    } catch (error) {
      setError('Error submitting leave request');
      console.error('Error:', error);
    }
  };

  if (loading) return <div className="loading">Loading leave history...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="leave-container">
      <h2>Leave Management</h2>

      <div className="leave-form">
        <h3>Apply for Leave</h3>
        
        {successMessage && (
          <div className="success-message">
            <FaCheckCircle /> {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Leave Type</label>
            <select
              name="type"
              value={leaveRequest.type}
              onChange={handleChange}
              required
            >
              <option value="">Select leave type</option>
              {leaveTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={leaveRequest.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={leaveRequest.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason</label>
            <textarea
              name="reason"
              value={leaveRequest.reason}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Submit Request
          </button>
        </form>
      </div>

      <div className="leave-history">
        <h3>Leave History</h3>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Days</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.map((leave, index) => (
              <tr key={index}>
                <td>{leave.type}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>
                  {leave.status === 'approved' ? (
                    <span className="status approved">
                      <FaCheckCircle /> Approved
                    </span>
                  ) : leave.status === 'pending' ? (
                    <span className="status pending">
                      <FaCalendarCheck /> Pending
                    </span>
                  ) : (
                    <span className="status rejected">
                      <FaTimesCircle /> Rejected
                    </span>
                  )}
                </td>
                <td>{leave.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leave;
