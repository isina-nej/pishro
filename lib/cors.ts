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
  // Normalize env-provided allowed origin and other constants
  const envOrigin = (process.env.NEXT_PUBLIC_CMS_URL || "").toString().trim().replace(/^"|"$/g, "").trim();

  const allowedOrigins = [
    envOrigin,
    "http://localhost:3001",
    "http://localhost:3000",
    "https://pishro-admin.vercel.app",
    "https://pishro-0.vercel.app",
    "https://178.239.147.136:3001",
    "http://178.239.147.136:3001",
    "https://admin.pishrosarmaye.com",
    "http://admin.pishrosarmaye.com",
    "https://pishrosarmaye.com",
    "http://pishrosarmaye.com",
    "https://www.pishrosarmaye.com",
    "http://www.pishrosarmaye.com",
    "https://teh-1.s3.poshtiban.com",
  ].filter(Boolean) as string[];

  // If the origin in request matches an allowed origin (exact or startsWith), use it
  const normalizedOrigin = origin?.toString().trim();
  const matchedAllowed = normalizedOrigin && allowedOrigins.some((a) => normalizedOrigin === a || normalizedOrigin.startsWith(a));

  const allowOrigin = matchedAllowed ? normalizedOrigin : allowedOrigins[0] || "*";

  // When using credentials, * is not allowed — we try to return the origin if matched.
  const isWildcard = allowOrigin === "*";

  // Return a set of headers with additional common headers and Vary: Origin for cache safety
  const headers: HeadersInit = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    // Include commonly required headers, and Cookie for credentialed requests
    "Access-Control-Allow-Headers": "Accept, Accept-Language, Content-Type, Authorization, X-Requested-With, X-CSRF-Token",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  // If wildcard and credentials requested, remove wildcard to avoid browser refusal
  if (isWildcard) {
    headers["Access-Control-Allow-Origin"] = "*";
  }

  return headers;
}

// Optional debug logger for CORS origins — only enabled when ENABLE_CORS_DEBUG=true
export function debugCorsOrigin(origin?: string | null) {
  try {
    if (process.env.ENABLE_CORS_DEBUG === "true") {
      console.debug("[CORS] Request origin:", origin);
    }
  } catch (e) {
    // no-op
  }
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
