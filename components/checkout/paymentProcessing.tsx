"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, CreditCard, ExternalLink, LockKeyhole, ShieldCheck } from "lucide-react";

/** Payment gateway URL must be provided by checkout; disallow script/data URLs. */
function canNavigateToGateway(url: string) {
  try {
    const target = new URL(url);
    return target.protocol === "https:" ||
      (target.protocol === "http:" && ["localhost", "127.0.0.1"].includes(target.hostname));
  } catch {
    return false;
  }
}

export default function PaymentProcessing() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const payUrl = searchParams?.get("payUrl");
  const orderId = searchParams?.get("orderId");
  const validUrl = Boolean(payUrl && canNavigateToGateway(payUrl));
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!validUrl || !payUrl) {
      router.replace("/checkout");
      return;
    }
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          window.location.assign(payUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [payUrl, validUrl, router]);

  if (!validUrl || !payUrl) {
    return <div role="status" className="min-h-[70vh] bg-[var(--home-bg)] px-4 py-24 text-center text-sm text-muted-foreground">در حال بازگشت به سبد خرید...</div>;
  }

  return (
    <main dir="rtl" className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-[var(--home-bg)] px-4 py-12 text-foreground sm:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_0%,hsl(var(--primary)/.11),transparent_60%),radial-gradient(ellipse_at_0%_85%,hsl(var(--premium)/.10),transparent_48%)]" />
      <div className="relative w-full max-w-2xl">
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/75 px-4 py-2 text-xs font-bold text-primary">
            <LockKeyhole className="size-4" /> مرحله انتقال به درگاه
          </span>
        </div>

        <section aria-labelledby="redirect-title" className="overflow-hidden rounded-[2rem] border border-border/75 bg-card shadow-[0_30px_90px_-40px_rgba(0,0,0,.3)]">
          <div className="relative overflow-hidden border-b border-border/70 px-6 pb-9 pt-10 text-center sm:px-10 sm:pt-12">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="relative mx-auto mb-6 flex size-20 items-center justify-center rounded-[1.65rem] border border-primary/20 bg-primary/10 text-primary">
              <CreditCard className="size-9" strokeWidth={1.6} />
              <span className="absolute -left-2 -top-2 flex size-7 items-center justify-center rounded-full bg-card text-success shadow-sm">
                <CheckCircle2 className="size-5" />
              </span>
            </div>
            <p className="mb-2 text-xs font-bold text-premium">آخرین مرحله پیش از پرداخت</p>
            <h1 id="redirect-title" className="text-2xl font-black text-foreground sm:text-3xl">در حال انتقال به درگاه پرداخت</h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-muted-foreground">
              سفارش شما آماده است. تا چند لحظه دیگر به صفحه درگاه منتقل می‌شوید؛ اطلاعات کارت را فقط در خود درگاه وارد کنید.
            </p>
            <div role="status" aria-live="polite" className="mx-auto mt-7 inline-flex items-baseline gap-2 rounded-2xl bg-primary/5 px-6 py-4 text-primary">
              <span className="text-4xl font-black tabular-nums">{countdown.toLocaleString("fa-IR")}</span>
              <span className="text-sm font-semibold">ثانیه تا انتقال</span>
            </div>
            <div className="mx-auto mt-5 h-1.5 max-w-[300px] overflow-hidden rounded-full bg-primary/10" aria-hidden>
              <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: String(((3 - countdown) / 3) * 100) + "%" }} />
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-2" aria-label="وضعیت فرایند">
              <div className="rounded-xl border border-success/20 bg-success/5 px-2 py-3 text-center">
                <CheckCircle2 className="mx-auto mb-2 size-5 text-success" />
                <span className="text-[11px] font-bold text-success">ثبت سفارش</span>
              </div>
              <div className="rounded-xl border border-primary/25 bg-primary/5 px-2 py-3 text-center">
                <CreditCard className="mx-auto mb-2 size-5 text-primary" />
                <span className="text-[11px] font-bold text-primary">ورود به درگاه</span>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 px-2 py-3 text-center">
                <Clock3 className="mx-auto mb-2 size-5 text-muted-foreground" />
                <span className="text-[11px] font-bold text-muted-foreground">تأیید پرداخت</span>
              </div>
            </div>

            {orderId && (
              <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-muted/35 px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                <span className="text-muted-foreground">شناسه سفارش</span>
                <span dir="ltr" className="break-all font-mono font-semibold text-foreground">{orderId}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => window.location.assign(payUrl)}
              className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-black text-primary-foreground transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ExternalLink className="size-4.5" />
              انتقال دستی به درگاه
              <ArrowLeft className="size-4" />
            </button>

            <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> نتیجه پرداخت پس از بررسی سرور مشخص می‌شود.</span>
              <Link href="/checkout" className="font-semibold text-primary underline-offset-4 hover:underline">بازگشت به سبد خرید</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
