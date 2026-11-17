"use client";

import { useMemo } from "react";
import { useCartStore, isPortfolio } from "@/stores/cart-store";
import { displayCartPricing, displayItemPricing, formatCheckoutPrice } from "@/lib/checkout-display";
import { usePublicCopy } from "@/components/site/PublicContentProvider";
import { BadgeCheck, BookOpen, CreditCard, Info, ReceiptText, ShieldCheck, Tag } from "lucide-react";

export default function PayMain() {
  const copy = usePublicCopy("checkout");
  const items = useCartStore((state) => state.items);
  const total = useMemo(() => displayCartPricing(items), [items]);

  return (
    <main className="overflow-hidden rounded-[1.65rem] border border-border/75 bg-card shadow-[0_24px_70px_-40px_rgba(0,0,0,.28)]">
      <div className="border-b border-border/75 px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ReceiptText className="size-6" /></span>
            <div>
              <h2 className="text-xl font-black text-foreground">{copy("pay.title", "بازبینی نهایی سفارش")}</h2>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">همه موارد انتخابی را قبل از پرداخت بررسی کنید.</p>
            </div>
          </div>
          <span className="rounded-full border border-border bg-muted/60 px-3 py-2 text-xs font-semibold text-muted-foreground">
            {items.length.toLocaleString("fa-IR")} قلم
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        {items.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">سبد خرید شما خالی است.</div>
        ) : (
          <>
            <ul className="space-y-3" aria-label="اقلام سفارش">
              {items.map((item, idx) => {
                const pricing = displayItemPricing(item);
                const portfolio = isPortfolio(item);
                const title = portfolio
                  ? "سبد سرمایه‌گذاری " + (item.portfolioType === "low" ? "کم‌ریسک" : item.portfolioType === "medium" ? "ریسک متوسط" : "پرریسک")
                  : item.subject;
                return (
                  <li key={item.id} className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-muted/25 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
                        {portfolio ? <CreditCard className="size-5" /> : <BookOpen className="size-5" />}
                      </span>
                      <div className="min-w-0">
                        <span className="mb-1 block text-[11px] font-bold text-muted-foreground">مورد {(idx + 1).toLocaleString("fa-IR")}</span>
                        <h3 className="line-clamp-2 text-sm font-bold leading-6 text-foreground sm:text-base">{title}</h3>
                        {pricing.saved > 0 && (
                          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                            <Tag className="size-3" /> تخفیف {formatCheckoutPrice(pricing.saved)} تومان
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right sm:min-w-[150px] sm:text-left">
                      {pricing.saved > 0 && (
                        <p className="text-xs text-muted-foreground line-through">{formatCheckoutPrice(pricing.original)} تومان</p>
                      )}
                      <p className="mt-1 text-lg font-black tabular-nums text-primary">
                        {formatCheckoutPrice(pricing.final)} <span className="text-xs font-medium">تومان</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="grid gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-bold text-primary"><BadgeCheck className="size-4" /> {copy("pay.total", "جمع مبلغ سبد خرید")}</p>
                <p className="text-xs leading-6 text-muted-foreground">در مرحله بعد مبلغ و اقلام سفارش در سرور دوباره اعتبارسنجی می‌شود.</p>
                {total.off > 0 && (
                  <p className="text-xs font-semibold text-success">مجموع تخفیف: {formatCheckoutPrice(total.off)} تومان</p>
                )}
              </div>
              <div className="text-right sm:text-left">
                <p className="text-3xl font-black tracking-tight text-primary">
                  {formatCheckoutPrice(total.lastPrice)} <span className="text-sm font-medium">تومان</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> نتیجه نهایی تراکنش پس از بررسی پاسخ درگاه مشخص می‌شود.</span>
              <span className="flex items-center gap-2"><Info className="size-4 text-premium" /> در صورت معلق‌بودن پرداخت، دوباره پرداخت نکنید.</span>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
