"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import CheckoutSidebar from "./sidebar";
import ShoppingCartMain from "./shoppingCartMain";
import PayMain from "./payMain";
import Result from "./result";
import { useCartStore } from "@/stores/cart-store";

const CheckoutPageContent = () => {
  const [step, setStep] = useState<"shoppingCart" | "pay" | "result">(
    "shoppingCart"
  );

  // 🛒 گرفتن داده از استور
  const { items } = useCartStore();

  // 🧮 محاسبه قیمت‌ها
  const priceSummary = useMemo(() => {
    const price = items.reduce((sum, i) => sum + i.price, 0);
    const off = items.reduce(
      (sum, i) =>
        sum + (i.discountPercent ? (i.price * i.discountPercent) / 100 : 0),
      0
    );
    const lastPrice = price - off;
    return { price, off, lastPrice };
  }, [items]);

  return (
    <div className="container-xl pt-12">
      {/* header */}
      <div className="flex justify-between pb-1 mt-12">
        <h4 className="font-iransans font-semibold text-lg text-[#333333]">
          {step === "shoppingCart" && "سبد خرید"}
          {step === "pay" && "پرداخت"}
          {step === "result" && "تکمیل فرایند خرید"}
        </h4>

        {step === "shoppingCart" && (
          <Button
            onClick={() => setStep("pay")}
            className="px-16"
            disabled={items.length === 0}
          >
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
        {step === "shoppingCart" && <ShoppingCartMain data={items} />}
        {step === "pay" && <PayMain />}
        {step === "result" && <Result />}
        <CheckoutSidebar data={priceSummary} setStep={setStep} step={step} />
      </div>
    </div>
  );
};

export default CheckoutPageContent;
