/**
 * API Security Middleware for News Editor
 * Handles rate limiting, security headers, and request validation
 */

// Rate limiting store (in production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX: Record<string, number> = {
  draft: 30, // 30 saves per minute
  upload: 10, // 10 uploads per minute
  create: 5, // 5 creates per minute
  default: 60, // 60 general requests per minute
};

/**
 * Check rate limit for request
 */
export function checkRateLimit(clientId: string, endpoint: string): { allowed: boolean; remaining: number } {
  let limit = RATE_LIMIT_MAX.default;

  if (endpoint.includes('draft')) limit = RATE_LIMIT_MAX.draft;
  if (endpoint.includes('upload')) limit = RATE_LIMIT_MAX.upload;
  if (endpoint.includes('create')) limit = RATE_LIMIT_MAX.create;

  const now = Date.now();
  const key = `${clientId}:${endpoint}`;
  const record = requestCounts.get(key);

  if (!record || now > record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}

/**
 * Security headers for API responses
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';",
};

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Validate request size
 */
export function validateRequestSize(body: any, maxSize: number = 1048576): boolean {
  const size = JSON.stringify(body).length;
  return size <= maxSize;
}

/**
 * Get client IP address from request headers
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

/**
 * Cleanup expired rate limit records (run periodically)
 */
export function cleanupRateLimitRecords(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime + 60000) {
      // Keep for extra 1 minute after expiration
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => requestCounts.delete(key));
}

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitRecords, 5 * 60 * 1000);
