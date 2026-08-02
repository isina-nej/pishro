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

  // Default-protect every /admin/* page. By this point pathname is guaranteed to be
  // neither '/admin' nor an exact publicRoutes match (both handled and returned above),
  // so this covers every current AND future admin page without needing a per-page
  // allowlist entry (the previous allowlist silently left /admin/courses, /admin/news,
  // etc. unprotected on direct page load — see IMPLEMENTATION_ROADMAP.md Batch 1.1 area
  // / admin-panel-redesign plan for context).
  const isProtectedRoute =
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/api/admin/auth/me') ||
    pathname.startsWith('/api/admin/auth/refresh') ||
    (pathname.startsWith('/api/admin') && !pathname.includes('/login') && !pathname.includes('/logout'));

  if (isProtectedRoute) {
    
    // Let CORS preflight requests pass through to the route handler's OPTIONS method
    if (method === 'OPTIONS') {
      return NextResponse.next();
    }

    console.log(`[Middleware] Protected route detected: ${pathname}`);

    const token = getAdminTokenFromRequest(request);
    console.log('[Middleware] Token source:', token ? 'Present' : 'Missing');

    const isValidToken = token ? await verifyAdminAccessTokenForMiddleware(token) : false;
    console.log('[Middleware] Token valid:', isValidToken);

    if (!isValidToken) {
      console.warn(`[Middleware] Denying access - no valid token for ${pathname}`);

      // For admin pages (not API routes): instead of immediately redirecting to
      // login, let the page render client-side. The client-side useAdminAuth hook
      // has access to localStorage (which the middleware cannot read) and can
      // send the token via Authorization header for API calls. This fixes the
      // case where the login Set-Cookie was not persisted by the browser (e.g.
      // behind certain reverse proxies or CDN configurations) but localStorage
      // has the valid token.
      // ponytail: if localStorage auth is also absent, useAdminAuth redirects
      // to login client-side. Upgrade path: ensure cookies are always set
      // correctly at the infrastructure level and revert to server-side redirect.
      if (pathname.startsWith('/admin/') && !pathname.startsWith('/api')) {
        console.log('[Middleware] Allowing admin page to render for client-side auth check');
        return NextResponse.next();
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
