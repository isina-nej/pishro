"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutSidebar from "./sidebar";
import ShoppingCartMain from "./shoppingCartMain";
import PayMain from "./payMain";
import StepProgress from "./stepProgress";
import EmptyCart from "./emptyCart";
import { useCartStore } from "@/stores/cart-store";
import { useCreateCheckout } from "@/lib/hooks/useCheckout";

const CheckoutPageContent = () => {
  const [step, setStep] = useState<"shoppingCart" | "pay" | "result">(
    "shoppingCart"
  );

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { items, clearCart } = useCartStore();

  // استفاده از React Query mutation
  const createCheckoutMutation = useCreateCheckout();

  // 🧮 محاسبه مجموع قیمت‌ها
  const priceSummary = useMemo(() => {
    let totalFinalPrice = 0;
    let totalDiscountAmount = 0;

    items.forEach((item) => {
      const finalPrice = item.price;
      totalFinalPrice += finalPrice;

      // فقط برای دوره‌ها تخفیف محاسبه می‌شود
      if ("discountPercent" in item && item.discountPercent && item.discountPercent > 0) {
        const originalPrice = Math.round(
          finalPrice / (1 - item.discountPercent / 100)
        );
        totalDiscountAmount += originalPrice - finalPrice;
      }
    });

    return {
      price: totalFinalPrice + totalDiscountAmount,
      off: totalDiscountAmount,
      lastPrice: totalFinalPrice,
    };
  }, [items]);

  // 💳 هندل پرداخت
  const handlePayment = async () => {
    if (items.length === 0) return;
    if (!userId) {
      toast.error("برای ادامه ابتدا وارد حساب خود شوید");
      return;
    }

    const formattedItems = items.map((item) => ({
      courseId: item.id,
    }));

    // استفاده از mutation برای ایجاد checkout
    createCheckoutMutation.mutate(
      {
        userId,
        items: formattedItems,
      },
      {
        onSuccess: (data) => {
          if (data.ok && data.payUrl) {
            toast.success("در حال انتقال به صفحه پرداخت...");
            clearCart();
          }
        },
      }
    );
  };

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-muted via-card to-muted">
      <div className="container-xl pt-8 pb-20">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-foreground dark:text-textPrimary mb-2">
            {step === "shoppingCart" && "سبد خرید شما"}
            {step === "pay" && "تکمیل خرید"}
            {step === "result" && "نتیجه پرداخت"}
          </h1>
          <p className="text-muted-foreground dark:text-textSecondary">
            {step === "shoppingCart" &&
              "دوره‌های انتخابی خود را بررسی و خرید کنید"}
            {step === "pay" && "روش پرداخت را انتخاب کنید"}
            {step === "result" && "وضعیت پرداخت شما"}
          </p>
        </motion.div>

        {/* Step Progress Indicator */}
        {!isEmpty && <StepProgress currentStep={step} />}

        {/* Content */}
        <AnimatePresence mode="wait">
          {isEmpty && step === "shoppingCart" ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyCart />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col lg:flex-row justify-between gap-8 mt-8"
            >
              {/* Main Content Area */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {step === "shoppingCart" && <ShoppingCartMain data={items} />}
                {step === "pay" && <PayMain />}
              </motion.div>

              {/* Sidebar */}
              <CheckoutSidebar
                data={priceSummary}
                step={step}
                setStep={setStep}
                handlePayment={handlePayment}
                loading={createCheckoutMutation.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutPageContent;
