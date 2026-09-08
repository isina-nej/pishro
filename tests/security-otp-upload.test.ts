import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  OTP_LENGTH,
  checkOtpResendCooldown,
  checkOtpVerifyAllowed,
  clearOtpFailures,
  generateOtpCode,
  recordOtpFailure,
  recordOtpSend,
} from "@/lib/otp";
import { detectImageType } from "@/lib/upload-validation";
import { getCorsHeaders } from "@/lib/cors";

describe("OTP hardening (Mantis #3)", () => {
  it("generates 6-digit CSPRNG codes", () => {
    assert.equal(OTP_LENGTH, 6);
    for (let i = 0; i < 20; i++) {
      const code = generateOtpCode();
      assert.match(code, /^\d{6}$/);
    }
    // Uniqueness sanity: 20 draws should not all collide
    const set = new Set(Array.from({ length: 20 }, () => generateOtpCode()));
    assert.ok(set.size > 1);
  });

  it("enforces resend cooldown per phone", () => {
    const phone = `09${Math.floor(100000000 + Math.random() * 899999999)}`;
    assert.equal(checkOtpResendCooldown(phone).allowed, true);
    recordOtpSend(phone);
    assert.equal(checkOtpResendCooldown(phone).allowed, false);
  });

  it("blocks verify after 5 failures, recovers after clear", () => {
    const phone = `09${Math.floor(100000000 + Math.random() * 899999999)}`;
    for (let i = 0; i < 5; i++) recordOtpFailure(phone);
    const gate = checkOtpVerifyAllowed(phone);
    assert.equal(gate.allowed, false);
    assert.ok(gate.retryAfterMs > 0);
    clearOtpFailures(phone);
    assert.equal(checkOtpVerifyAllowed(phone).allowed, true);
  });
});

describe("avatar upload validation (Mantis #5)", () => {
  it("accepts real jpeg/png/webp by magic bytes", () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const png = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0,
    ]);
    const webp = Buffer.concat([
      Buffer.from("RIFF", "ascii"),
      Buffer.alloc(4),
      Buffer.from("WEBP", "ascii"),
    ]);
    assert.equal(detectImageType(jpeg)?.ext, "jpg");
    assert.equal(detectImageType(png)?.ext, "png");
    assert.equal(detectImageType(webp)?.ext, "webp");
  });

  it("rejects svg masquerading as image", () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg">');
    assert.equal(detectImageType(svg), null);
    assert.equal(detectImageType(Buffer.alloc(4)), null);
  });
});

describe("CORS fail-closed (Mantis #8)", () => {
  it("sets ACAO + credentials for allowed origins", () => {
    const headers = getCorsHeaders(
      "https://pishro-admin.vercel.app"
    ) as Record<string, string>;
    assert.equal(
      headers["Access-Control-Allow-Origin"],
      "https://pishro-admin.vercel.app"
    );
    assert.equal(headers["Access-Control-Allow-Credentials"], "true");
  });

  it("omits ACAO and credentials for unknown origins", () => {
    const headers = getCorsHeaders("https://evil.example") as Record<
      string,
      string
    >;
    assert.ok(!("Access-Control-Allow-Origin" in headers));
    assert.ok(!("Access-Control-Allow-Credentials" in headers));
  });

  it("omits ACAO when origin is missing", () => {
    const headers = getCorsHeaders(null) as Record<string, string>;
    assert.ok(!("Access-Control-Allow-Origin" in headers));
  });
});
