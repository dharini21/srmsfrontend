import axios from 'axios';

const API = axios.create({
  // Change this line ↓
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

console.log('API URL:', process.env.REACT_APP_API_URL);
// Attach token automatically
API.interceptors.request.use((config) => {
  const teacher = JSON.parse(localStorage.getItem('teacher') || 'null');
  if (teacher?.token) {
    config.headers.Authorization = `Bearer ${teacher.token}`;
  }
  return config;
});

// Teacher APIs
export const teacherAPI = {
  register: (data) => API.post('/teacher/register', data),
  login: (data) => API.post('/teacher/login', data),
  getDashboard: () => API.get('/teacher/dashboard'),
};

// Student APIs
export const studentAPI = {
  login: (data) => API.post('/student/login', data),
  create: (data) => API.post('/student/create', data),
  getAll: (params) => API.get('/student/all', { params }),
  getById: (id) => API.get(`/student/${id}`),
  update: (id, data) => API.put(`/student/update/${id}`, data),
  delete: (id) => API.delete(`/student/delete/${id}`),
};

// Subject APIs
export const subjectAPI = {
  create: (data) => API.post('/subject/create', data),
  getAll: () => API.get('/subject/all'),
  getByClass: (className) => API.get(`/subject/class/${className}`),
  seed: () => API.post('/subject/seed'),
  delete: (id) => API.delete(`/subject/${id}`),
};

// Result APIs
export const resultAPI = {
  add: (data) => API.post('/result/add', data),
  getByStudent: (studentId) => API.get(`/result/student/${studentId}`),
  getAll: () => API.get('/result/all'),
  delete: (id) => API.delete(`/result/${id}`),
};

export default API;
