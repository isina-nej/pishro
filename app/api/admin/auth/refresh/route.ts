/**
 * Admin Token Refresh API Route
 * POST /api/admin/auth/refresh
 * 
 * Issues a new access token using the refresh token
 * Refresh token should be in httpOnly cookie or request body
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminRefreshToken,
  getAdminUserById,
  createAdminAccessToken,
  createAdminRefreshToken,
} from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    // Get refresh token from cookie or body
    let refreshToken = req.cookies.get('admin_refresh_token')?.value;

    if (!refreshToken) {
      const body = await req.json().catch(() => ({}));
      refreshToken = body.refreshToken;
    }

    if (!refreshToken) {
      return NextResponse.json(
        {
          error: 'Refresh token is required',
          code: 'missing_refresh_token',
        },
        { status: 400 }
      );
    }

    // Verify refresh token
    const userId = verifyAdminRefreshToken(refreshToken);

    if (!userId) {
      return NextResponse.json(
        {
          error: 'Invalid or expired refresh token',
          code: 'invalid_refresh_token',
        },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await getAdminUserById(userId);

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: 'user_not_found',
        },
        { status: 401 }
      );
    }

    // Create new tokens
    const newAccessToken = createAdminAccessToken(user);
    const newRefreshToken = createAdminRefreshToken(user.id);

    const response = NextResponse.json(
      {
        user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 24 * 60 * 60, // 24 hours
      },
      { status: 200 }
    );

    // Update cookies
    response.cookies.set('admin_access_token', newAccessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    response.cookies.set('admin_refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred during token refresh',
        code: 'refresh_error',
      },
      { status: 500 }
    );
  }
}
