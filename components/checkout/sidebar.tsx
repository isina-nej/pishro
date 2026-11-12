"use client";

import { Button } from "@/components/ui/button";
import { usePublicCopy } from "@/components/site/PublicContentProvider";
import { formatCheckoutPrice } from "@/lib/checkout-display";
import { ArrowLeft, BadgeCheck, CreditCard, Headphones, LockKeyhole, ReceiptText, ShieldCheck, Tag } from "lucide-react";

interface CheckoutSidebarProps {
  data: { price: number; off: number; lastPrice: number };
  step: "shoppingCart" | "result" | "pay";
  handleContinue: () => void;
  handlePayment: () => void;
  loading: boolean;
}

export default function CheckoutSidebar({
  data, step, handleContinue, handlePayment, loading,
}: CheckoutSidebarProps) {
  const copy = usePublicCopy("checkout");
  if (step === "result") return null;

  const discount = data.off > 0;

  return (
    <aside className="self-start lg:sticky lg:top-24" aria-label="خلاصه مبلغ سفارش">
      <div className="overflow-hidden rounded-[1.65rem] border border-border/80 bg-card shadow-[0_24px_70px_-40px_rgba(0,0,0,.32)]">
        <div className="relative overflow-hidden bg-primary px-6 py-6 text-primary-foreground">
          <div aria-hidden className="pointer-events-none absolute -left-12 -top-12 size-44 rounded-full border border-primary-foreground/15" />
          <div aria-hidden className="pointer-events-none absolute -left-2 top-0 size-24 rounded-full bg-primary-foreground/10 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10">
              <ReceiptText className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-black">{copy("summary.title", "خلاصه سفارش")}</h2>
              <p className="mt-1 text-xs text-primary-foreground/70">جزئیات مبلغ قابل پرداخت</p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">{copy("summary.total", "مجموع اقلام")}</dt>
              <dd className="font-semibold tabular-nums text-foreground" dir="ltr">{formatCheckoutPrice(data.price)} <span className="text-xs font-normal text-muted-foreground">تومان</span></dd>
            </div>
            {discount && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-success/20 bg-success/5 px-3 py-3">
                <dt className="inline-flex items-center gap-2 font-medium text-success">
                  <Tag className="size-4" />
                  {copy("summary.profit", "تخفیف شما")}
                </dt>
                <dd className="font-bold tabular-nums text-success" dir="ltr">
                  − {formatCheckoutPrice(data.off)} <span className="text-xs font-normal">تومان</span>
                </dd>
              </div>
            )}
          </dl>

          <div className="h-px border-t border-dashed border-border" />
          <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-5">
            <p className="mb-2 text-sm font-medium text-muted-foreground">{copy("summary.payable", "مبلغ قابل پرداخت")}</p>
            <div className="flex items-baseline gap-2 text-primary">
              <span className="text-[2rem] font-black tracking-tight tabular-nums sm:text-[2.2rem]">{formatCheckoutPrice(data.lastPrice)}</span>
              <span className="text-sm font-semibold">{copy("summary.currency", "تومان")}</span>
            </div>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">مبلغ نهایی در مرحله ایجاد سفارش توسط سرور بررسی می‌شود.</p>
          </div>

          <Button
            type="button"
            onClick={step === "pay" ? handlePayment : handleContinue}
            disabled={loading}
            className="group h-14 w-full rounded-xl text-base font-black shadow-[0_14px_28px_-16px_rgba(0,0,0,.45)] transition-all hover:-translate-y-0.5 disabled:translate-y-0"
          >
            {loading ? (
              <><span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />{copy("summary.connecting", "در حال آماده‌سازی...")}</>
            ) : (
              <>
                {step === "pay" ? <CreditCard className="size-5" /> : <LockKeyhole className="size-5" />}
                {step === "pay" ? copy("summary.securePay", "انتقال به درگاه پرداخت") : copy("summary.continue", "ادامه فرایند خرید")}
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </>
            )}
          </Button>
          <p className="text-center text-[11px] leading-5 text-muted-foreground">
            {step === "pay" ? "بعد از تأیید سفارش، به درگاه پرداخت هدایت می‌شوید." : "برای ادامه لازم است وارد حساب کاربری خود شوید."}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 rounded-2xl border border-border/65 bg-card/70 p-4 text-xs sm:grid-cols-2 lg:grid-cols-1">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="size-4.5" /></span>
          <div><p className="font-bold text-foreground">تأیید وضعیت سفارش</p><p className="mt-1 text-muted-foreground">پس از پاسخ درگاه و بررسی سرور</p></div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-premium/10 text-premium"><BadgeCheck className="size-4.5" /></span>
          <div><p className="font-bold text-foreground">ثبت سوابق خرید</p><p className="mt-1 text-muted-foreground">در حساب کاربری شما</p></div>
        </div>
        <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground"><Headphones className="size-4.5" /></span>
          <div><p className="font-bold text-foreground">نیاز به راهنمایی دارید؟</p><p className="mt-1 text-muted-foreground">از بخش پشتیبانی سایت کمک بگیرید</p></div>
        </div>
      </div>
    </aside>
  );
}
