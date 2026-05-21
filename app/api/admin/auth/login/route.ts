/**
 * Admin Login API Route
 * POST /api/admin/auth/login
 * 
 * Request body (one of email or phone):
 * {
 *   "email": "admin@example.com",
 *   "password": "password123",
 *   "rememberMe": false
 * }
 * OR
 * {
 *   "phone": "09123456789",
 *   "password": "password123",
 *   "rememberMe": false
 * }
 * 
 * Response:
 * {
 *   "user": { "id", "email", "phone", "name", "role" },
 *   "accessToken": "jwt-token",
 *   "refreshToken": "jwt-refresh-token",
 *   "expiresIn": 86400
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminUser, createAdminAccessToken, createAdminRefreshToken } from '@/lib/admin-auth';
import { errorResponse, createdResponse } from '@/lib/api-response';

// Rate limiting state (in-memory, would use Redis in production)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(identifier: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (attempt && now < attempt.resetTime) {
    if (attempt.count >= RATE_LIMIT_ATTEMPTS) {
      return {
        allowed: false,
        message: 'Too many login attempts. Please try again later.',
      };
    }
  }

  return { allowed: true };
}

function recordLoginAttempt(identifier: string) {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (attempt && now < attempt.resetTime) {
    attempt.count += 1;
  } else {
    loginAttempts.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, password, rememberMe } = body;

    // Validation - must have either email or phone
    if (!email && !phone) {
      return NextResponse.json(
        {
          error: 'Email or phone is required',
          code: 'invalid_credentials',
        },
        { status: 400 }
      );
    }

    const identifier = email || phone;

    if (typeof identifier !== 'string') {
      return NextResponse.json(
        {
          error: 'Email or phone must be a string',
          code: 'invalid_format',
        },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        {
          error: 'Password is required',
          code: 'invalid_password',
        },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimitCheck = checkRateLimit(identifier);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: rateLimitCheck.message,
          code: 'rate_limit_exceeded',
        },
        { status: 429 }
      );
    }

    // Authenticate user
    const { user, error, code } = await authenticateAdminUser(email || phone, password);

    if (!user) {
      recordLoginAttempt(email);
      return NextResponse.json(
        {
          error: error || 'Authentication failed',
          code: code || 'auth_failed',
        },
        { status: 401 }
      );
    }

    // Create tokens
    const accessToken = createAdminAccessToken(user);
    const refreshToken = createAdminRefreshToken(user.id);

    // Determine token expiry
    const expiresIn = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 24 hours

    const response = NextResponse.json(
      {
        user,
        accessToken,
        refreshToken,
        expiresIn,
      },
      { status: 200 }
    );

    // Set refresh token in httpOnly cookie
    response.cookies.set('admin_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
      path: '/',
    });

    // Set access token in cookie (readable by client)
    response.cookies.set('admin_access_token', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred during login',
        code: 'server_error',
      },
      { status: 500 }
    );
  }
}
