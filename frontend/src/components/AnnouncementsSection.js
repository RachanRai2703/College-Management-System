import React, { useState, useEffect } from 'react';
import { announcementsAPI } from '../api/apiClient';
import './AnnouncementsSection.css';

function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    course: '',
    expiresAt: '',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await announcementsAPI.getAll();
      setAnnouncements(response.data);
    } catch (err) {
      setError('Failed to fetch announcements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      alert('Please fill in title and message');
      return;
    }

    try {
      await announcementsAPI.create({
        title: formData.title,
        message: formData.message,
        course: formData.course,
        expiresAt: formData.expiresAt || null,
      });
      alert('Announcement posted successfully!');
      setFormData({
        title: '',
        message: '',
        course: '',
        expiresAt: '',
      });
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) {
      setError('Failed to create announcement');
      console.error(err);
    }
  };

  const isExpired = (expiresAt) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  return (
    <div className="announcements-section">
      <div className="section-header">
        <h2>📢 Announcements</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Post Announcement'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="announcements-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter announcement title"
              required
            />
          </div>

          <div className="form-group">
            <label>Message *:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter announcement message"
              rows="5"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Course:</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                placeholder="e.g., All Courses"
              />
            </div>

            <div className="form-group">
              <label>Expires At:</label>
              <input
                type="datetime-local"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Post Announcement</button>
        </form>
      )}

      <div className="announcements-list">
        {loading ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p>No announcements available</p>
        ) : (
          announcements.map(announcement => (
            <div 
              key={announcement.id} 
              className={`announcement-card ${isExpired(announcement.expiresAt) ? 'expired' : ''}`}
            >
              <div className="announcement-header">
                <div>
                  <h3>{announcement.title}</h3>
                  {announcement.course && (
                    <span className="announcement-course">{announcement.course}</span>
                  )}
                </div>
                {isExpired(announcement.expiresAt) && (
                  <span className="expired-badge">Expired</span>
                )}
              </div>
              <p className="announcement-message">{announcement.message}</p>
              <div className="announcement-meta">
                <span>📅 Posted: {new Date(announcement.postedAt).toLocaleString()}</span>
                {announcement.expiresAt && (
                  <span>⏰ Expires: {new Date(announcement.expiresAt).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AnnouncementsSection;
