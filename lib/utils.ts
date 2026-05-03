import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to Persian (Jalali) format
 * @param dateString - ISO date string or Date object
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted Persian date string or fallback text
 */
export function formatDate(
  dateString: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  // Handle null, undefined, or empty string
  if (!dateString) {
    return "تاریخ نامشخص";
  }

  const date = typeof dateString === "string" ? new Date(dateString) : dateString;

  // Check if date is invalid
  if (isNaN(date.getTime())) {
    return "تاریخ نامشخص";
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("fa-IR", options || defaultOptions).format(date);
}

/**
 * Normalize image URL by extracting the original URL from Next.js Image Optimization URLs
 * Supports both new optimized URLs (/_next/image?url=...) and old direct URLs
 * @param url - The image URL to normalize
 * @returns The original image URL
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  // Check if this is a Next.js Image Optimization URL
  if (url.includes("/_next/image?url=")) {
    try {
      // Extract the URL from the query parameter
      const urlObj = new URL(url, "https://example.com"); // Base URL needed for relative URLs
      const originalUrl = urlObj.searchParams.get("url");

      if (originalUrl) {
        // Decode the URL-encoded string
        return decodeURIComponent(originalUrl);
      }
    } catch (error) {
      console.error("Error parsing image URL:", error);
      // If parsing fails, return the original URL
      return url;
    }
  }

  // Return the URL as-is if it's not an optimized URL
  return url;
}
