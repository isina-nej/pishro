"use client";

import { useState, useMemo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Wallet, Clock, BarChart3, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useCartStore, InvestmentPortfolioItem } from "@/stores/cart-store";

const PortfolioSelectionForm = () => {
  // Detect mobile for performance optimization
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [amount, setAmount] = useState(50_000_000); // 50 میلیون تومان
  const [duration, setDuration] = useState(6); // 6 ماه
  const [riskLevel, setRiskLevel] = useState<0 | 1 | 2>(1); // 0: کم، 1: متوسط، 2: بالا
  const [isLoading, setIsLoading] = useState(false);

  // 📊 مقادیر اسلایدرها
  const amountSteps = useMemo(
    () => [
      10_000_000, 20_000_000, 50_000_000, 100_000_000, 200_000_000, 500_000_000,
      1_000_000_000, 2_000_000_000, 5_000_000_000, 10_000_000_000,
    ],
    []
  );

  const durationOptions = useMemo(
    () => [
      { value: 1, label: "۱ ماه" },
      { value: 3, label: "۳ ماه" },
      { value: 6, label: "۶ ماه" },
      { value: 12, label: "۱۲ ماه" },
      { value: 24, label: "۲ سال" },
      { value: 36, label: "۳ سال" },
    ],
    []
  );

  // 🔢 فرمت فارسی عدد
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("fa-IR").format(Math.round(num));

  // 📍 کمکی برای اسلایدر
  const getClosestValue = (val: number, arr: number[]) =>
    arr.reduce((prev, curr) =>
      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );

  const getNext = (current: number, arr: number[]) =>
    arr[arr.indexOf(current) + 1] ?? current;
  const getPrev = (current: number, arr: number[]) =>
    arr[arr.indexOf(current) - 1] ?? current;

  // Risk level colors
  const getRiskColor = (level: number) => {
    switch (level) {
      case 0:
        return "text-green-600 bg-green-50 border-green-300";
      case 1:
        return "text-orange-600 bg-orange-50 border-orange-300";
      case 2:
        return "text-red-600 bg-red-50 border-red-300";
      default:
        return "text-gray-600 bg-gray-50 border-gray-300";
    }
  };

  const getRiskLabel = (level: number) => {
    switch (level) {
      case 0:
        return "کم‌ریسک";
      case 1:
        return "متوسط";
      case 2:
        return "پرریسک";
      default:
        return "متوسط";
    }
  };

  // محاسبه هزینه تقریبی (فرمول بعداً اضافه می‌شود)
  const calculateEstimatedCost = () => {
    // این فرمول موقتی است و بعداً باید از سرور یا فرمول دقیق استفاده شود
    const baseRate = 0.01; // 1% از مبلغ
    const durationMultiplier = duration / 12; // ضریب مدت
    const riskMultiplier = riskLevel === 0 ? 0.8 : riskLevel === 1 ? 1 : 1.2;

    return amount * baseRate * durationMultiplier * riskMultiplier;
  };

  const estimatedCost = calculateEstimatedCost();

  // محاسبه بازده تخمینی و نرخ ماهیانه
  const getMonthlyRate = () => {
    // نرخ‌های ماهیانه بر اساس ریسک
    if (riskLevel === 0) return 0.07; // 7% ماهیانه برای کم‌ریسک
    if (riskLevel === 1) return 0.08; // 8% ماهیانه برای متوسط
    return 0.11; // 11% ماهیانه برای پرریسک
  };

  const monthlyRate = getMonthlyRate();
  const expectedReturn = amount * monthlyRate * duration;

  // تبدیل riskLevel به portfolioType
  const getPortfolioType = () => {
    if (riskLevel === 0) return "low";
    if (riskLevel === 1) return "medium";
    return "high";
  };

  const addToCart = useCartStore((state) => state.addToCart);
  const items = useCartStore((state) => state.items);

  // بررسی اینکه آیا این portfolio قبلاً به سبد اضافه شده
  const isInCart = items.some((item) => {
    if ("type" in item && item.type === "portfolio") {
      return (
        item.portfolioType === getPortfolioType() &&
        item.portfolioAmount === amount &&
        item.portfolioDuration === duration
      );
    }
    return false;
  });

  // افزودن به سبد خرید
  const handleAddToCart = async () => {
    if (isInCart) {
      toast.error("این سبد سرمایه‌ گذاری قبلاً به سبد خرید اضافه شده است");
      return;
    }

    setIsLoading(true);
    try {
      // ایجاد portfolio item برای zustand store
      const portfolioItem: InvestmentPortfolioItem = {
        id: `portfolio-${Date.now()}-${Math.random()}`, // unique ID
        type: "portfolio",
        portfolioType: getPortfolioType(),
        portfolioAmount: amount,
        portfolioDuration: duration,
        expectedReturn,
        monthlyRate,
        price: Math.round(estimatedCost),
      };

      // افزودن به zustand store (برای نمایش فوری در سبد خرید)
      addToCart(portfolioItem);

      toast.success("سبد سرمایه‌ گذاری با موفقیت به سبد خرید اضافه شد 🛒");
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        "خطا در افزودن به سبد خرید. لطفاً دوباره تلاش کنید.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="portfolio-selection-form"
      className="w-full bg-gradient-to-b from-white via-mySecondary/5 to-white py-16 md:py-24 relative overflow-hidden"
    >
      {/* Background decorative elements - reduced blur on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-mySecondary/10 rounded-full blur-xl md:blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-myPrimary/10 rounded-full blur-xl md:blur-3xl" />
      </div>

      <div className="container-xl relative z-10">
        {/* Header with animation */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-l from-mySecondary via-myPrimary to-mySecondary bg-clip-text text-transparent mb-4">
            سفارشی‌سازی سبد سرمایه‌گذاری
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            اطلاعات سرمایه‌ گذاری خود را وارد کنید تا بهترین سبد را برای شما
            انتخاب کنیم
          </p>
        </div>

        <div className="w-full">
          <div className="bg-gradient-to-br from-white via-gray-50/50 to-white rounded-3xl p-6 md:p-10 shadow-2xl border border-gray-200/50 backdrop-blur-sm hover:shadow-mySecondary/10 transition-shadow duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* مبلغ سرمایه‌گذاری */}
              <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-mySecondary/10 hover:border-mySecondary/30 transition-all duration-300 md:hover:scale-[1.02]">
                <div className="text-center text-lg font-bold mb-6 flex items-center justify-center gap-2 text-gray-900">
                  <div className="p-2 bg-mySecondary/10 rounded-xl group-hover:bg-mySecondary/20 transition-colors">
                    <Wallet size={24} className="text-mySecondary" />
                  </div>
                  مبلغ سرمایه‌گذاری
                </div>

                <div className="flex items-start justify-between gap-4 mb-4">
                  <button
                    onClick={() =>
                      setAmount((prev) => getNext(prev, amountSteps))
                    }
                    className="size-12 rounded-full bg-gradient-to-br from-mySecondary/10 to-mySecondary/20 hover:from-mySecondary/20 hover:to-mySecondary/30 text-mySecondary text-2xl font-bold flex items-center justify-center active:scale-90 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-mySecondary/20"
                  >
                    <span className="mt-1">+</span>
                  </button>

                  <div className="flex-1 mx-2">
                    <Slider
                      min={10_000_000}
                      max={10_000_000_000}
                      step={10_000_000}
                      value={amount}
                      onChange={(val) =>
                        setAmount(getClosestValue(Number(val), amountSteps))
                      }
                      trackStyle={{
                        background:
                          "linear-gradient(90deg, rgb(244,184,150) 0%, rgb(218,222,241) 100%)",
                        height: 8,
                        borderRadius: 4,
                      }}
                      railStyle={{
                        backgroundColor: "#DADEF1",
                        height: 8,
                        borderRadius: 4,
                      }}
                      handleStyle={{
                        borderColor: "#F4B896",
                        backgroundColor: "#fff",
                        width: 28,
                        height: 28,
                        marginTop: -10,
                        boxShadow: "0 2px 8px rgba(244, 184, 150, 0.4)",
                      }}
                    />
                    <div className="mx-2 mt-4 flex flex-row-reverse justify-between text-xs text-gray-500 font-medium">
                      <p>۱۰ میلیون</p>
                      <p>۱۰ میلیارد</p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setAmount((prev) => getPrev(prev, amountSteps))
                    }
                    className="size-12 rounded-full bg-gradient-to-br from-mySecondary/10 to-mySecondary/20 hover:from-mySecondary/20 hover:to-mySecondary/30 text-mySecondary text-2xl font-bold flex items-center justify-center active:scale-90 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-mySecondary/20"
                  >
                    <span className="mt-1">−</span>
                  </button>
                </div>

                <div className="mt-6 text-center p-4 bg-gradient-to-r from-mySecondary/5 via-transparent to-mySecondary/5 rounded-xl">
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-l from-mySecondary to-myPrimary bg-clip-text text-transparent">
                    {formatNumber(amount)}{" "}
                    <span className="font-normal text-gray-500 text-lg">
                      تومان
                    </span>
                  </div>
                </div>
              </div>

              {/* مدت سرمایه‌گذاری */}
              <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-myPrimary/10 hover:border-myPrimary/30 transition-all duration-300 md:hover:scale-[1.02]">
                <div className="text-center text-lg font-bold mb-6 flex items-center justify-center gap-2 text-gray-900">
                  <div className="p-2 bg-myPrimary/10 rounded-xl group-hover:bg-myPrimary/20 transition-colors">
                    <Clock size={24} className="text-myPrimary" />
                  </div>
                  مدت سرمایه‌گذاری
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {durationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDuration(option.value)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium relative overflow-hidden ${
                        duration === option.value
                          ? "bg-gradient-to-br from-myPrimary to-myPrimary/80 text-white border-myPrimary shadow-lg shadow-myPrimary/30 scale-105"
                          : "bg-white text-gray-700 border-gray-200 hover:border-myPrimary/50 hover:shadow-md hover:scale-105"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 text-center p-4 bg-gradient-to-r from-myPrimary/5 via-transparent to-myPrimary/5 rounded-xl">
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-l from-myPrimary to-mySecondary bg-clip-text text-transparent">
                    {durationOptions.find((opt) => opt.value === duration)
                      ?.label || "۶ ماه"}
                  </p>
                </div>
              </div>
            </div>

            {/* سطح ریسک */}
            <div className="mt-6 group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
              <div className="text-center text-lg font-bold mb-6 flex items-center justify-center gap-2 text-gray-900">
                <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <BarChart3 size={24} className="text-purple-500" />
                </div>
                سطح ریسک‌پذیری
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setRiskLevel((prev) => Math.min(2, prev + 1) as 0 | 1 | 2)
                  }
                  disabled={riskLevel === 2}
                  className="size-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 text-2xl font-bold flex items-center justify-center active:scale-90 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="mt-1">+</span>
                </button>

                <div className="flex-1 px-2">
                  <Slider
                    min={0}
                    max={2}
                    step={1}
                    value={riskLevel}
                    onChange={(val) => setRiskLevel(Number(val) as 0 | 1 | 2)}
                    marks={{
                      0: {
                        label: "کم",
                        style: { color: "#16a34a", fontWeight: 600 },
                      },
                      1: {
                        label: "متوسط",
                        style: { color: "#ea580c", fontWeight: 600 },
                      },
                      2: {
                        label: "بالا",
                        style: { color: "#dc2626", fontWeight: 600 },
                      },
                    }}
                    trackStyle={{
                      background:
                        riskLevel === 0
                          ? "linear-gradient(90deg, #16a34a 0%, #22c55e 100%)"
                          : riskLevel === 1
                          ? "linear-gradient(90deg, #ea580c 0%, #f97316 100%)"
                          : "linear-gradient(90deg, #dc2626 0%, #ef4444 100%)",
                      height: 8,
                      borderRadius: 4,
                      boxShadow:
                        riskLevel === 0
                          ? "0 2px 8px rgba(22, 163, 74, 0.3)"
                          : riskLevel === 1
                          ? "0 2px 8px rgba(234, 88, 12, 0.3)"
                          : "0 2px 8px rgba(220, 38, 38, 0.3)",
                    }}
                    railStyle={{
                      backgroundColor: "#e5e7eb",
                      height: 8,
                      borderRadius: 4,
                    }}
                    handleStyle={{
                      borderColor:
                        riskLevel === 0
                          ? "#16a34a"
                          : riskLevel === 1
                          ? "#ea580c"
                          : "#dc2626",
                      backgroundColor: "#fff",
                      width: 28,
                      height: 28,
                      marginTop: -10,
                      boxShadow:
                        riskLevel === 0
                          ? "0 2px 12px rgba(22, 163, 74, 0.4)"
                          : riskLevel === 1
                          ? "0 2px 12px rgba(234, 88, 12, 0.4)"
                          : "0 2px 12px rgba(220, 38, 38, 0.4)",
                    }}
                  />
                </div>
                <button
                  onClick={() =>
                    setRiskLevel((prev) => Math.max(0, prev - 1) as 0 | 1 | 2)
                  }
                  disabled={riskLevel === 0}
                  className="size-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 text-2xl font-bold flex items-center justify-center active:scale-90 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="mt-1">−</span>
                </button>
              </div>

              <div className="mt-8 text-center">
                <span
                  className={`inline-block px-8 py-4 rounded-2xl border-2 font-bold text-xl shadow-lg transition-all duration-300 ${getRiskColor(
                    riskLevel
                  )}`}
                >
                  {getRiskLabel(riskLevel)}
                </span>
              </div>
            </div>

            {/* نتیجه و دکمه افزودن به سبد */}
            <div className="mt-6 relative overflow-hidden bg-gradient-to-br from-mySecondary/10 via-myPrimary/5 to-mySecondary/10 rounded-3xl border-2 border-mySecondary/30 p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-mySecondary rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-myPrimary rounded-full blur-2xl" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-right space-y-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    💰 هزینه تخمینی سبد
                  </p>
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-l from-mySecondary to-myPrimary bg-clip-text text-transparent">
                    {formatNumber(estimatedCost)}{" "}
                    <span className="text-lg text-gray-600">تومان</span>
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      📈 بازده: {formatNumber(expectedReturn)} تومان
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || isInCart}
                  className={`group relative w-full md:w-auto px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
                    isInCart
                      ? "bg-gray-400 text-white"
                      : "bg-gradient-to-r from-mySecondary to-myPrimary hover:from-myPrimary hover:to-mySecondary text-white active:scale-95"
                  }`}
                >
                  {/* Button glow effect - disabled on mobile for performance */}
                  {!isInCart && !isLoading && !isMobile && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  )}

                  <ShoppingCart
                    size={24}
                    className={
                      !isInCart && !isLoading && !isMobile ? "animate-bounce" : ""
                    }
                  />
                  {isLoading
                    ? "در حال افزودن..."
                    : isInCart
                    ? "✓ در سبد خرید"
                    : "افزودن به سبد خرید"}
                </button>
              </div>

              <div className="relative z-10 mt-6 pt-6 border-t border-gray-300/50">
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                  <span className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full font-medium">
                    📊 نرخ ماهیانه: {(monthlyRate * 100).toFixed(0)}٪
                  </span>
                  <span className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full font-medium">
                    ⏱️ مدت: {duration} ماه
                  </span>
                  <span className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full font-medium">
                    🎯 ریسک: {getRiskLabel(riskLevel)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSelectionForm;
