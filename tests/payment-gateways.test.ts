import test, { mock } from "node:test";
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

// Zibal: all gateway calls are mocked — no network and no real transaction.
function mockZibal(handler: (path: string, body: Record<string, unknown>) => unknown) {
  return mock.method(globalThis, "fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
    const path = String(input);
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    const result = handler(path, body);
    return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });
  });
}

test("zibal request converts Toman to Rial and builds start URL", async () => {
  const fetchMock = mockZibal((path, body) => {
    assert.equal(path, "https://gateway.zibal.ir/v1/request");
    assert.equal(body.merchant, "test-merchant");
    assert.equal(body.amount, 1600000); // 160,000 Toman -> 1,600,000 Rial
    assert.match(String(body.callbackUrl), /^https:\/\//);
    return { result: 100, trackId: 15966442233311, message: "success" };
  });
  try {
    const res = await new ZibalAdapter().requestPayment(
      {
        orderId: "order-1",
        amount: 160000,
        callbackUrl: "https://example.com/api/payment/verify?orderId=order-1",
        description: "Test",
      },
      { apiKey: "test-merchant", sandbox: false }
    );
    assert.equal(res.success, true);
    assert.equal(res.authority, "15966442233311");
    assert.equal(res.payUrl, "https://gateway.zibal.ir/start/15966442233311");
  } finally {
    fetchMock.mock.restore();
  }
});

test("zibal sandbox uses the public test merchant", async () => {
  const fetchMock = mockZibal((_path, body) => {
    assert.equal(body.merchant, "zibal");
    return { result: 100, trackId: 42 };
  });
  try {
    const res = await new ZibalAdapter().requestPayment(
      { orderId: "order-1", amount: 1000, callbackUrl: "https://example.com/cb", description: "T" },
      { apiKey: "", sandbox: true }
    );
    assert.equal(res.success, true);
  } finally {
    fetchMock.mock.restore();
  }
});

test("zibal verify rejects callbacks whose trackId is not this order's authority", async () => {
  const fetchMock = mockZibal(() => { throw new Error("network must not be called"); });
  try {
    const res = await new ZibalAdapter().verifyPayment(
      { orderId: "order-1", amount: 50000, authority: "111", params: { success: "1", trackId: "999" } },
      { apiKey: "m", sandbox: false }
    );
    assert.equal(res.success, false);
    assert.equal(res.retryable, true);
  } finally {
    fetchMock.mock.restore();
  }
});

test("zibal verify fulfills only after inquiry matches amount and orderId", async () => {
  const fetchMock = mockZibal((path) => {
    if (path.endsWith("/v1/inquiry")) {
      return { result: 100, status: 1, trackId: 111, amount: 500000, orderId: "order-1", refNumber: 12312, cardNumber: "62741****44" };
    }
    throw new Error(`unexpected call ${path}`);
  });
  try {
    const ok = await new ZibalAdapter().verifyPayment(
      { orderId: "order-1", amount: 50000, authority: "111", params: { success: "1", trackId: "111" } },
      { apiKey: "m", sandbox: false }
    );
    assert.equal(ok.success, true);
    assert.equal(ok.refNumber, "12312");

    const wrongAmount = await new ZibalAdapter().verifyPayment(
      { orderId: "order-1", amount: 77777, authority: "111", params: { success: "1", trackId: "111" } },
      { apiKey: "m", sandbox: false }
    );
    assert.equal(wrongAmount.success, false);
    assert.equal(wrongAmount.retryable, true);
  } finally {
    fetchMock.mock.restore();
  }
});

test("zibal verify checks unpaid/cancelled status before declaring failure", async () => {
  const fetchMock = mockZibal(() => ({ result: 100, status: 3, trackId: 111, amount: 500000, orderId: "order-1" }));
  try {
    const res = await new ZibalAdapter().verifyPayment(
      { orderId: "order-1", amount: 50000, authority: "111", params: { success: "0", trackId: "111" } },
      { apiKey: "m", sandbox: false }
    );
    assert.equal(res.success, false);
    assert.equal(res.retryable, undefined);
  } finally {
    fetchMock.mock.restore();
  }
});

test("zibal verify stays retryable when gateway is unreachable", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () => { throw new Error("offline"); });
  try {
    const res = await new ZibalAdapter().verifyPayment(
      { orderId: "order-1", amount: 50000, authority: "111", params: { success: "1", trackId: "111" } },
      { apiKey: "m", sandbox: false }
    );
    assert.equal(res.success, false);
    assert.equal(res.retryable, true);
  } finally {
    fetchMock.mock.restore();
  }
});
