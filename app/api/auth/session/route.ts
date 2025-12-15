/**
 * Session Check API
 * GET /api/auth/session
 *
 * Returns current authenticated user session information.
 * Used by CMS to verify authentication status.
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-response";
import { corsPreflightResponse, addCorsHeaders } from "@/lib/cors";

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req.headers.get("origin"));
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");

  try {
    const session = await auth();

    if (!session?.user) {
      const response = unauthorizedResponse("کاربر احراز هویت نشده است");
      return addCorsHeaders(response, origin);
    }

    // Return user session data
    const response = successResponse(
      {
        user: {
          id: session.user.id,
          phone: session.user.phone,
          name: session.user.name,
          role: session.user.role,
        },
      },
      "نشست کاربر فعال است"
    );
    return addCorsHeaders(response, origin);
  } catch (error) {
    console.error("Session check error:", error);
    const response = unauthorizedResponse("خطا در بررسی نشست کاربر");
    return addCorsHeaders(response, origin);
  }
}
