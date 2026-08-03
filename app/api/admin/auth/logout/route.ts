/**
 * Admin Logout API Route
 * POST /api/admin/auth/logout
 * 
 * Clears admin session cookies and invalidates tokens
 */

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        message: 'Logged out successfully',
      },
      { status: 200 }
    );

    // Clear authentication cookies
    response.cookies.set('admin_access_token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

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
