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
    return NextResponse.next();
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
    return NextResponse.next();
  }

  const isProtectedRoute =
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/api/admin/auth/me') ||
    pathname.startsWith('/api/admin/auth/refresh') ||
    (pathname.startsWith('/api/admin') && !pathname.includes('/login') && !pathname.includes('/logout'));

  if (isProtectedRoute) {
    const token = getAdminTokenFromRequest(request);

    if (!token) {
      if (pathname.startsWith('/admin/') && !pathname.startsWith('/api')) {
        return NextResponse.next();
      }

      return NextResponse.json(
        { error: 'Unauthorized', code: 'unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
