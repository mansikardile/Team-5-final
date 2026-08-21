import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/student',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('katalyst_student_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/dashboard')) {
        localStorage.removeItem('katalyst_student_token');
        localStorage.removeItem('katalyst_student_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
