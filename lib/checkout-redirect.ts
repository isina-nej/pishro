export const checkoutLoginUrl = (returnTo: string) =>
  `/login?${new URLSearchParams({ callbackUrl: returnTo })}`;

export function checkoutResultPath(orderId: string | null, result: string | null) {
  const params = new URLSearchParams();
  if (orderId) params.set("orderId", orderId);
  if (result) params.set("result", result);
  return `/checkout/result${params.size ? `?${params}` : ""}`;
}

export function safeLocalReturnPath(path: string | null, origin: string): string | null {
  if (!path?.startsWith("/")) return null;
  try {
    const url = new URL(path, origin);
    return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : null;
  } catch {
    return null;
  }
}
