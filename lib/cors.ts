/**
 * CORS utility for API routes
 * Handles CORS headers for cross-origin requests from CMS
 */

import { NextResponse } from "next/server";

/**
 * Get CORS headers for API responses
 * Allows requests from the CMS admin panel
 */
export function getCorsHeaders(origin?: string | null): HeadersInit {
  // List of allowed origins (add your CMS domain here)
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_CMS_URL,
    "http://localhost:3001", // Local CMS development
    "http://localhost:3000", // Same origin
  ].filter(Boolean) as string[];

  // Check if origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);
  const allowOrigin = isAllowedOrigin ? origin : allowedOrigins[0] || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400", // 24 hours
  };
}

/**
 * Create a CORS preflight response
 */
export function corsPreflightResponse(origin?: string | null): NextResponse {
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
  const headers = getCorsHeaders(origin);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
