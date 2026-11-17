import { Suspense } from "react";
import PaymentProcessing from "@/components/checkout/paymentProcessing";
import CheckoutRouteFallback from "@/components/checkout/routeFallback";

export default function ProcessingPage() {
  return (
    <div className="pt-20">
      <Suspense fallback={<CheckoutRouteFallback label="در حال آماده‌سازی انتقال به درگاه" />}>
        <PaymentProcessing />
      </Suspense>
    </div>
  );
}
