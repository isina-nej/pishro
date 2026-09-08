/**
 * Admin Logout API Route
 * POST /api/admin/auth/logout
 * 
 * Clears admin session cookies and invalidates tokens
 */

import { NextResponse } from 'next/server';
import { clearAdminAccessCookie } from '@/lib/admin-cookie';

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        message: 'Logged out successfully',
      },
      { status: 200 }
    );

    // Clear authentication cookies (flags must match the set-cookie)
    clearAdminAccessCookie(response);

    response.cookies.set('admin_refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred during logout',
        code: 'logout_error',
      },
      { status: 500 }
    );
  }
}
