import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AttendanceSection.css';

function AttendanceSection() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('records');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present'
  });

  useEffect(() => {
    if (user?.role === 'student') {
      fetchStudentAttendance();
    } else if (user?.role === 'teacher') {
      fetchStudentAttendance();
    }
  }, [user]);

  const fetchStudentAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const studentId = user.enrollmentId || user.id;
      
      // Fetch records
      const recordsRes = await fetch(
        `${process.env.REACT_APP_API_URL}/attendance/student/${studentId}`
      );
      if (recordsRes.ok) {
        const data = await recordsRes.json();
        setAttendance(data.records || []);
      }

      // Fetch report
      const reportRes = await fetch(
        `${process.env.REACT_APP_API_URL}/attendance/report/${studentId}`
      );
      if (reportRes.ok) {
        const data = await reportRes.json();
        setReport(data);
      }
    } catch (err) {
      setError('Failed to fetch attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.courseId) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/attendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to mark attendance');

      alert('Attendance marked successfully!');
      setFormData({
        studentId: '',
        courseId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present'
      });
      setShowForm(false);
      fetchStudentAttendance();
    } catch (err) {
      setError('Failed to mark attendance');
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'status-present';
      case 'absent':
        return 'status-absent';
      case 'late':
        return 'status-late';
      case 'excused':
        return 'status-excused';
      default:
        return '';
    }
  };

  return (
    <div className="attendance-section">
      <div className="section-header">
        <h2>📋 Attendance Management</h2>
        {user?.role === 'teacher' && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Mark Attendance'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {user?.role === 'teacher' && showForm && (
        <form className="attendance-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Student ID *:</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="e.g., STU-001"
                required
              />
            </div>

            <div className="form-group">
              <label>Course ID *:</label>
              <input
                type="text"
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                placeholder="e.g., CS-101"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Mark Attendance</button>
        </form>
      )}

      <div className="attendance-tabs">
        <button
          className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          📅 Records
        </button>
        <button
          className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          📊 Report
        </button>
      </div>

      <div className="attendance-content">
        {loading ? (
          <p>Loading attendance...</p>
        ) : activeTab === 'records' ? (
          <div className="attendance-records">
            {attendance.length === 0 ? (
              <p>No attendance records</p>
            ) : (
              <div className="records-table-wrapper">
                <table className="records-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Marked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map(record => (
                      <tr key={record.id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.courseId}</td>
                        <td>
                          <span className={`status-badge ${getStatusColor(record.status)}`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td>{new Date(record.markedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="attendance-report">
            {Object.keys(report).length === 0 ? (
              <p>No attendance report available</p>
            ) : (
              <div className="report-grid">
                {Object.entries(report).map(([courseId, stats]) => (
                  <div key={courseId} className="report-card">
                    <h3>{courseId}</h3>
                    <div className="stats">
                      <div className="stat-item">
                        <span className="stat-label">Total</span>
                        <span className="stat-value">{stats.total}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Present</span>
                        <span className="stat-value present">{stats.present}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Absent</span>
                        <span className="stat-value absent">{stats.absent}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Late</span>
                        <span className="stat-value late">{stats.late}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Excused</span>
                        <span className="stat-value excused">{stats.excused}</span>
                      </div>
                    </div>
                    <div className="percentage-bar">
                      <div 
                        className="percentage-fill"
                        style={{ width: `${stats.percentage}%` }}
                      />
                      <span className="percentage-text">{stats.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceSection;
