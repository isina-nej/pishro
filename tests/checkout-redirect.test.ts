import test from "node:test";
import assert from "node:assert/strict";
import {
  checkoutLoginUrl,
  checkoutResultPath,
  safeLocalReturnPath,
} from "../lib/checkout-redirect";

test("checkout login preserves the pay step and gateway result", () => {
  const login = new URL(checkoutLoginUrl("/checkout?step=pay"), "https://pishrosarmaye.com");
  assert.equal(login.pathname, "/login");
  assert.equal(login.searchParams.get("callbackUrl"), "/checkout?step=pay");

  const result = checkoutResultPath("order/1&x", "success");
  const resultLogin = new URL(checkoutLoginUrl(result), "https://pishrosarmaye.com");
  assert.equal(resultLogin.searchParams.get("callbackUrl"), result);
  assert.equal(new URL(result, "https://pishrosarmaye.com").searchParams.get("orderId"), "order/1&x");
});

test("login accepts only same-origin return paths", () => {
  const origin = "https://pishrosarmaye.com";
  assert.equal(safeLocalReturnPath("/checkout?step=pay", origin), "/checkout?step=pay");
  assert.equal(safeLocalReturnPath("/checkout/result?orderId=1&result=success", origin), "/checkout/result?orderId=1&result=success");
  for (const path of [null, "https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)"]) {
    assert.equal(safeLocalReturnPath(path, origin), null);
  }
});
