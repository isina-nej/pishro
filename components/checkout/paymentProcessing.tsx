"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, CreditCard, ArrowLeft } from "lucide-react";

const PaymentProcessing = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const payUrl = searchParams?.get("payUrl");
  const orderId = searchParams?.get("orderId");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!payUrl) {
      router.push("/checkout");
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to payment gateway
          window.location.href = payUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [payUrl, router]);

  if (!payUrl) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-card to-accent flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card dark:bg-cardBg rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-6 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-primary to-accent p-6 rounded-full">
              <CreditCard className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground dark:text-textPrimary mb-3">
          در حال انتقال به درگاه پرداخت
        </h1>

        {/* Description */}
        <p className="text-muted-foreground dark:text-textSecondary mb-8">
          لطفاً صبر کنید. شما به درگاه امن پرداخت منتقل می‌شوید...
        </p>

        {/* Countdown */}
        <motion.div
          key={countdown}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {countdown}
          </div>
          <p className="text-sm text-muted-foreground dark:text-textSecondary mt-2">ثانیه تا انتقال</p>
        </motion.div>

        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-textSecondary mb-6">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span>اتصال امن و رمزنگاری شده</span>
        </div>

        {/* Order Info */}
        {orderId && (
          <div className="bg-muted dark:bg-darkBgHidden rounded-lg p-4 text-right">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground dark:text-textSecondary">شماره سفارش:</span>
              <span className="font-mono font-semibold text-foreground dark:text-textPrimary">
                {orderId.substring(0, 8)}...
              </span>
            </div>
          </div>
        )}

        {/* Manual redirect button (in case auto-redirect fails) */}
        <motion.button
          onClick={() => (window.location.href = payUrl)}
          className="mt-6 w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:from-primary hover:to-accent transition-all duration-300 flex items-center justify-center gap-2 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>انتقال دستی به درگاه</span>
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </motion.button>

        {/* Back to cart link */}
        <button
          onClick={() => router.push("/checkout")}
          className="mt-4 text-sm text-muted-foreground dark:text-textSecondary hover:text-muted-foreground transition-colors"
        >
          بازگشت به سبد خرید
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentProcessing;
