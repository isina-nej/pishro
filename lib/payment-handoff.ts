/**
 * Keep gateway tokens out of the browser URL, history and referrer headers.
 * A handoff is created only from the authenticated checkout API response.
 */
export const PAYMENT_HANDOFF_KEY = "pishro:payment-handoff:v1";
const HANDOFF_TTL_MS = 5 * 60 * 1000;

type PaymentHandoff = { orderId: string; payUrl: string; createdAt: number };

export function isSafePaymentDestination(payUrl: string, siteOrigin: string): boolean {
  try {
    const url = new URL(payUrl);
    if (!url.hostname || url.username || url.password) return false;
    if (url.protocol === "https:") return true;
    const origin = new URL(siteOrigin);
    const local = origin.hostname === "localhost" || origin.hostname === "127.0.0.1";
    return local && url.protocol === "http:" && url.origin === origin.origin;
  } catch {
    return false;
  }
}

export function serializePaymentHandoff(
  orderId: string,
  payUrl: string,
  siteOrigin: string,
  now = Date.now()
): string | null {
  if (!orderId || orderId.length > 256 || !isSafePaymentDestination(payUrl, siteOrigin)) return null;
  return JSON.stringify({ orderId, payUrl, createdAt: now } satisfies PaymentHandoff);
}

export function readPaymentHandoff(
  raw: string | null,
  orderId: string | null,
  siteOrigin: string,
  now = Date.now()
): PaymentHandoff | null {
  if (!raw || !orderId) return null;
  try {
    const handoff = JSON.parse(raw) as Partial<PaymentHandoff>;
    if (handoff.orderId !== orderId || typeof handoff.payUrl !== "string" ||
        typeof handoff.createdAt !== "number" ||
        now < handoff.createdAt || now - handoff.createdAt > HANDOFF_TTL_MS ||
        !isSafePaymentDestination(handoff.payUrl, siteOrigin)) return null;
    return handoff as PaymentHandoff;
  } catch {
    return null;
  }
}
