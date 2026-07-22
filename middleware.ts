/**
 * Next.js Middleware for Admin Panel Route Protection
 * Validates JWT tokens for protected /admin/* routes
 * Redirects unauthenticated users to login page
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminTokenFromRequest, verifyAdminAccessTokenForMiddleware } from '@/lib/admin-jwt';

// Routes that don't require authentication
const publicRoutes = ['/admin/login'];

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
    const token = getAdminTokenFromRequest(request);
    const target = token && await verifyAdminAccessTokenForMiddleware(token) ? '/admin/dashboard' : '/admin/login';

    return NextResponse.redirect(new URL(target, request.url));
  }

  // Allow public routes
  if (publicRoutes.some(route => pathname === route)) {
    console.log('[Middleware] Public route, checking login redirect');
    const token = getAdminTokenFromRequest(request);

    if (token && await verifyAdminAccessTokenForMiddleware(token)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    const response = NextResponse.next();
    if (token) {
      response.cookies.set('admin_access_token', '', { maxAge: 0, path: '/' });
      response.cookies.set('admin_refresh_token', '', { maxAge: 0, path: '/' });
    }
    return response;
  }

  const isProtectedRoute = 
    pathname.startsWith('/admin/dashboard') ||
    pathname.startsWith('/admin/block-news') ||
    pathname.startsWith('/admin/library') ||
    pathname.startsWith('/api/admin/auth/me') ||
    pathname.startsWith('/api/admin/auth/refresh') ||
    (pathname.startsWith('/api/admin') && !pathname.includes('/login') && !pathname.includes('/logout'));

  if (isProtectedRoute) {
    console.log(`[Middleware] Protected route detected: ${pathname}`);

    const token = getAdminTokenFromRequest(request);
    console.log('[Middleware] Token source:', token ? 'Present' : 'Missing');

    const isValidToken = token ? await verifyAdminAccessTokenForMiddleware(token) : false;
    console.log('[Middleware] Token valid:', isValidToken);

    if (!isValidToken) {
      console.warn(`[Middleware] Denying access - no valid token for ${pathname}`);

      if (pathname.startsWith('/admin/') && !pathname.startsWith('/api')) {
        const loginUrl = new URL('/admin/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.set('admin_access_token', '', { maxAge: 0 });
        response.cookies.set('admin_refresh_token', '', { maxAge: 0 });
        return response;
      }

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
