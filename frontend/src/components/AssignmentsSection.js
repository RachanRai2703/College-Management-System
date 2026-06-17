import React, { useState, useEffect } from 'react';
import { assignmentsAPI } from '../api/apiClient';
import './AssignmentsSection.css';

function AssignmentsSection() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    course: '',
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await assignmentsAPI.getAll();
      setAssignments(response.data);
    } catch (err) {
      setError('Failed to fetch assignments');
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
    if (!formData.title) {
      alert('Please enter assignment title');
      return;
    }

    try {
      await assignmentsAPI.create({
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || null,
        course: formData.course,
      });
      alert('Assignment created successfully!');
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        course: '',
      });
      setShowForm(false);
      fetchAssignments();
    } catch (err) {
      setError('Failed to create assignment');
      console.error(err);
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="assignments-section">
      <div className="section-header">
        <h2>📋 Assignments Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Create Assignment'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="assignments-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter assignment title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter assignment details"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date:</label>
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
              />
            </div>

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
          </div>

          <button type="submit" className="btn btn-primary">Create Assignment</button>
        </form>
      )}

      <div className="assignments-list">
        {loading ? (
          <p>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p>No assignments available</p>
        ) : (
          assignments.map(assignment => (
            <div key={assignment.id} className="assignment-card">
              <div className="assignment-header">
                <div>
                  <h3>{assignment.title}</h3>
                  <span className="assignment-course">{assignment.course}</span>
                </div>
                {assignment.dueDate && (
                  <span className={`due-badge ${isOverdue(assignment.dueDate) ? 'overdue' : ''}`}>
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="assignment-description">{assignment.description}</p>
              <div className="assignment-meta">
                <span>📅 Created: {new Date(assignment.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AssignmentsSection;
