import { Suspense } from "react";
import PaymentProcessing from "@/components/checkout/paymentProcessing";

const ProcessingPage = () => {
  return (
    <div className="pt-20">
      <Suspense
        fallback={<div className="text-center py-20">در حال بارگذاری...</div>}
      >
        <PaymentProcessing />
      </Suspense>
    </div>
  );
};

export default ProcessingPage;
