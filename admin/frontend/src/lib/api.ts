import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('seva_admin_token') || localStorage.getItem('katalyst_token');
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
      // If token expired on protected requests, remove and redirect to login
      if (window.location.pathname.startsWith('/dashboard')) {
        localStorage.removeItem('katalyst_token');
        localStorage.removeItem('katalyst_admin');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
