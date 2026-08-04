import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from '@/lib/cors';

const publicRoutes = ['/admin/login'];

function getAdminTokenFromRequest(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('admin_access_token')?.value;
  if (cookieToken) return cookieToken;

  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return null;
}

function withPathname(request: NextRequest): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Handle global CORS preflight for API routes
  if (method === 'OPTIONS' && pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
      status: 204,
      headers: getCorsHeaders(origin),
    });
  }

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return withPathname(request);
  }

  if (pathname === '/admin') {
    const token = getAdminTokenFromRequest(request);
    const target = token ? '/admin/dashboard' : '/admin/login';
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (publicRoutes.some(route => pathname === route)) {
    const token = getAdminTokenFromRequest(request);
    if (token) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return withPathname(request);
  }

  const isProtectedRoute =
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/api/admin/auth/me') ||
    pathname.startsWith('/api/admin/auth/refresh') ||
    (pathname.startsWith('/api/admin') && !pathname.includes('/login') && !pathname.includes('/logout'));

  if (isProtectedRoute) {
    const token = getAdminTokenFromRequest(request);

    if (!token) {
      // Admin UI pages: hard redirect so unauthenticated visitors never render the shell.
      if (pathname.startsWith('/admin/') && !pathname.startsWith('/api')) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.json(
        { error: 'Unauthorized', code: 'unauthorized' },
        { status: 401 }
      );
    }
  }

  return withPathname(request);
}

export const config = {
  matcher: [
    /*
     * All app routes except static assets — so x-pathname is available
     * for server-side hidden-page checks, while admin auth still runs.
     */
    '/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
};
