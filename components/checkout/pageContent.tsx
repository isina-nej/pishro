"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CheckoutSidebar from "./sidebar";
import ShoppingCartMain from "./shoppingCartMain";
import PayMain from "./payMain";

const tempData = {
  price: 19400000,
  off: 1400000,
  lastPrice: 18000000,
};

const mainData = [
  {
    title: "عنوان دوره",
    image: "/",
    price: 4100000,
  },
  {
    title: "2 عنوان دوره",
    image: "/",
    price: 4100000,
  },
];

const CheckoutPageContent = () => {
  const [step, setStep] = useState<"shoppingCart" | "pay">("shoppingCart");
  return (
    <div className="container-xl">
      {/* header */}
      <div className="flex justify-between shadow-sm pb-1 mt-12">
        <h4 className="font-iransans font-semibold text-lg text-[#333333]">
          {step === "shoppingCart" ? "سبد خرید" : "پرداخت"}
        </h4>
        {step === "shoppingCart" && (
          <Button onClick={() => setStep("pay")} className="px-16">
            ادامه
          </Button>
        )}
        {step === "pay" && (
          <Button onClick={() => setStep("shoppingCart")} className="px-16">
            بازگشت
          </Button>
        )}
      </div>
      {/* body */}
      <div className="flex justify-between gap-20 mt-8">
        {step === "shoppingCart" && <ShoppingCartMain data={mainData} />}
        {step === "pay" && <PayMain />}
        <CheckoutSidebar data={tempData} setStep={setStep} />
      </div>
    </div>
  );
};

export default CheckoutPageContent;
