"use client";

import { useMemo } from "react";
import { useCartStore } from "@/stores/cart-store";
import { motion } from "framer-motion";
import { Calendar, Tag, Receipt } from "lucide-react";

const PayMain = () => {
  const { items } = useCartStore();

  const cartSummary = useMemo(() => {
    return items.map((item) => {
      const price = item.price || 0;

      // بررسی نوع آیتم
      if ("type" in item && item.type === "portfolio") {
        // برای investment portfolios
        return {
          title: `سبد سرمایه‌ گذاری - ${
            item.portfolioType === "low"
              ? "کم‌ریسک"
              : item.portfolioType === "medium"
              ? "متوسط"
              : "پرریسک"
          }`,
          price,
          off: 0,
          lastPrice: price,
          date: new Date().toLocaleDateString("fa-IR"),
        };
      } else {
        // برای دوره‌ها
        const discountPercent =
          "discountPercent" in item ? item.discountPercent || 0 : 0;
        const off = Math.round((price * discountPercent) / 100);
        const lastPrice = price - off;

        return {
          title: "subject" in item ? item.subject : "دوره",
          price,
          off,
          lastPrice,
          date:
            "createdAt" in item
              ? new Date(item.createdAt).toLocaleDateString("fa-IR")
              : new Date().toLocaleDateString("fa-IR"),
        };
      }
    });
  }, [items]);

  const totalPrice = cartSummary.reduce((sum, item) => sum + item.lastPrice, 0);

  return (
    <main className="w-full">
      {/* Order Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-myGolden to-yellow-500 p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg">بررسی نهایی سفارش</p>
              <p className="text-xs text-white/90">
                جزئیات دوره‌های خریداری شده
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6">
          {cartSummary.length > 0 ? (
            <div className="space-y-4">
              {cartSummary.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Course Title */}
                    <div className="flex-1">
                      <h6 className="font-bold text-gray-900 mb-2">
                        {item.title}
                      </h6>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center gap-6">
                      {/* Original Price */}
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">قیمت اصلی</p>
                        <p className="text-sm text-gray-400 line-through">
                          {item.price.toLocaleString("fa-IR")}
                        </p>
                      </div>

                      {/* Discount */}
                      {item.off > 0 && (
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">تخفیف</p>
                          <div className="flex items-center gap-1 text-green-600">
                            <Tag className="w-3.5 h-3.5" />
                            <span className="text-sm font-bold">
                              {item.off.toLocaleString("fa-IR")}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Final Price */}
                      <div className="text-center min-w-[120px]">
                        <p className="text-xs text-gray-500 mb-1">قیمت نهایی</p>
                        <p className="text-lg font-black text-myPrimary">
                          {item.lastPrice.toLocaleString("fa-IR")}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Total Price */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + cartSummary.length * 0.1 }}
                className="bg-gradient-to-l from-myPrimary/10 to-red-50 border-2 border-myPrimary/30 rounded-xl p-6 mt-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-myPrimary rounded-xl flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        مبلغ کل قابل پرداخت
                      </p>
                      <p className="text-xs text-gray-500">
                        جمع {cartSummary.length} دوره آموزشی
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-3xl font-black text-myPrimary">
                      {totalPrice.toLocaleString("fa-IR")}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">تومان</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Receipt className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-gray-500">سبد خرید شما خالی است.</p>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
};

export default PayMain;
