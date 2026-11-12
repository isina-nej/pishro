"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, LockKeyhole, ShoppingBag, Sparkles } from "lucide-react";
import CheckoutSidebar from "./sidebar";
import ShoppingCartMain from "./shoppingCartMain";
import PayMain from "./payMain";
import StepProgress from "./stepProgress";
import EmptyCart from "./emptyCart";
import { useCartStore } from "@/stores/cart-store";
import { useCreateCheckout } from "@/lib/hooks/useCheckout";
import { usePublicCopy } from "@/components/site/PublicContentProvider";
import { checkoutLoginUrl } from "@/lib/checkout-redirect";
import { displayCartPricing } from "@/lib/checkout-display";

const CheckoutPageContent = () => {
  const copy = usePublicCopy("checkout");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"shoppingCart" | "pay" | "result">("shoppingCart");
  const { data: session, status: sessionStatus } = useSession();
  const userId = session?.user?.id;
  const items = useCartStore((state) => state.items);
  const createCheckoutMutation = useCreateCheckout();
  const priceSummary = useMemo(() => displayCartPricing(items), [items]);

  const requireLogin = () => {
    if (sessionStatus === "authenticated" && userId) return false;
    router.push(checkoutLoginUrl("/checkout?step=pay"));
    return true;
  };

  useEffect(() => {
    if (searchParams?.get("step") !== "pay" || items.length === 0 || sessionStatus === "loading") return;
    if (sessionStatus === "authenticated" && userId) setStep("pay");
    else router.replace(checkoutLoginUrl("/checkout?step=pay"));
  }, [searchParams, items.length, sessionStatus, userId, router]);

  const handleContinue = () => {
    if (sessionStatus === "loading") return;
    if (!requireLogin()) setStep("pay");
  };

  const handlePayment = () => {
    if (items.length === 0 || createCheckoutMutation.isPending || requireLogin()) return;
    createCheckoutMutation.mutate(
      { items: items.map((item) => ({ courseId: item.id })) },
      {
        onSuccess: (data) => {
          if (data.ok && data.payUrl) toast.success("در حال انتقال به درگاه پرداخت...");
        },
      }
    );
  };

  const isEmpty = items.length === 0;
  const isPay = step === "pay";

  return (
    <div dir="rtl" className="relative mt-16 min-h-[calc(100vh-4rem)] overflow-hidden bg-[var(--home-bg)] text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_at_75%_0%,hsl(var(--primary)/.09),transparent_60%),radial-gradient(ellipse_at_5%_25%,hsl(var(--premium)/.10),transparent_55%)]" />
      <div className="container-xl relative mx-auto max-w-7xl px-4 pb-24 pt-9 sm:px-6 lg:pt-14">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="مسیر صفحه" className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">خانه</Link>
            <ChevronLeft className="size-3.5" />
            <span className="text-foreground">{copy("steps.cart", "سبد خرید")}</span>
          </nav>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-2 text-xs font-medium text-primary">
            <LockKeyhole className="size-3.5" />
            تکمیل سفارش از طریق درگاه پرداخت
          </span>
        </div>

        <header className="mb-9 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-premium/20 bg-premium/10 px-3 py-1.5 text-xs font-bold text-premium">
              <Sparkles className="size-3.5" />
              تجربه خرید پیشرو
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem]">
              {isPay ? copy("steps.pay", "بازبینی و تکمیل خرید") : copy("steps.cart", "سبد خرید شما")}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {isPay
                ? "جزئیات سفارش را بررسی کنید. مبلغ نهایی پیش از انتقال، توسط سرور محاسبه و تأیید می‌شود."
                : copy("steps.cartHint", "دوره‌ها و خدمات انتخاب‌شده را پیش از ادامه خرید بررسی کنید.")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isPay && !isEmpty ? (
              <button type="button" onClick={() => setStep("shoppingCart")} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                بازگشت به سبد <ArrowLeft className="size-4 rotate-180" />
              </button>
            ) : (
              <Link href="/courses" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted">
                مشاهده دوره‌ها <ArrowLeft className="size-4" />
              </Link>
            )}
            <div className="flex h-12 items-center gap-2 rounded-xl bg-primary px-4 text-primary-foreground">
              <ShoppingBag className="size-4" />
              <span className="text-sm font-bold">{items.length.toLocaleString("fa-IR")} مورد</span>
            </div>
          </div>
        </header>

        {!isEmpty && <div className="mb-7"><StepProgress currentStep={step} /></div>}

        <AnimatePresence mode="wait" initial={false}>
          {isEmpty ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyCart />
            </motion.div>
          ) : (
            <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-8">
              <div className="min-w-0">
                {isPay ? <PayMain /> : <ShoppingCartMain data={items} />}
              </div>
              <CheckoutSidebar
                data={priceSummary}
                step={step}
                handleContinue={handleContinue}
                handlePayment={handlePayment}
                loading={createCheckoutMutation.isPending || sessionStatus === "loading"}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutPageContent;
