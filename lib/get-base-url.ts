/**
 * Get the base URL for the pishro2 application
 * Used for API calls and external references
 */
export function getBaseUrl(): string {
  // Client-side: always use the current origin so requests stay same-origin.
  // Using NEXT_PUBLIC_BASE_URL here breaks when it differs from the page origin
  // in scheme (http vs https → mixed content) or host (www vs non-www → CORS).
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server-side: use environment variable
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return normalizeScheme(process.env.NEXT_PUBLIC_BASE_URL);
  }
  // Fallback for development
  return "http://localhost:3000";
}

/**
 * Force https for non-local hosts so a misconfigured env var can't produce
 * insecure URLs in production.
 */
function normalizeScheme(url: string): string {
  const trimmed = url.replace(/\/+$/, "");
  if (!trimmed.startsWith("http://")) return trimmed;
  const host = trimmed.slice("http://".length);
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:|$)/.test(host)) {
    return trimmed;
  }
  return `https://${host}`;
}

/**
 * Get the upload service URL
 * This is used for file uploads and retrievals
 */
export function getUploadUrl(): string {
  return getBaseUrl();
}

/**
 * Get full URL for an upload path
 */
export function getUploadPath(path: string): string {
  const baseUrl = getUploadUrl();
  if (path.startsWith("http")) {
    return path;
  }
  return `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;
}
