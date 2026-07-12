import React, { useState } from 'react';
import axios from 'axios';
import { 
  FaLock, 
  FaLockOpen, 
  FaInfoCircle 
} from 'react-icons/fa';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (!newPassword || !confirmPassword) {
      setError('Please enter new password and confirmation');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await axios.put('http://localhost:3000/api/employees/change-password', {
        currentPassword,
        newPassword
      });

      setMessage(response.data.message);
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error changing password');
      setMessage('');
    }
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>

      {message && (
        <div className="success-message">
          <FaInfoCircle /> {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          <FaInfoCircle /> {error}
        </div>
      )}

      <div className="settings-section">
        <h3>Change Password</h3>
        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label>
              <FaLock /> Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>
              <FaLockOpen /> New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>
              <FaLockOpen /> Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="submit-button">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
