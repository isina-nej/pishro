"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns-jalali";
import {
  ArrowLeft, CheckCircle2, CircleAlert, Clock3, CopyCheck, GraduationCap,
  LayoutDashboard, Loader2, ReceiptText, RefreshCw, ShieldCheck, XCircle,
} from "lucide-react";
import { checkoutLoginUrl, checkoutResultPath } from "@/lib/checkout-redirect";
import { useOrder } from "@/lib/hooks/useCheckout";
import { useCartStore } from "@/stores/cart-store";
import { formatCheckoutPrice } from "@/lib/checkout-display";

function ResultShell({ children }: { children: React.ReactNode }) {
  return (
    <main dir="rtl" className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[var(--home-bg)] px-4 pb-24 pt-12 text-foreground sm:px-6 sm:pt-16">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_at_70%_0%,hsl(var(--primary)/.10),transparent_60%),radial-gradient(ellipse_at_0%_20%,hsl(var(--premium)/.08),transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl">{children}</div>
    </main>
  );
}

function SmallState({
  icon, title, detail, children,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  children?: React.ReactNode;
}) {
  return (
    <ResultShell>
      <section className="rounded-[2rem] border border-border/75 bg-card px-5 py-12 text-center shadow-[0_24px_80px_-40px_rgba(0,0,0,.3)] sm:px-10 sm:py-16">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-[1.5rem] bg-primary/10 text-primary">{icon}</div>
        <h1 className="text-2xl font-black text-foreground sm:text-3xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-muted-foreground">{detail}</p>
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </section>
    </ResultShell>
  );
}

const primaryLink = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110";
const secondaryLink = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted";

export default function Result() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const result = searchParams?.get("result");
  const orderId = searchParams?.get("orderId");
  const queryClient = useQueryClient();
  // Payment status always comes from the authenticated order endpoint, never URL params.
  const { data: orderResponse, isLoading: loading } = useOrder(orderId || "");
  const order = orderResponse?.order;
  const error = orderResponse?.error;
  const unauthorized = orderResponse?.unauthorized;
  const clearCart = useCartStore((state) => state.clearCart);
  const success = order?.status === "PAID";
  const failed = order?.status === "FAILED";
  const pending = Boolean(order && !success && !failed);

  useEffect(() => {
    if (unauthorized) router.replace(checkoutLoginUrl(checkoutResultPath(orderId, result)));
  }, [unauthorized, orderId, result, router]);

  useEffect(() => {
    if (success) {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  }, [success, clearCart, queryClient]);

  if (unauthorized || loading) {
    return (
      <SmallState icon={<Loader2 className="size-9 animate-spin" />} title="در حال بررسی سفارش" detail="وضعیت نهایی پرداخت از سرور دریافت می‌شود. لطفاً برای این سفارش دوباره پرداخت نکنید." />
    );
  }

  if (!orderId) {
    return (
      <SmallState icon={<CircleAlert className="size-9" />} title="شناسه سفارش یافت نشد" detail="برای مشاهده نتیجه پرداخت، از فهرست سفارش‌های حساب کاربری وارد شوید.">
        <Link className={primaryLink} href="/profile/orders">مشاهده سفارش‌های من <ArrowLeft className="size-4" /></Link>
      </SmallState>
    );
  }

  if (error || !order) {
    return (
      <SmallState icon={<CircleAlert className="size-9" />} title="اطلاعات سفارش در دسترس نیست" detail={error || "در حال حاضر امکان تأیید وضعیت سفارش وجود ندارد. پیش از اقدام به پرداخت دوباره، وضعیت سفارش را از حساب کاربری بررسی کنید."}>
        <Link className={primaryLink} href="/profile/orders"><LayoutDashboard className="size-4" /> بررسی سفارش‌ها</Link>
        <Link className={secondaryLink} href="/checkout">سبد خرید</Link>
      </SmallState>
    );
  }

  const heading = success ? "پرداخت با موفقیت تأیید شد" : failed ? "پرداخت تأیید نشد" : "پرداخت هنوز تأیید نشده است";
  const description = success
    ? "سفارش شما در سامانه ثبت و پرداخت آن تأیید شد. جزئیات و کد پیگیری در ادامه در دسترس است."
    : failed
    ? "درگاه یا سامانه، پرداخت این سفارش را ناموفق ثبت کرده است. جزئیات را بررسی کنید و در صورت نیاز از سبد خرید اقدام کنید."
    : "تأیید نهایی این سفارش هنوز دریافت نشده است. لطفاً دوباره پرداخت نکنید؛ ابتدا وضعیت همین سفارش را بررسی کنید.";
  const ToneIcon = success ? CheckCircle2 : failed ? XCircle : Clock3;
  const tone = success ? "text-success bg-success/10 border-success/20" :
    failed ? "text-destructive bg-destructive/10 border-destructive/20" : "text-premium bg-premium/10 border-premium/20";

  return (
    <ResultShell>
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link href="/" className="text-xs font-bold text-muted-foreground transition-colors hover:text-primary">پیشرو / نتیجه خرید</Link>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-[11px] font-semibold text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" /> وضعیت ثبت‌شده سفارش
        </span>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-border/75 bg-card shadow-[0_24px_80px_-40px_rgba(0,0,0,.3)]">
        <div className="border-b border-border/70 px-5 pb-9 pt-10 text-center sm:px-10 sm:pt-12">
          <div className={"mx-auto mb-6 flex size-20 items-center justify-center rounded-[1.65rem] border " + tone}>
            <ToneIcon className="size-10" strokeWidth={1.6} />
          </div>
          <p className="mb-2 text-xs font-bold text-premium">{success ? "خرید شما تکمیل شد" : failed ? "نیاز به اقدام" : "در انتظار پاسخ درگاه"}</p>
          <h1 className="text-2xl font-black text-foreground sm:text-3xl">{heading}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-muted-foreground">{description}</p>
          {pending && (
            <p className="mx-auto mt-5 max-w-lg rounded-xl border border-premium/20 bg-premium/5 px-4 py-3 text-xs font-bold leading-6 text-premium">
              وضعیت سفارش نامشخص است؛ پرداخت جدید انجام ندهید.
            </p>
          )}
        </div>

        <div className="space-y-6 p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-2 text-lg font-black text-foreground">
              <ReceiptText className="size-5 text-primary" /> رسید و اطلاعات سفارش
            </h2>
            <span className={"rounded-full border px-3 py-1.5 text-xs font-bold " + tone}>
              {success ? "پرداخت‌شده" : failed ? "پرداخت ناموفق" : "در انتظار تأیید"}
            </span>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="min-w-0 rounded-xl border border-border/70 bg-muted/25 p-4">
              <dt className="text-xs text-muted-foreground">شناسه سفارش</dt>
              <dd dir="ltr" className="mt-2 break-all text-left font-mono text-sm font-bold text-foreground">{order.id}</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
              <dt className="text-xs text-muted-foreground">تاریخ ثبت سفارش</dt>
              <dd className="mt-2 text-sm font-bold text-foreground">{format(new Date(order.createdAt), "yyyy/MM/dd - HH:mm")}</dd>
            </div>
            {order.paymentRef && (
              <div className="min-w-0 rounded-xl border border-border/70 bg-muted/25 p-4 sm:col-span-2">
                <dt className="flex items-center gap-2 text-xs text-muted-foreground"><CopyCheck className="size-4" /> کد پیگیری پرداخت</dt>
                <dd dir="ltr" className="mt-2 break-all text-left font-mono text-sm font-bold text-foreground">{order.paymentRef}</dd>
              </div>
            )}
          </dl>

          {order.items.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-black text-foreground">اقلام سفارش</h3>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.courseId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/65 px-4 py-3.5">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground">{item.title || "دوره آموزشی"}</p>
                      {item.discountPercent ? <p className="mt-1 text-xs text-muted-foreground">تخفیف {item.discountPercent.toLocaleString("fa-IR")}٪</p> : null}
                    </div>
                    <p className="text-sm font-bold tabular-nums text-foreground">{typeof item.price === "number" ? formatCheckoutPrice(item.price) + " تومان" : "—"}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/15 bg-primary/5 px-5 py-5">
            <div>
              <p className="text-xs text-muted-foreground">مبلغ ثبت‌شده سفارش</p>
              <p className="mt-1 text-xs text-muted-foreground">بر اساس اطلاعات سرور</p>
            </div>
            <p className="text-2xl font-black tabular-nums text-primary">{formatCheckoutPrice(order.total)} <span className="text-sm font-medium">تومان</span></p>
          </div>

          <div className="flex flex-col flex-wrap gap-3 border-t border-border/70 pt-6 sm:flex-row">
            {success ? (
              <>
                <Link href="/profile/courses" className={primaryLink}><GraduationCap className="size-4" /> مشاهده دوره‌های من <ArrowLeft className="size-4" /></Link>
                <Link href="/profile/orders" className={secondaryLink}><LayoutDashboard className="size-4" /> سوابق سفارش‌ها</Link>
              </>
            ) : pending ? (
              <>
                <a href={"/api/payment/verify?orderId=" + encodeURIComponent(order.id) + "&trackId=" + encodeURIComponent(order.paymentAuthority || "")} className={primaryLink}>
                  <RefreshCw className="size-4" /> بررسی مجدد همین پرداخت
                </a>
                <Link href="/profile/orders" className={secondaryLink}><LayoutDashboard className="size-4" /> مشاهده سفارش‌ها</Link>
              </>
            ) : (
              <>
                <Link href="/checkout" className={primaryLink}><RefreshCw className="size-4" /> بازگشت به سبد خرید</Link>
                <Link href="/profile/orders" className={secondaryLink}><LayoutDashboard className="size-4" /> سوابق سفارش‌ها</Link>
              </>
            )}
            <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">صفحه اصلی</Link>
          </div>
        </div>
      </section>
    </ResultShell>
  );
}
