import { Suspense } from "react";
import CheckoutPageContent from "@/components/checkout/pageContent";

const CheckoutPage = () => {
  return <Suspense fallback={<div className="min-h-screen" />}><CheckoutPageContent /></Suspense>;
};

export default CheckoutPage;
