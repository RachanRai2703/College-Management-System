import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Notes API
export const notesAPI = {
  getAll: () => apiClient.get('/notes'),
  getById: (id) => apiClient.get(`/notes/${id}`),
  upload: (formData) => apiClient.post('/notes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  download: (filename) => apiClient.get(`/uploads/${filename}`, { responseType: 'blob' }),
};

// Grading API
export const gradingAPI = {
  getAll: (params = {}) => apiClient.get('/grading', { params }),
  create: (data) => apiClient.post('/grading', data),
  getByStudent: (studentId) => apiClient.get('/grading', { params: { studentId } }),
  getByAssignment: (assignmentId) => apiClient.get('/grading', { params: { assignmentId } }),
};

// Assignments API
export const assignmentsAPI = {
  getAll: () => apiClient.get('/assignments'),
  create: (data) => apiClient.post('/assignments', data),
};

// Announcements API
export const announcementsAPI = {
  getAll: () => apiClient.get('/announcements'),
  create: (data) => apiClient.post('/announcements', data),
};

export default apiClient;
