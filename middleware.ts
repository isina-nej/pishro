/**
 * Next.js Middleware for Admin Panel Route Protection
 * Validates JWT tokens for protected /admin/* routes
 * Redirects unauthenticated users to login page
 */

import { NextRequest, NextResponse } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/admin/login'];

function verifyToken(token: string): boolean {
  try {
    // Basic token validation - check if it's a non-empty string
    // Full verification is done in the backend API routes
    if (!token || typeof token !== 'string') {
      return false;
    }
    
    // Check if token has valid JWT format (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  
  console.log(`[Middleware] ${method} ${pathname}`);

  // Don't process non-admin routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    console.log('[Middleware] Not an admin route, skipping');
    return NextResponse.next();
  }

  if (pathname === '/admin') {
    const token = request.cookies.get('admin_access_token')?.value;
    const target = token && verifyToken(token) ? '/admin/dashboard' : '/admin/login';

    return NextResponse.redirect(new URL(target, request.url));
  }

  // Allow public routes
  if (publicRoutes.some(route => pathname === route)) {
    console.log('[Middleware] Public route, checking login redirect');
    // If user is already logged in, redirect to dashboard
    const token = request.cookies.get('admin_access_token')?.value;
    
    if (token && verifyToken(token)) {
      const response = NextResponse.redirect(new URL('/admin/dashboard', request.url));
      return response;
    }

    return NextResponse.next();
  }

  // Check for protected routes - include all /admin/block-news and /api/admin routes
  const isProtectedRoute = 
    pathname.startsWith('/admin/dashboard') ||
    pathname.startsWith('/admin/block-news') ||
    pathname.startsWith('/admin/library') ||
    pathname.startsWith('/api/admin/auth/me') ||
    pathname.startsWith('/api/admin/auth/refresh') ||
    (pathname.startsWith('/api/admin') && !pathname.includes('/login') && !pathname.includes('/logout'));

  if (isProtectedRoute) {
    console.log(`[Middleware] Protected route detected: ${pathname}`);
    
    // Get token from cookies or Authorization header
    let token = request.cookies.get('admin_access_token')?.value;
    console.log('[Middleware] Cookie token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      console.log('[Middleware] Authorization header:', authHeader ? `Bearer ${authHeader.slice(7, 20)}...` : 'Missing');
      
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7);
        console.log('[Middleware] Token extracted from header');
      }
    }

    // Verify token exists and has valid format
    const isValidToken = token && verifyToken(token);
    console.log('[Middleware] Token valid:', isValidToken);
    
    if (!isValidToken) {
      console.warn(`[Middleware] Denying access - no valid token for ${pathname}`);
      
      // Redirect to login for page routes
      if (pathname.startsWith('/admin/') && !pathname.startsWith('/api')) {
        const loginUrl = new URL('/admin/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        // Clear cookies
        response.cookies.set('admin_access_token', '', { maxAge: 0 });
        response.cookies.set('admin_refresh_token', '', { maxAge: 0 });
        return response;
      }

      // Return 401 for API routes
      console.log('[Middleware] Returning 401 for API route');
      return NextResponse.json(
        { error: 'Unauthorized', code: 'unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('[Middleware] Token validated, allowing request');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
