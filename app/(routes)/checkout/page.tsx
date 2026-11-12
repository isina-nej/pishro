import { Suspense } from "react";
import CheckoutPageContent from "@/components/checkout/pageContent";
import CheckoutRouteFallback from "@/components/checkout/routeFallback";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutRouteFallback label="در حال آماده‌سازی سبد خرید" />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
