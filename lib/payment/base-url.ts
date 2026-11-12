/** Only a server-owned, HTTPS base URL is trusted for payment callbacks in production. */
export function resolvePaymentBaseUrl(
  configured: string | undefined,
  requestOrigin: string | null,
  environment: string | undefined = process.env.NODE_ENV
): string {
  const raw = configured?.trim();
  if (environment === "production" && !raw) {
    throw new Error("NEXT_PUBLIC_BASE_URL must be configured for payment callbacks in production");
  }
  const chosen = raw || requestOrigin || "http://localhost:3000";
  let parsed: URL;
  try {
    parsed = new URL(chosen);
  } catch {
    throw new Error("Invalid payment callback base URL");
  }
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password ||
      parsed.pathname !== "/" || parsed.search || parsed.hash ||
      (environment === "production" && parsed.protocol !== "https:")) {
    throw new Error("Payment callback base URL must be an HTTPS origin in production");
  }
  return parsed.origin;
}
