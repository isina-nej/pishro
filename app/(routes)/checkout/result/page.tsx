import { Suspense } from "react";
import Result from "@/components/checkout/result";

const CheckoutResultPage = () => {
  return (
    <div className="pt-20">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        }
      >
        <Result />
      </Suspense>
    </div>
  );
};

export default CheckoutResultPage;
