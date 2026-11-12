import test from "node:test";
import assert from "node:assert/strict";
import { resolvePaymentBaseUrl } from "../lib/payment/base-url";

test("production uses trusted configured callback origin regardless of user headers", () => {
  assert.equal(resolvePaymentBaseUrl("https://pay.example.com", "https://evil.example.com", "production"), "https://pay.example.com");
});
test("production fails closed on missing or invalid callback base URL", () => {
  assert.throws(() => resolvePaymentBaseUrl(undefined, "https://evil.example.com", "production"));
  assert.throws(() => resolvePaymentBaseUrl("http://pay.example.com", null, "production"));
  assert.throws(() => resolvePaymentBaseUrl("https://pay.example.com@evil.example.com", null, "production"));
  assert.throws(() => resolvePaymentBaseUrl("https://pay.example.com/prefix", null, "production"));
});
test("development falls back to request origin", () => {
  assert.equal(resolvePaymentBaseUrl(undefined, "http://localhost:3000", "development"), "http://localhost:3000");
});
