/**
 * Site branding defaults and URL helpers.
 */

export const DEFAULT_LOGO_URL = "/logo/logo.png";
export const DEFAULT_FAVICON_URL = "/logo/logo-square.png";
export const DEFAULT_OG_IMAGE_URL = "/logo/logo.png";
export const DEFAULT_SITE_NAME = "پیشرو سرمایه";
export const DEFAULT_SITE_DESCRIPTION = "پیشرو - آموزش و سرمایه‌گذاری";

export function resolveAssetUrl(
  value: string | null | undefined,
  fallback: string
): string {
  if (value && value.trim()) return value.trim();
  return fallback;
}

/** Absolute URL for metadata (icons / OG). Relative paths become absolute. */
export function toAbsoluteAssetUrl(
  baseUrl: string,
  value: string | null | undefined,
  fallback: string
): string {
  const resolved = resolveAssetUrl(value, fallback);
  if (resolved.startsWith("http://") || resolved.startsWith("https://")) {
    return resolved;
  }
  const base = baseUrl.replace(/\/+$/, "");
  return `${base}${resolved.startsWith("/") ? resolved : `/${resolved}`}`;
}
