import React, { useState, useEffect } from 'react';
import { gradingAPI, assignmentsAPI } from '../api/apiClient';
import './GradingSection.css';

function GradingSection() {
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filterStudentId, setFilterStudentId] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    assignmentId: '',
    grade: '',
    feedback: '',
    course: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [gradesRes, assignmentsRes] = await Promise.all([
        gradingAPI.getAll(),
        assignmentsAPI.getAll(),
      ]);
      setGrades(gradesRes.data);
      setAssignments(assignmentsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
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
    if (!formData.studentId || !formData.assignmentId || !formData.grade) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await gradingAPI.create({
        studentId: formData.studentId,
        assignmentId: formData.assignmentId,
        grade: parseFloat(formData.grade),
        feedback: formData.feedback,
        course: formData.course,
      });
      alert('Grade saved successfully!');
      setFormData({
        studentId: '',
        assignmentId: '',
        grade: '',
        feedback: '',
        course: '',
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError('Failed to save grade');
      console.error(err);
    }
  };

  const filteredGrades = filterStudentId
    ? grades.filter(g => g.studentId === filterStudentId)
    : grades;

  return (
    <div className="grading-section">
      <div className="section-header">
        <h2>✅ Grading Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Grade'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="grading-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Student ID *:</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="e.g., STU001"
                required
              />
            </div>

            <div className="form-group">
              <label>Assignment *:</label>
              <select
                name="assignmentId"
                value={formData.assignmentId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select an assignment</option>
                {assignments.map(assignment => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Grade *:</label>
              <input
                type="number"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                placeholder="e.g., 95"
                step="0.1"
                min="0"
                max="100"
                required
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

          <div className="form-group">
            <label>Feedback:</label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              placeholder="Enter feedback for the student"
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary">Save Grade</button>
        </form>
      )}

      <div className="filter-section">
        <input
          type="text"
          placeholder="Filter by Student ID..."
          value={filterStudentId}
          onChange={(e) => setFilterStudentId(e.target.value)}
        />
      </div>

      <div className="grades-list">
        {loading ? (
          <p>Loading grades...</p>
        ) : filteredGrades.length === 0 ? (
          <p>No grades available</p>
        ) : (
          <table className="grades-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Assignment</th>
                <th>Grade</th>
                <th>Course</th>
                <th>Feedback</th>
                <th>Graded At</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map(grade => {
                const assignment = assignments.find(a => a.id === grade.assignmentId);
                return (
                  <tr key={grade.id}>
                    <td>{grade.studentId}</td>
                    <td>{assignment ? assignment.title : 'Unknown'}</td>
                    <td className="grade-cell">
                      <span className={`grade-badge ${grade.grade >= 70 ? 'pass' : 'fail'}`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td>{grade.course || '-'}</td>
                    <td>{grade.feedback || '-'}</td>
                    <td>{new Date(grade.gradedAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default GradingSection;
