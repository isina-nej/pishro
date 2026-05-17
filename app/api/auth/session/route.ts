/**
 * Session Check API
 * GET /api/auth/session
 *
 * Returns current authenticated user session information.
 * Supports Bearer token authentication from CMS frontend.
 */

import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { queryOne } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { corsPreflightResponse, addCorsHeaders } from "@/lib/cors";

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req.headers.get("origin"));
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");

  try {
    // Get auth from Bearer token
    const adminAuth = await getAdminAuth(req);

    if (!adminAuth) {
      const response = unauthorizedResponse("توکن نامعتبر یا منقضی است");
      return addCorsHeaders(response, origin);
    }

    // Get full user data from database
    const user = await queryOne<any>(
      "SELECT id, phone, role, firstName, lastName, email, phoneVerified, avatarUrl FROM `User` WHERE id = ? AND role = 'ADMIN'",
      [adminAuth.id]
    );

    if (!user) {
      const response = unauthorizedResponse("کاربر یافت نشد");
      return addCorsHeaders(response, origin);
    }

    // Return user session data
    const userData = {
      id: user.id,
      phone: user.phone,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : null,
      email: user.email,
      phoneVerified: user.phoneVerified,
      avatarUrl: user.avatarUrl,
    };

    const response = successResponse(
      { user: userData },
      "سشن فعال است"
    );
    return addCorsHeaders(response, origin);
  } catch (error) {
    console.error("Session check error:", error);
    const response = errorResponse(
      "خطایی در بررسی سشن رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
    return addCorsHeaders(response, origin);
  }
}
