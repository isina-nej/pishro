import { NextResponse } from "next/server";
import { debugCorsOrigin } from "./lib/cors";
import type { NextRequest } from "next/server";

/**
 * لیست دامنه‌های مجاز برای CORS
 * شامل محیط توسعه (localhost) و پروداکشن (vercel)
 */
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
].filter(Boolean);

/**
 * بررسی می‌کند که آیا origin درخواست در لیست مجاز است یا نه
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return allowedOrigins.some(
    (allowed) => origin === allowed || origin.startsWith(allowed)
  );
}

/**
 * افزودن هدرهای CORS به response
 */
function addCorsHeaders(response: NextResponse, origin: string | null) {
  // Choose an allowed origin (use request origin if allowed, otherwise fallback to first env origin or wildcard)
  const normalizedOrigin = origin?.toString().trim();
  const matchedOrigin = normalizedOrigin && isAllowedOrigin(normalizedOrigin) ? normalizedOrigin : allowedOrigins[0] || "*";

  // Optional: log origin for debugging if enabled
  if (normalizedOrigin && process.env.ENABLE_CORS_DEBUG === "true") {
    debugCorsOrigin(normalizedOrigin);
    if (!isAllowedOrigin(normalizedOrigin)) {
      console.warn(`[CORS Warning] Request origin not allowed: ${normalizedOrigin}`);
    }
  }

  response.headers.set("Access-Control-Allow-Origin", matchedOrigin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Accept, Accept-Language, Content-Type, Authorization, X-Requested-With, X-CSRF-Token"
  );
  response.headers.set("Vary", "Origin");
  return response;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin");

  // Handle preflight requests (OPTIONS)
  if (req.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    return addCorsHeaders(response, origin);
  }

  // Handle API routes with CORS
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    return addCorsHeaders(response, origin);
  }

  // اگر مسیر دقیقا برابر /profile بود، به /profile/acc ریدایرکت کن
  if (pathname === "/profile") {
    const url = req.nextUrl.clone();
    url.pathname = "/profile/acc";
    const response = NextResponse.redirect(url);
    return addCorsHeaders(response, origin);
  }

  // برای بقیه requestها، CORS headers اضافه کن
  const response = NextResponse.next();
  return addCorsHeaders(response, origin);
}

// مشخص کردن matcher برای اعمال middleware
export const config = {
  matcher: [
    "/profile/:path*",
    "/api/:path*", // تمام API routes
  ],
};
