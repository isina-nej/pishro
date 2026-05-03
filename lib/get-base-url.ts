/**
 * Get the base URL for the pishro2 application
 * Used for API calls and external references
 */
export function getBaseUrl(): string {
  // Server-side: use environment variable
  if (typeof window === "undefined") {
    // Production
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      return process.env.NEXT_PUBLIC_BASE_URL;
    }
    // Fallback for development
    return "http://localhost:3000";
  }

  // Client-side: use window.location or environment variable
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  return window.location.origin;
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
