/**
 * Utility functions for generating CORS headers without Next.js dependency
 */

export function getCorsHeaders(origin?: string | null): Record<string, string> {
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

  const normalizedOrigin = origin?.toString().trim();
  const matchedAllowed = normalizedOrigin && allowedOrigins.some((a) => normalizedOrigin === a || normalizedOrigin.startsWith(a));
  const allowOrigin = matchedAllowed ? normalizedOrigin : allowedOrigins[0] || "*";
  const isWildcard = allowOrigin === "*";

  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Accept-Language, Content-Type, Authorization, X-Requested-With, X-CSRF-Token",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (isWildcard) headers["Access-Control-Allow-Origin"] = "*";
  return headers;
}

export function debugCorsOrigin(origin?: string | null): void {
  try {
    if (process.env.ENABLE_CORS_DEBUG === "true") {
      // eslint-disable-next-line no-console
      console.debug("[CORS] Request origin:", origin);
    }
  } catch (e) {
    // ignore
  }
}
