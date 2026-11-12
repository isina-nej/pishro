import assert from "node:assert/strict";
import { test } from "node:test";
import type { CartItem } from "../stores/cart-store";
import { displayCartPricing, displayItemPricing } from "../lib/checkout-display";

const course = (price: number, discountPercent: number) =>
  ({ id: "course", price, discountPercent, subject: "آموزش" }) as CartItem;

test("display price uses cart's final price without applying the discount twice", () => {
  const p = displayItemPricing(course(800000, 20));
  assert.deepEqual(p, { final: 800000, original: 1000000, saved: 200000, discountPercent: 20 });
});

test("cart breakdown always reconciles to the displayed payable amount", () => {
  const portfolio = { id: "invest", type: "portfolio", price: 500000 } as CartItem;
  const total = displayCartPricing([course(800000, 20), portfolio]);
  assert.deepEqual(total, { price: 1500000, off: 200000, lastPrice: 1300000 });
  assert.equal(total.price - total.off, total.lastPrice);
});

test("invalid 100% discount never creates infinite original price", () => {
  const p = displayItemPricing(course(100000, 100));
  assert.equal(p.original, 100000);
  assert.equal(p.saved, 0);
});
