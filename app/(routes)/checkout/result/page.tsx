import { Suspense } from "react";
import Result from "@/components/checkout/result";

const CheckoutResultPage = () => {
  return (
    <div className="pt-20">
      <Suspense
        fallback={<div className="text-center py-20">در حال بارگذاری...</div>}
      >
        <Result />
      </Suspense>
    </div>
  );
};

export default CheckoutResultPage;
