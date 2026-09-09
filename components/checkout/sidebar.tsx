"use client";

import { Button } from "@/components/ui/button";
import { usePublicCopy } from "@/components/site/PublicContentProvider";
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
  const copy = usePublicCopy("checkout");
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
        <div className="bg-gradient-to-br from-card via-card to-muted rounded-2xl shadow-lg border border-border overflow-hidden">
          {/* Header with Icon — palette primary band */}
          <div className="bg-primary p-5 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm">
                <ShoppingBag className="size-6" />
              </div>
              <div>
                <p className="font-bold text-lg">{copy("summary.title", "خلاصه سفارش")}</p>
                <p className="text-xs opacity-75">{copy("summary.subtitle", "دوره‌های منتخب شما")}</p>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="p-6 space-y-4">
            {/* Original Price */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                {copy("summary.total", "قیمت کل دوره‌ها")}
              </span>
              <span className="font-medium text-muted-foreground line-through">
                {price} تومان
              </span>
            </div>

            {/* Discount */}
            {hasDiscount && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-success/10 border border-success/30 rounded-xl p-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-success-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{copy("summary.profit", "سود شما از خرید")}</p>
                      <p className="text-sm font-bold text-success">
                        {discountPercentage}{copy("summary.discountSuffix", "٪ تخفیف")}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-success">
                    {off}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Divider */}
            <div className="border-t border-dashed border-border" />

            {/* Final Price */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    {copy("summary.payable", "مبلغ قابل پرداخت")}
                  </p>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      {copy("summary.finalHint", "قیمت نهایی با تخفیف")}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-3xl font-black text-primary">
                    {lastPrice}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">{copy("summary.currency", "تومان")}</p>
                </div>
              </div>
            </motion.div>

            {/* Action Button */}
            <div className="pt-2">
              {step === "shoppingCart" && (
                <Button
                  onClick={() => setStep("pay")}
                  className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <span>{copy("summary.continue", "ادامه فرایند خرید")}</span>
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}

              {step === "pay" && (
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-3 border-border border-t-transparent rounded-full animate-spin" />
                      <span>{copy("summary.connecting", "در حال اتصال به درگاه...")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      <span>{copy("summary.securePay", "پرداخت امن")}</span>
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
          className="mt-4 bg-card rounded-xl shadow-sm border border-border p-4"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-success/15 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-success" />
              </div>
              <span>{copy("summary.secureNote", "پرداخت امن و محافظت شده")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-premium/15 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-premium" />
              </div>
              <span>{copy("summary.instantNote", "دسترسی فوری پس از پرداخت")}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </aside>
  );
};

export default CheckoutSidebar;
