// lib/api-client.ts
// Axios client instance for API calls

import axios from 'axios';

export const api = axios.create({
  // Always use the current origin in the browser so requests are same-origin
  // and never trigger CORS preflight (www vs non-www mismatch).
  baseURL: typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
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
      // Only redirect to login for admin API calls — public API 401s should
      // be handled by the calling code, not by a blanket redirect.
      // Also skip if already on the login page to avoid redirect loops.
      if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
        const url = error.config?.url ?? '';
        if (url.includes('/api/admin/')) {
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_user');
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
