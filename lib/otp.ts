import { randomInt } from "crypto";

/** OTP length for SMS codes (signup + password reset share the Otp table). */
export const OTP_LENGTH = 6;
/** Cooldown between OTP re-sends for the same phone. */
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

const otpSendTimestamps = new Map<string, number>();

/** CSPRNG numeric code — never Math.random (10k brute-force space). */
export function generateOtpCode(length: number = OTP_LENGTH): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += randomInt(0, 10).toString();
  }
  return code;
}

export function checkOtpResendCooldown(phone: string): {
  allowed: boolean;
  retryAfterMs: number;
} {
  const last = otpSendTimestamps.get(phone);
  if (!last) return { allowed: true, retryAfterMs: 0 };
  const retryAfterMs = last + OTP_RESEND_COOLDOWN_MS - Date.now();
  if (retryAfterMs <= 0) return { allowed: true, retryAfterMs: 0 };
  return { allowed: false, retryAfterMs };
}

export function recordOtpSend(phone: string): void {
  otpSendTimestamps.set(phone, Date.now());
}

/** Verify-attempt limiting — 6-digit codes fall to brute force without it. */
export const OTP_MAX_VERIFY_ATTEMPTS = 5;
export const OTP_VERIFY_BLOCK_MS = 15 * 60 * 1000;

const otpFailures = new Map<string, { count: number; blockedUntil: number }>();

export function checkOtpVerifyAllowed(phone: string): {
  allowed: boolean;
  retryAfterMs: number;
} {
  const entry = otpFailures.get(phone);
  if (!entry) return { allowed: true, retryAfterMs: 0 };
  const retryAfterMs = entry.blockedUntil - Date.now();
  if (entry.blockedUntil > 0 && retryAfterMs > 0) {
    return { allowed: false, retryAfterMs };
  }
  return { allowed: true, retryAfterMs: 0 };
}

export function recordOtpFailure(phone: string): void {
  const entry = otpFailures.get(phone) ?? { count: 0, blockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= OTP_MAX_VERIFY_ATTEMPTS) {
    entry.blockedUntil = Date.now() + OTP_VERIFY_BLOCK_MS;
    entry.count = 0;
  }
  otpFailures.set(phone, entry);
}

export function clearOtpFailures(phone: string): void {
  otpFailures.delete(phone);
}
