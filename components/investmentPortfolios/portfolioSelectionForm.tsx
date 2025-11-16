"use client";

import { useState, useMemo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Wallet, Clock, BarChart3, Calculator } from "lucide-react";

const PortfolioSelectionForm = () => {
  const [amount, setAmount] = useState(50_000_000); // 50 میلیون تومان
  const [duration, setDuration] = useState(6); // 6 ماه
  const [riskLevel, setRiskLevel] = useState<0 | 1 | 2>(1); // 0: کم، 1: متوسط، 2: بالا

  // 📊 مقادیر اسلایدرها
  const amountSteps = useMemo(
    () => [
      10_000_000, 20_000_000, 50_000_000, 100_000_000, 200_000_000,
      500_000_000, 1_000_000_000, 2_000_000_000, 5_000_000_000, 10_000_000_000,
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

  return (
    <section id="portfolio-selection-form" className="w-full bg-white py-16 md:py-24">
      <div className="container-xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            سفارشی‌سازی سبد سرمایه‌گذاری
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            اطلاعات سرمایه‌گذاری خود را وارد کنید تا بهترین سبد را برای شما
            انتخاب کنیم
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* مبلغ سرمایه‌گذاری */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <p className="text-center text-lg font-bold mb-6 flex items-center justify-center gap-2 text-gray-900">
                  <Wallet size={24} className="text-mySecondary" />
                  مبلغ سرمایه‌گذاری
                </p>

                <div className="flex items-start justify-between gap-4 mb-4">
                  <button
                    onClick={() =>
                      setAmount((prev) => getNext(prev, amountSteps))
                    }
                    className="size-10 rounded-full bg-mySecondary/10 hover:bg-mySecondary/20 text-mySecondary text-2xl font-bold flex items-center justify-center active:scale-95 transition"
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
                        height: 6,
                      }}
                      railStyle={{ backgroundColor: "#DADEF1", height: 6 }}
                      handleStyle={{
                        borderColor: "#aaa",
                        backgroundColor: "#fff",
                        width: 24,
                        height: 24,
                        marginTop: -9,
                      }}
                    />
                    <div className="mx-2 mt-3 flex flex-row-reverse justify-between text-xs text-gray-500">
                      <p>۱۰ میلیون</p>
                      <p>۱۰ میلیارد</p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setAmount((prev) => getPrev(prev, amountSteps))
                    }
                    className="size-10 rounded-full bg-mySecondary/10 hover:bg-mySecondary/20 text-mySecondary text-2xl font-bold flex items-center justify-center active:scale-95 transition"
                  >
                    <span className="mt-1">−</span>
                  </button>
                </div>

                <p className="mt-4 text-center text-xl font-bold text-gray-900">
                  {formatNumber(amount)}{" "}
                  <span className="font-normal text-gray-500">تومان</span>
                </p>
              </div>

              {/* مدت سرمایه‌گذاری */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <p className="text-center text-lg font-bold mb-6 flex items-center justify-center gap-2 text-gray-900">
                  <Clock size={24} className="text-mySecondary" />
                  مدت سرمایه‌گذاری
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {durationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDuration(option.value)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all font-medium ${
                        duration === option.value
                          ? "bg-mySecondary text-white border-mySecondary shadow-lg scale-105"
                          : "bg-white text-gray-700 border-gray-200 hover:border-mySecondary/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <p className="mt-6 text-center text-xl font-bold text-gray-900">
                  {durationOptions.find((opt) => opt.value === duration)
                    ?.label || "۶ ماه"}
                </p>
              </div>
            </div>

            {/* سطح ریسک */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-center text-lg font-bold mb-6 flex items-center justify-center gap-2 text-gray-900">
                <BarChart3 size={24} className="text-mySecondary" />
                سطح ریسک‌پذیری
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setRiskLevel((prev) => Math.max(0, prev - 1) as 0 | 1 | 2)}
                  className="size-10 rounded-full bg-mySecondary/10 hover:bg-mySecondary/20 text-mySecondary text-2xl font-bold flex items-center justify-center active:scale-95 transition"
                >
                  <span className="mt-1">−</span>
                </button>

                <div className="flex-1">
                  <Slider
                    min={0}
                    max={2}
                    step={1}
                    value={riskLevel}
                    onChange={(val) => setRiskLevel(Number(val) as 0 | 1 | 2)}
                    marks={{
                      0: { label: "کم", style: { color: "#16a34a" } },
                      1: { label: "متوسط", style: { color: "#ea580c" } },
                      2: { label: "بالا", style: { color: "#dc2626" } },
                    }}
                    trackStyle={{
                      background:
                        riskLevel === 0
                          ? "#16a34a"
                          : riskLevel === 1
                          ? "#ea580c"
                          : "#dc2626",
                      height: 6,
                    }}
                    railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
                    handleStyle={{
                      borderColor:
                        riskLevel === 0
                          ? "#16a34a"
                          : riskLevel === 1
                          ? "#ea580c"
                          : "#dc2626",
                      backgroundColor: "#fff",
                      width: 24,
                      height: 24,
                      marginTop: -9,
                    }}
                  />
                </div>

                <button
                  onClick={() => setRiskLevel((prev) => Math.min(2, prev + 1) as 0 | 1 | 2)}
                  className="size-10 rounded-full bg-mySecondary/10 hover:bg-mySecondary/20 text-mySecondary text-2xl font-bold flex items-center justify-center active:scale-95 transition"
                >
                  <span className="mt-1">+</span>
                </button>
              </div>

              <div className="mt-6 text-center">
                <span
                  className={`inline-block px-6 py-3 rounded-xl border-2 font-bold text-lg ${getRiskColor(
                    riskLevel
                  )}`}
                >
                  {getRiskLabel(riskLevel)}
                </span>
              </div>
            </div>

            {/* نتیجه و هزینه تخمینی */}
            <div className="mt-6 bg-gradient-to-br from-mySecondary/10 to-mySecondary/5 rounded-2xl border-2 border-mySecondary/20 p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calculator className="text-mySecondary" size={28} />
                <h3 className="text-xl font-bold text-gray-900">
                  هزینه تخمینی سبد
                </h3>
              </div>

              <p className="text-center text-3xl md:text-4xl font-bold text-mySecondary mb-2">
                {formatNumber(estimatedCost)}{" "}
                <span className="text-lg text-gray-600">تومان</span>
              </p>

              <p className="text-center text-sm text-gray-600">
                * این مبلغ تخمینی است و فرمول دقیق بعداً اضافه خواهد شد
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSelectionForm;
