"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { orderService, OrderDetail } from "@/lib/services/order-service";
import { Loader2 } from "lucide-react";
import { format } from "date-fns-jalali";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";

const Result = () => {
  const searchParams = useSearchParams();
  const result = searchParams.get("result");
  const orderId = searchParams.get("orderId");
  const [status, setStatus] = useState<"success" | "failed" | null>(null);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (result === "success") setStatus("success");
    else if (result === "failed") setStatus("failed");
  }, [result]);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      setLoading(true);
      const res = await orderService.getOrderById(orderId);
      if (res.ok && res.order) {
        setOrder(res.order);
      } else {
        setError(res.error || "اطلاعات سفارش یافت نشد");
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (!status) {
    return (
      <main className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 text-lg">در حال بررسی پرداخت...</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[400px]">
        <span className="ml-2 text-gray-600 text-sm">
          در حال بارگذاری سفارش...
        </span>
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-600 font-semibold mb-2">خطا در دریافت سفارش</p>
        <p className="text-gray-500 text-sm">{error}</p>
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
          status === "success" ? "text-green-600" : "text-red-600"
        )}
      >
        {status === "success"
          ? "پرداخت با موفقیت انجام شد"
          : "پرداخت ناموفق بود"}
      </h2>

      {order && (
        <div className="w-full max-w-3xl bg-white shadow-md rounded-xl mt-10 p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-5">
            <div>
              <p className="text-sm text-gray-500">شماره سفارش</p>
              <p className="font-semibold text-gray-800">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">تاریخ ثبت</p>
              <p className="font-semibold text-gray-800">
                {format(new Date(order.createdAt), "yyyy/MM/dd - HH:mm")}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 font-semibold mb-3">
              دوره‌های خریداری‌شده
            </p>
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li
                  key={item.courseId}
                  className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    {item.discountPercent ? (
                      <p className="text-xs text-gray-500">
                        تخفیف {item.discountPercent}٪
                      </p>
                    ) : null}
                  </div>
                  <span className="font-semibold text-gray-700">
                    {item.price?.toLocaleString("fa-IR")} تومان
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="text-gray-600">مبلغ کل</p>
              <p className="font-semibold text-gray-800">
                {order.total.toLocaleString("fa-IR")} تومان
              </p>
            </div>

            {order.paymentRef && (
              <div className="flex justify-between">
                <p className="text-gray-600">کد پیگیری</p>
                <p className="font-semibold text-gray-800">
                  {order.paymentRef}
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <p className="text-gray-600">وضعیت سفارش</p>
              <span
                className={clsx(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  order.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                )}
              >
                {order.status === "paid" ? "پرداخت‌شده" : "در انتظار پرداخت"}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Result;
