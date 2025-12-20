/**
 * Axios Client - REST API Configuration
 * Base URL: http://localhost:8080/api
 * 
 * Features:
 * - Auto-inject JWT token from localStorage
 * - Response interceptor for direct data access
 * - Error handling with 401 auto-logout
 */

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For HttpOnly cookie (refreshToken)
});

// Request Interceptor: Auto-inject token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vh_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Return data directly & handle errors
axiosClient.interceptors.response.use(
  (response) => {
    // Return data directly for cleaner code
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401) {
      console.warn('Token expired or invalid. Logging out...');
      localStorage.removeItem('vh_access_token');
      localStorage.removeItem('vh_user');
      
      // Redirect to login (only if not already on auth pages)
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/';
      }
    }

    // Handle other errors: surface backend message/reason/status
    const data = error.response?.data || {};
    const reason = data.reasonCode;
    const status = error.response?.status;
    const msg = data.message || data.error || error.message || 'Network error';
    const combined = [reason ? `[${reason}]` : '', msg, status ? `(HTTP ${status})` : ''].filter(Boolean).join(' ');
    const err = new Error(combined);
    err.response = error.response;
    err.data = data;
    return Promise.reject(err);
  }
);

export default axiosClient;
