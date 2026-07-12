import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUser, 
  FaCalendar, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit,
  FaSave,
  FaTimes,
  FaExclamationCircle,
  FaSync
} from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    department: '',
    position: '',
    joinDate: '',
    photo: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      setLoading(true);
      
      const apiUrl = 'http://localhost:3000/api/employees/profile';
      console.log('API URL:', apiUrl);
      
      let response;
      try {
        response = await axios.get(apiUrl, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log('Profile API Response:', response);
      } catch (err) {
        console.error('API Request failed:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          statusText: err.response?.statusText
        });
        throw err;
      }
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // Process the response data
      let profileData = response.data.data || response.data;
      console.log('Profile data:', JSON.stringify(profileData, null, 2));
      
      // Ensure we have the basic profile data structure
      if (!profileData) {
        throw new Error('Invalid profile data structure');
      }
      
      // Process the photo URL if it exists
      if (profileData.photo || profileData.image) {
        const photoUrl = profileData.photo || profileData.image;
        if (photoUrl) {
          // If photo is a relative path, convert it to absolute URL
          if (!photoUrl.startsWith('http') && !photoUrl.startsWith('data:')) {
            const baseUrl = 'http://localhost:3000';
            profileData.photo = `${baseUrl}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
            console.log('Processed photo URL:', profileData.photo);
          } else {
            profileData.photo = photoUrl;
          }
        }
      } else {
        console.log('No photo URL available in profile data');
        // Set a default avatar if no photo is available
        profileData.photo = defaultProfilePhoto;
      }
      
      setProfile(profileData);
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        dateOfBirth: profileData.dateOfBirth || '',
        department: profileData.department?.name || profileData.department || '',
        position: profileData.position?.name || profileData.position || '',
        joinDate: profileData.joinDate || '',
        photo: profileData.photo || ''
      });
      setError('');
    } catch (error) {
      const errorMessage = error.response 
        ? `Server responded with status ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`
        : error.message;
      
      console.error('Error fetching profile:', {
        message: error.message,
        response: error.response,
        config: error.config,
        stack: error.stack
      });
      
      setError(`Error fetching profile: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      email: profile.email,
      phone: profile.phone,
      address: profile.address
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.put('http://localhost:3000/api/employees/profile', formData, {
        withCredentials: true // Important for sending cookies with the request
      });
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      setError('Error updating profile. Please try again.');
      console.error('Error updating profile:', error);
      
      // More detailed error message if available
      if (error.response && error.response.data && error.response.data.message) {
        setError(`Error: ${error.response.data.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your profile information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">
            <FaExclamationCircle />
          </div>
          <h3>Something went wrong</h3>
          <p className="error-message">{error}</p>
          <button 
            onClick={fetchProfile} 
            className="retry-button"
          >
            <FaSync /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <p className="error-message">
          No profile data available. Please try again later.
        </p>
        <button 
          className="retry-button"
          onClick={fetchProfile}
        >
          Retry
        </button>
      </div>
    );
  }

  // Base64-encoded SVG as a fallback image
  const defaultProfilePhoto = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2RkZGRkZCIgZD0iTTEyLDEzQzkuMzMsMTMgNCwxNC4zMyA0LDE3VjIwSDIwVjE3QzIwLDE0LjMzIDE0LjY3LDEzIDEyLDEzTTEyLDNBMTAsMTAgMCAwLDAgMiwxM0ExMCwxMCAwIDAsMCAxMiwyM0ExMCwxMCAwIDAsMCAyMiwxM0ExMCwxMCAwIDAsMCAxMiwzTTEyLDVBNyw3IDAgMCwxIDE5LDEyQTcsNyAwIDAsMSAxMiwxOUE3LDcgMCAwLDEgNSwxMkE3LDcgMCAwLDEgMTIsNU0xMiw3QTUsNSAwIDAsMCA3LDEyQTUsNSAwIDAsMCAxMiwxN0E1LDUgMCAwLDAgMTcsMTJBNSw1IDAgMCwwIDEyLDdNMTIsOUEzLDMgMCAwLDEgMTUsMTJBMywzIDAgMCwxIDEyLDE1QTMuMyAzLjMgMCAwLDEgOSwxMkEzLDMgMCAwLDEgMTIsOE0xMiw5LjVBMi41LDIuNSAwIDAsMCA5LjUsMTJBMi41LDIuNSAwIDAsMCAxMiwxNC41QTIuNSwyLjUgMCAwLDAgMTQuNSwxMkEyLjUsMi41IDAgMCwwIDEyLDkuNVoiIC8+PC9zdmc+';

  // Create a safe profile object with fallbacks
  const safeProfile = {
    name: profile.name || 'N/A',
    dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A',
    department: profile.department?.name || profile.department || 'N/A',
    position: profile.position?.name || profile.position || 'N/A',
    joinDate: profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'N/A',
    email: profile.email || 'N/A',
    phone: profile.phone || 'N/A',
    address: profile.address || 'N/A',
    photo: profile.photo || defaultProfilePhoto
  };
  
  console.log('Rendering with profile photo:', safeProfile.photo);

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-photo-container">
            {safeProfile.photo ? (
              <img 
                src={safeProfile.photo}
                alt="Profile"
                className="profile-photo"
                onError={(e) => {
                  console.error('Error loading profile photo:', safeProfile.photo);
                  e.target.onerror = null;
                  e.target.src = defaultProfilePhoto;
                }}
                onLoad={() => console.log('Profile photo loaded successfully')}
              />
            ) : (
              <div className="photo-placeholder">
                <FaUser size={40} color="#666" />
              </div>
            )}
          </div>
          <div className="profile-title">
            <h2>{safeProfile.name}</h2>
            <p>{safeProfile.position}</p>
          </div>
          {!editMode && (
            <button type="button" className="edit-button" onClick={handleEdit}>
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="profile-info">
            <div className="info-item">
              <FaUser />
              <div>
                <label>Full Name</label>
                <div className="value">{safeProfile.name}</div>
              </div>
            </div>
            <div className="info-item">
              <FaCalendar />
              <div>
                <label>Date of Birth</label>
                <div className="value">{safeProfile.dateOfBirth}</div>
              </div>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt />
              <div>
                <label>Department</label>
                <div className="value">{safeProfile.department}</div>
              </div>
            </div>
            <div className="info-item">
              <FaUser />
              <div>
                <label>Position</label>
                <div className="value">{safeProfile.position}</div>
              </div>
            </div>
            <div className="info-item">
              <FaCalendar />
              <div>
                <label>Join Date</label>
                <div className="value">{safeProfile.joinDate}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Contact Information</h3>
          <div className="profile-info">
            <div className="info-item">
              <FaEnvelope />
              <div>
                <label>Email Address</label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                ) : (
                  <div className="value">{safeProfile.email}</div>
                )}
              </div>
            </div>
            <div className="info-item">
              <FaPhone />
              <div>
                <label>Phone Number</label>
                {editMode ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                ) : (
                  <div className="value">{safeProfile.phone}</div>
                )}
              </div>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt />
              <div>
                <label>Address</label>
                {editMode ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="form-textarea"
                  />
                ) : (
                  <div className="value">{safeProfile.address}</div>
                )}
              </div>
            </div>
          </div>

          {editMode ? (
            <div className="profile-actions">
              <button type="button" onClick={handleSubmit} className="submit-button">
                Save Changes
              </button>
              <button type="button" onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Profile;
