"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  TrendingDown,
  Wallet,
  Shield,
  Clock,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

interface CheckoutSidebarProps {
  data: {
    price: number;
    off: number;
    lastPrice: number;
  };
  step: "shoppingCart" | "result" | "pay";
  setStep: (i: "result" | "pay" | "shoppingCart") => void;
  handlePayment: () => void;
  loading: boolean;
}

const CheckoutSidebar = ({
  data,
  step,
  setStep,
  handlePayment,
  loading,
}: CheckoutSidebarProps) => {
  const price = data.price.toLocaleString("fa-IR");
  const off = data.off.toLocaleString("fa-IR");
  const lastPrice = data.lastPrice.toLocaleString("fa-IR");

  const hasDiscount = data.off > 0;
  const discountPercentage = hasDiscount
    ? Math.round((data.off / data.price) * 100)
    : 0;

  return (
    <aside className={step === "result" ? "hidden" : ""}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full lg:w-[380px] sticky top-24"
      >
        {/* Main Card */}
        <div className="bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header with Icon */}
          <div className="bg-gradient-to-l from-mySecondary to-myBlue p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg">خلاصه سفارش</p>
                <p className="text-xs text-white/80">دوره‌های منتخب شما</p>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="p-6 space-y-4">
            {/* Original Price */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                قیمت کل دوره‌ها
              </span>
              <span className="font-medium text-gray-500 line-through">
                {price} تومان
              </span>
            </div>

            {/* Discount */}
            {hasDiscount && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-l from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">سود شما از خرید</p>
                      <p className="text-sm font-bold text-green-600">
                        {discountPercentage}٪ تخفیف
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {off}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Divider */}
            <div className="border-t border-dashed border-gray-300" />

            {/* Final Price */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="bg-gradient-to-br from-myPrimary/10 to-red-50 border-2 border-myPrimary/30 rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 font-medium">
                    مبلغ قابل پرداخت
                  </p>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-myPrimary" />
                    <span className="text-xs text-gray-500">
                      قیمت نهایی با تخفیف
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-3xl font-black text-myPrimary">
                    {lastPrice}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">تومان</p>
                </div>
              </div>
            </motion.div>

            {/* Action Button */}
            <div className="pt-2">
              {step === "shoppingCart" && (
                <Button
                  onClick={() => setStep("pay")}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-l from-myPrimary to-red-600 hover:from-red-600 hover:to-myPrimary shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <span>ادامه فرایند خرید</span>
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}

              {step === "pay" && (
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-l from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>در حال اتصال به درگاه...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      <span>پرداخت امن</span>
                    </div>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <span>پرداخت امن و محافظت شده</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <span>دسترسی فوری پس از پرداخت</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </aside>
  );
};

export default CheckoutSidebar;
