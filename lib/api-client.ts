// lib/api-client.ts
// Axios client instance for API calls

import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
  timeout: 10000,
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookie (browser environment only)
    if (typeof window !== 'undefined') {
      let token: string | undefined;
      
      // Try localStorage first (more reliable in browser)
      const storageToken = localStorage.getItem('admin_access_token');
      if (storageToken) {
        token = storageToken;
      } else {
        // Fallback to cookie
        const cookieToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('admin_access_token='))
          ?.split('=')[1];
        token = cookieToken;
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
