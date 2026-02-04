
import axios from 'axios';
import { API_BASE_URL } from '../utils/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.hash !== '#/login' && window.location.hash !== '#/signup') {
        window.location.hash = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
