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
    // Bearer comes from localStorage (set at login). The cookie twin is
    // httpOnly and unreadable from JS — the browser sends it automatically.
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Drop every client-visible trace of the admin session.
 *
 * The `admin_access_token` cookie MUST be cleared alongside localStorage:
 * `middleware.ts` bounces /admin/login back to /admin/dashboard whenever that
 * cookie merely *exists* (it does not verify it), so leaving a stale cookie
 * behind while the client considers itself logged out deadlocks the panel
 * between the two routes with no way to reach the logout button.
 * The cookie is httpOnly, so only the server clears it (via /logout); here we
 * clear localStorage and fire-and-forget the server logout.
 * `admin_refresh_token` is httpOnly and is cleared server-side by /logout.
 */
export async function clearAdminSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_access_token');
  localStorage.removeItem('admin_user');
  try {
    await fetch('/api/admin/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Logout endpoint unreachable — localStorage is already cleared.
  }
}

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
          clearAdminSession();
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
