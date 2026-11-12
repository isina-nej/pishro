import type { CartItem } from "@/stores/cart-store";

/** Presentation-only breakdown. Checkout totals are still authorized by the API. */
export function displayItemPricing(item: CartItem) {
  const final = Number.isFinite(item.price) ? Math.max(0, item.price) : 0;
  const rawDiscount = "discountPercent" in item ? Number(item.discountPercent || 0) : 0;
  // Treat 100% and malformed percentages as "no comparable original price".
  const discountPercent = Number.isFinite(rawDiscount) && rawDiscount > 0 && rawDiscount < 100
    ? rawDiscount
    : 0;
  const original = discountPercent
    ? Math.round(final / (1 - discountPercent / 100))
    : final;
  return {
    final,
    original,
    saved: Math.max(0, original - final),
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
