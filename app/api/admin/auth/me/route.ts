/**
 * Admin Current User API Route
 * GET /api/admin/auth/me
 * 
 * Returns the current authenticated admin user information
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuthFromRequest, getAdminUserById } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user from headers
    const user = getAdminAuthFromRequest(req);

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'unauthorized',
        },
        { status: 401 }
      );
    }

    // Verify user still exists and is active
    const currentUser = await getAdminUserById(user.id);

    if (!currentUser) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'user_not_found',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        user: currentUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      {
        error: 'An error occurred',
        code: 'server_error',
      },
      { status: 500 }
    );
  }
}
