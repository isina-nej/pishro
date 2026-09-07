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
