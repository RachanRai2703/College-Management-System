import React, { useState } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/AuthPages';
import NotesSection from './components/NotesSection';
import GradingSection from './components/GradingSection';
import AssignmentsSection from './components/AssignmentsSection';
import AnnouncementsSection from './components/AnnouncementsSection';
import AttendanceSection from './components/AttendanceSection';

function App() {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('notes');

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">🎓</div>
        <p>Loading College Management System...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onSuccess={() => {}} />;
  }

  const getRoleLabel = () => {
    const roleMap = {
      student: '👨‍🎓 Student',
      teacher: '👨‍🏫 Teacher',
      admin: '👨‍💼 Administrator'
    };
    return roleMap[user.role] || user.role;
  };

  // Role-based menu
  const getVisibleTabs = () => {
    const allTabs = ['notes', 'grading', 'assignments', 'announcements', 'attendance'];
    
    if (user.role === 'student') {
      return ['notes', 'assignments', 'announcements', 'attendance'];
    }
    if (user.role === 'teacher') {
      return ['notes', 'grading', 'assignments', 'announcements', 'attendance'];
    }
    return allTabs; // admin has access to all
  };

  const visibleTabs = getVisibleTabs();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>🎓 College Management System</h1>
            <p>Streamline your academic operations</p>
          </div>
          <div className="header-user">
            <span className="user-role">{getRoleLabel()}</span>
            <span className="user-name">{user.name}</span>
            <button className="btn-logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        {visibleTabs.includes('notes') && (
          <button 
            className={`nav-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            📝 Notes
          </button>
        )}
        {visibleTabs.includes('grading') && (
          <button 
            className={`nav-btn ${activeTab === 'grading' ? 'active' : ''}`}
            onClick={() => setActiveTab('grading')}
          >
            ✅ Grading
          </button>
        )}
        {visibleTabs.includes('assignments') && (
          <button 
            className={`nav-btn ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            📋 Assignments
          </button>
        )}
        {visibleTabs.includes('announcements') && (
          <button 
            className={`nav-btn ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            📢 Announcements
          </button>
        )}
        {visibleTabs.includes('attendance') && (
          <button 
            className={`nav-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            📋 Attendance
          </button>
        )}
      </nav>

      <main className="app-main">
        {activeTab === 'notes' && <NotesSection />}
        {activeTab === 'grading' && <GradingSection />}
        {activeTab === 'assignments' && <AssignmentsSection />}
        {activeTab === 'announcements' && <AnnouncementsSection />}
        {activeTab === 'attendance' && <AttendanceSection />}
      </main>

      <footer className="app-footer">
        <p>College Management System © 2024 - Connected to Backend API</p>
      </footer>
    </div>
  );
}

export default App;
