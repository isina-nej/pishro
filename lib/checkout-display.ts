import type { CartItem } from "@/stores/cart-store";

/**
 * Checkout presentation mirrors /api/checkout's database pricing formula:
 * course.price is the ORIGINAL amount; discountPercent is applied once.
 * The API still re-reads all prices from the database before payment.
 */
export function displayItemPricing(item: CartItem) {
  const original = Number.isFinite(item.price) ? Math.max(0, item.price) : 0;
  const rawDiscount = "discountPercent" in item ? Number(item.discountPercent || 0) : 0;
  const discountPercent =
    Number.isFinite(rawDiscount) && rawDiscount > 0 && rawDiscount <= 100
      ? rawDiscount
      : 0;
  const final = discountPercent
    ? Math.round(original * (1 - discountPercent / 100))
    : original;
  return {
    original,
    final,
    saved: original - final,
    discountPercent,
  };
}

export function displayCartPricing(items: readonly CartItem[]) {
  return items.reduce(
    (total, item) => {
      const price = displayItemPricing(item);
      total.price += price.original;
      total.off += price.saved;
      total.lastPrice += price.final;
      return total;
    },
    { price: 0, off: 0, lastPrice: 0 }
  );
}

export function formatCheckoutPrice(value: number) {
  return value.toLocaleString("fa-IR");
}
