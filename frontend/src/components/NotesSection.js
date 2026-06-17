import React, { useState, useEffect } from 'react';
import { notesAPI } from '../api/apiClient';
import './NotesSection.css';

function NotesSection() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    author: '',
    file: null,
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await notesAPI.getAll();
      setNotes(response.data);
    } catch (err) {
      setError('Failed to fetch notes');
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

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert('Please select a file');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('file', formData.file);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('course', formData.course);
    formDataToSend.append('author', formData.author);

    try {
      await notesAPI.upload(formDataToSend);
      alert('Note uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        course: '',
        author: '',
        file: null,
      });
      setShowForm(false);
      fetchNotes();
    } catch (err) {
      setError('Failed to upload note');
      console.error(err);
    }
  };

  return (
    <div className="notes-section">
      <div className="section-header">
        <h2>📝 Notes Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Upload Note'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="notes-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter note title"
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter note description"
              rows="3"
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
                placeholder="e.g., Mathematics"
              />
            </div>

            <div className="form-group">
              <label>Author:</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>File:</label>
            <input
              type="file"
              onChange={handleFileChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Upload Note</button>
        </form>
      )}

      <div className="notes-list">
        {loading ? (
          <p>Loading notes...</p>
        ) : notes.length === 0 ? (
          <p>No notes available</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <h3>{note.title}</h3>
                <span className="note-course">{note.course}</span>
              </div>
              <p className="note-description">{note.description}</p>
              <div className="note-meta">
                <span>👤 {note.author}</span>
                <span>📄 {note.originalName}</span>
                <span>💾 {(note.size / 1024).toFixed(2)} KB</span>
              </div>
              <small className="note-date">
                Uploaded: {new Date(note.uploadedAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotesSection;
