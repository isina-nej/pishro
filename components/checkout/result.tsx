"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, LayoutDashboard, GraduationCap, ArrowLeft, RefreshCw } from "lucide-react";
import { format } from "date-fns-jalali";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { checkoutLoginUrl, checkoutResultPath } from "@/lib/checkout-redirect";
import { useQueryClient } from "@tanstack/react-query";
import { useOrder } from "@/lib/hooks/useCheckout";
import { useCartStore } from "@/stores/cart-store";

const Result = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const result = searchParams?.get("result");
  const orderId = searchParams?.get("orderId");
  const queryClient = useQueryClient();
  // Trust the authenticated order endpoint, never the result query string.
  const { data: orderResponse, isLoading: loading } = useOrder(orderId || "");
  const order = orderResponse?.order;
  const error = orderResponse?.error;
  const unauthorized = orderResponse?.unauthorized;
  const clearCart = useCartStore((state) => state.clearCart);
  const status = order?.status === "PAID" ? "success" : order?.status === "FAILED" ? "failed" : null;

  useEffect(() => {
    if (unauthorized) {
      router.replace(checkoutLoginUrl(checkoutResultPath(orderId, result)));
    }
  }, [unauthorized, orderId, result, router]);

  useEffect(() => {
    if (status === "success") {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  }, [status, clearCart, queryClient]);

  if (unauthorized) {
    return <main className="min-h-[400px] flex items-center justify-center"><Loader2 className="size-8 animate-spin" /></main>;
  }

  if (result === "pending" && !loading && !error && order?.status === "PENDING") {
    return (
      <main className="min-h-[400px] flex flex-col items-center justify-center gap-4 p-5 text-center">
        <p className="text-base text-foreground font-semibold">وضعیت پرداخت هنوز تأیید نشده است. مبلغی دوباره پرداخت نکنید.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <a
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow hover:brightness-110"
            href={`/api/payment/verify?orderId=${encodeURIComponent(orderId || "")}&trackId=${encodeURIComponent(order?.paymentAuthority || "")}`}
          >
            <RefreshCw className="size-4" />
            <span>بررسی دوباره پرداخت</span>
          </a>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <LayoutDashboard className="size-4" />
            <span>رفتن به داشبورد</span>
          </Link>
        </div>
      </main>
    );
  }

  if (!loading && !error && !status) {
    return <main className="min-h-[400px] flex items-center justify-center">در انتظار تأیید پرداخت</main>;
  }

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive font-semibold mb-2">خطا در دریافت سفارش</p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center w-full py-12">
      <div
        className={clsx(
          "relative w-[180px] h-[150px] mb-6",
          status === "success" ? "drop-shadow-lg" : "opacity-90"
        )}
      >
        <Image
          src={
            status === "success"
              ? "/images/checkout/success.png"
              : "/images/checkout/failure.png"
          }
          alt={status === "success" ? "پرداخت موفق" : "پرداخت ناموفق"}
          fill
          className="object-contain"
        />
      </div>

      <h2
        className={clsx(
          "font-iransans text-2xl font-bold mb-2",
          status === "success" ? "text-success" : "text-destructive"
        )}
      >
        {status === "success"
          ? "پرداخت با موفقیت انجام شد"
          : "پرداخت ناموفق بود"}
      </h2>

      {order && (
        <div className="w-full max-w-3xl bg-card shadow-md rounded-xl mt-10 p-6 border border-border">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-5">
            <div>
              <p className="text-sm text-muted-foreground">شماره سفارش</p>
              <p className="font-semibold text-foreground">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">تاریخ ثبت</p>
              <p className="font-semibold text-foreground">
                {format(new Date(order.createdAt), "yyyy/MM/dd - HH:mm")}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-muted-foreground font-semibold mb-3">
              دوره‌های خریداری‌شده
            </p>
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li
                  key={item.courseId}
                  className="flex justify-between items-center bg-muted px-4 py-3 rounded-lg border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    {item.discountPercent ? (
                      <p className="text-xs text-muted-foreground">
                        تخفیف {item.discountPercent}٪
                      </p>
                    ) : null}
                  </div>
                  <span className="font-semibold text-muted-foreground">
                    {item.price?.toLocaleString("fa-IR")} تومان
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="text-muted-foreground">مبلغ کل</p>
              <p className="font-semibold text-foreground">
                {order.total.toLocaleString("fa-IR")} تومان
              </p>
            </div>

            {order.paymentRef && (
              <div className="flex justify-between">
                <p className="text-muted-foreground">کد پیگیری</p>
                <p className="font-semibold text-foreground">
                  {order.paymentRef}
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <p className="text-muted-foreground">وضعیت سفارش</p>
              <span
                className={clsx(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  order.status.toUpperCase() === "PAID"
                    ? "bg-success/15 text-success"
                    : order.status.toUpperCase() === "FAILED"
                    ? "bg-destructive/15 text-destructive"
                    : "bg-premium/15 text-premium"
                )}
              >
                {order.status.toUpperCase() === "PAID"
                  ? "پرداخت‌شده"
                  : order.status.toUpperCase() === "FAILED"
                  ? "پرداخت ناموفق"
                  : "در انتظار پرداخت"}
              </span>
            </div>
          </div>

          {/* دکمه‌های عملیاتی / رفتن به داشبورد */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-3">
            {status === "success" ? (
              <>
                <Link
                  href="/profile/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  <GraduationCap className="size-4" />
                  <span>مشاهده دوره‌های من</span>
                </Link>
                <Link
                  href="/profile"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 hover:bg-muted px-6 py-3 text-sm font-semibold text-foreground transition-all active:scale-[0.98]"
                >
                  <LayoutDashboard className="size-4" />
                  <span>رفتن به داشبورد</span>
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>صفحه اصلی</span>
                  <ArrowLeft className="size-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/checkout"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  <RefreshCw className="size-4" />
                  <span>تلاش مجدد و بازگشت به سبد خرید</span>
                </Link>
                <Link
                  href="/profile"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-muted px-6 py-3 text-sm font-semibold text-foreground transition-all active:scale-[0.98]"
                >
                  <LayoutDashboard className="size-4" />
                  <span>رفتن به داشبورد</span>
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>صفحه اصلی</span>
                  <ArrowLeft className="size-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Result;
