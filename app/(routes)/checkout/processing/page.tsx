import { Suspense } from "react";
import PaymentProcessing from "@/components/checkout/paymentProcessing";

const ProcessingPage = () => {
  return (
    <div className="pt-20">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        }
      >
        <PaymentProcessing />
      </Suspense>
    </div>
  );
};

export default ProcessingPage;
