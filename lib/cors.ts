/**
 * CORS utility for API routes
 * Handles CORS headers for cross-origin requests from CMS
 */

import { NextResponse } from "next/server";
import { getCorsHeaders as utilGetCorsHeaders, debugCorsOrigin as utilDebugCorsOrigin } from "./cors-utils";

/**
 * Get CORS headers for API responses
 * Allows requests from the CMS admin panel
 */
export function getCorsHeaders(origin?: string | null): HeadersInit {
  // Use the pure util to generate headers and cast to HeadersInit
  return utilGetCorsHeaders(origin) as HeadersInit;
}

// Optional debug logger for CORS origins — only enabled when ENABLE_CORS_DEBUG=true
export function debugCorsOrigin(origin?: string | null) {
  return utilDebugCorsOrigin(origin);
}

/**
 * Create a CORS preflight response
 */
export function corsPreflightResponse(origin?: string | null): NextResponse {
  // Optional debug
  if (process.env.ENABLE_CORS_DEBUG === "true") debugCorsOrigin(origin);
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

/**
 * Add CORS headers to an existing response
 */
export function addCorsHeaders(
  response: NextResponse,
  origin?: string | null
): NextResponse {
  if (process.env.ENABLE_CORS_DEBUG === "true") debugCorsOrigin(origin);
  const headers = getCorsHeaders(origin);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
