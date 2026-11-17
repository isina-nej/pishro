import assert from "node:assert/strict";
import { test } from "node:test";
import {
  serializePaymentHandoff, readPaymentHandoff, isSafePaymentDestination,
} from "../lib/payment-handoff";

const origin = "https://pishrosarmaye.com";

test("payment handoff is scoped to its original order and expires", () => {
  const json = serializePaymentHandoff("order-123", "https://gateway.zibal.ir/start/1234", origin, 1000);
  assert.ok(json);
  const handoff = readPaymentHandoff(json, "order-123", origin, 1500);
  assert.equal(handoff?.orderId, "order-123");
  assert.equal(handoff?.payUrl, "https://gateway.zibal.ir/start/1234");
  assert.equal(readPaymentHandoff(json, "other-order", origin, 1500), null);
  assert.equal(readPaymentHandoff(json, "order-123", origin, 1000 + 5 * 60 * 1000 + 1), null);
  assert.equal(readPaymentHandoff(json, "order-123", origin, 999), null);
});

test("rejects untrusted URL schemes, credentials and production http", () => {
  for (const url of [
    "javascript:alert(1)", "data:text/html,hello", "http://gateway.zibal.ir/start/123",
    "https://alice:password@example.com/pay", "//malicious.example/pay", "/api/verify",
  ]) {
    assert.equal(isSafePaymentDestination(url, origin), false);
    assert.equal(serializePaymentHandoff("order-123", url, origin), null);
  }
});

test("mock callback is supported in production HTTPS and on local development HTTP", () => {
  assert.equal(isSafePaymentDestination(origin + "/api/payment/verify?orderId=1", origin), true);
  assert.equal(isSafePaymentDestination("http://localhost:3000/api/payment/verify",
    "http://localhost:3000"), true);
  assert.equal(isSafePaymentDestination("http://evil.example/api/payment/verify",
    "http://localhost:3000"), false);
});

test("invalid, missing, malformed and reused handoffs cannot navigate", () => {
  assert.equal(readPaymentHandoff(null, "order-123", origin), null);
  assert.equal(readPaymentHandoff("not-json", "order-123", origin), null);
  assert.equal(readPaymentHandoff(JSON.stringify({
    orderId: "order-123", payUrl: "javascript:alert(1)", createdAt: Date.now(),
  }), "order-123", origin), null);
});
