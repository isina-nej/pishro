import test from "node:test";
import assert from "node:assert/strict";
import { isProductionPaymentBlocked } from "../lib/payment/index";
import { isMockSmsAllowed } from "../lib/sms";

test("production blocks simulated and sandbox gateways", () => {
  assert.equal(isProductionPaymentBlocked("test", false, "production"), true);
  assert.equal(isProductionPaymentBlocked("zibal", true, "production"), true);
  assert.equal(isProductionPaymentBlocked("zarinpal", false, "production"), false);
  assert.equal(isProductionPaymentBlocked("test", false, "development"), false);
});

test("mock SMS cannot be used in production", () => {
  assert.equal(isMockSmsAllowed("production"), false);
  assert.equal(isMockSmsAllowed("development"), true);
});
