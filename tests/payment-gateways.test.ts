import test from "node:test";
import assert from "node:assert/strict";
import {
  SUPPORTED_GATEWAYS,
  getPaymentAdapter,
  MockAdapter,
} from "../lib/payment/index";
import { ZarinpalAdapter } from "../lib/payment/adapters/zarinpal";
import { ZibalAdapter } from "../lib/payment/adapters/zibal";
import { NextPayAdapter } from "../lib/payment/adapters/nextpay";
import { SepAdapter } from "../lib/payment/adapters/sep";

test("payment gateway registry has supported adapters", () => {
  const ids = SUPPORTED_GATEWAYS.map((g) => g.id);
  assert.ok(ids.includes("saman"));
  assert.ok(ids.includes("zarinpal"));
  assert.ok(ids.includes("zibal"));
  assert.ok(ids.includes("nextpay"));
  assert.ok(ids.includes("test"));
});

test("getPaymentAdapter resolves matching adapters", () => {
  assert.ok(getPaymentAdapter("saman") instanceof SepAdapter);
  assert.ok(getPaymentAdapter("zarinpal") instanceof ZarinpalAdapter);
  assert.ok(getPaymentAdapter("zibal") instanceof ZibalAdapter);
  assert.ok(getPaymentAdapter("nextpay") instanceof NextPayAdapter);
  assert.ok(getPaymentAdapter("test") instanceof MockAdapter);
  assert.ok(getPaymentAdapter("unknown") instanceof ZarinpalAdapter); // fallback
});

test("saman adapter rejects user-cancelled callbacks without network", async () => {
  const adapter = new SepAdapter();
  const res = await adapter.verifyPayment(
    {
      orderId: "order-sep-1",
      amount: 50000,
      params: { State: "Failed", Status: "3", RefNum: "" },
    },
    { apiKey: "12345678", sandbox: false }
  );
  assert.equal(res.success, false);
});

test("saman adapter requires terminal id for token request", async () => {
  const adapter = new SepAdapter();
  const res = await adapter.requestPayment(
    {
      orderId: "order-sep-1",
      amount: 50000,
      callbackUrl: "https://example.com/api/payment/verify?orderId=order-sep-1",
      description: "Test Order",
    },
    { apiKey: "", sandbox: false }
  );
  assert.equal(res.success, false);
  assert.match(res.errorMessage || "", /ترمینال/);
});

test("mock adapter handles request and verify lifecycle", async () => {
  const adapter = new MockAdapter();
  const req = await adapter.requestPayment(
    {
      orderId: "order-123",
      amount: 50000,
      callbackUrl: "https://example.com/api/payment/verify",
      description: "Test Order",
    },
    { apiKey: "", sandbox: true }
  );

  assert.equal(req.success, true);
  assert.ok(req.payUrl?.includes("orderId=order-123"));
  assert.ok(req.authority?.startsWith("TEST-"));

  const verifySuccess = await adapter.verifyPayment(
    {
      orderId: "order-123",
      amount: 50000,
      authority: req.authority,
      params: { Status: "OK", success: "1" },
    },
    { apiKey: "", sandbox: true }
  );

  assert.equal(verifySuccess.success, true);
  assert.ok(verifySuccess.refNumber?.startsWith("REF-"));

  const verifyFailed = await adapter.verifyPayment(
    {
      orderId: "order-123",
      amount: 50000,
      authority: req.authority,
      params: { Status: "NOK", success: "0" },
    },
    { apiKey: "", sandbox: true }
  );

  assert.equal(verifyFailed.success, false);
});
