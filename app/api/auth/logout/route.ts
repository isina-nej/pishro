/**
 * Logout API
 * POST /api/auth/logout
 *
 * Logs out the current user and clears the session.
 */

import { NextRequest } from "next/server";
import { signOut } from "@/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { corsPreflightResponse, addCorsHeaders } from "@/lib/cors";

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req.headers.get("origin"));
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");

  try {
    await signOut({ redirect: false });

    const response = successResponse(
      { loggedOut: true },
      "خروج با موفقیت انجام شد"
    );
    return addCorsHeaders(response, origin);
  } catch (error) {
    console.error("Logout error:", error);
    const response = errorResponse(
      "خطایی در فرآیند خروج رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
    return addCorsHeaders(response, origin);
  }
}
