import { NextResponse } from "next/server";

/**
 * CORS helper compatible with older filename `cors-utils.ts` referenced in some builds
 * This file intentionally mirrors `lib/cors.ts` without any eslint-disable directives
 */

export function getCorsHeaders(origin?: string | null): HeadersInit {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_CMS_URL,
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

  const isAllowedOrigin = origin && allowedOrigins.includes(origin);
  const allowOrigin = isAllowedOrigin ? origin : allowedOrigins[0] || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
  };
}

export function corsPreflightResponse(origin?: string | null): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

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
