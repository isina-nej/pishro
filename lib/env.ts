/**
 * خواندن متغیرهای محیطی حساس بدون fallback ناامن در production
 */

export function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name]?.trim();
  if (value) return value;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `[env] متغیر الزامی ${name} در production تنظیم نشده است.`
    );
  }

  if (fallback !== undefined) {
    console.warn(`[env] ${name} missing; using development fallback`);
    return fallback;
  }

  throw new Error(`[env] متغیر الزامی ${name} تنظیم نشده است.`);
}

export function getAuthSecret(): string {
  return requireEnv(
    "NEXTAUTH_SECRET",
    process.env.NODE_ENV === "production" ? undefined : "dev-only-nextauth-secret"
  );
}

export function getVideoTokenSecret(): string {
  return requireEnv(
    "VIDEO_TOKEN_SECRET",
    process.env.NODE_ENV === "production" ? undefined : "dev-only-video-token-secret"
  );
}
