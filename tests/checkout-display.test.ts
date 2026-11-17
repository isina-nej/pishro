import assert from "node:assert/strict";
import { test } from "node:test";
import type { CartItem } from "../stores/cart-store";
import { displayCartPricing, displayItemPricing } from "../lib/checkout-display";

const course = (price: number, discountPercent: number) =>
  ({ id: "course", price, discountPercent, subject: "آموزش" }) as CartItem;

test("cart course price is the original price; discount is applied exactly once", () => {
  const pricing = displayItemPricing(course(1000000, 20));
  assert.deepEqual(pricing, {
    original: 1000000, final: 800000, saved: 200000, discountPercent: 20,
  });
});

test("checkout display total agrees with API pricing for mixed discounted courses", () => {
  const portfolio = { id: "invest", type: "portfolio", price: 500000 } as CartItem;
  const items = [course(1000000, 20), course(125001, 15), portfolio];
  const total = displayCartPricing(items);
  const apiFormula = (price: number, discount: number) =>
    Math.round(price * (1 - discount / 100));
  const expectedPayable = apiFormula(1000000, 20) + apiFormula(125001, 15) + 500000;
  assert.equal(total.lastPrice, expectedPayable);
  assert.equal(total.price - total.off, total.lastPrice);
});

test("zero and 100% discounts are finite and deterministic", () => {
  assert.equal(displayItemPricing(course(100000, 0)).final, 100000);
  assert.equal(displayItemPricing(course(100000, 100)).final, 0);
  assert.equal(displayItemPricing(course(100000, Number.NaN)).final, 100000);
});
