"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import CountUp from "react-countup";

const CalculatorSection = () => {
  // 🧩 مقادیر اصلی
  const [amount, setAmount] = useState(10_000_000); // مبلغ سرمایه‌گذاری (تومان)
  const [duration, setDuration] = useState(6); // مدت سرمایه‌گذاری (ماه)
  const [result, setResult] = useState(0); // نتیجه نهایی

  const prevResultRef = useRef(result);

  // 💰 نرخ سود سالانه
  const rate = 0.25;

  // 📊 مقادیر مجاز برای اسلایدرها
  const amountSteps = [
    1_000_000, 10_000_000, 20_000_000, 30_000_000, 40_000_000, 50_000_000,
    60_000_000, 70_000_000, 80_000_000, 90_000_000, 100_000_000,
  ];
  const durationSteps = [1, 3, 6, 9, 12];

  // ⏳ محاسبه خودکار نتیجه
  useEffect(() => {
    const profit = amount * rate * (duration / 12);
    const newResult = amount + profit;
    prevResultRef.current = result;
    setResult(newResult);
  }, [amount, duration, result]);

  // 🔢 فرمت نمایش عدد به فارسی
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("fa-IR").format(Math.round(num));

  // 🧮 پیدا کردن نزدیک‌ترین مقدار مجاز برای اسلایدر
  const getClosestValue = (val: number, arr: number[]) => {
    return arr.reduce((prev, curr) =>
      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );
  };

  // 📍 برای دکمه‌ها
  const getNext = (current: number, arr: number[]) =>
    arr[arr.indexOf(current) + 1] ?? current;
  const getPrev = (current: number, arr: number[]) =>
    arr[arr.indexOf(current) - 1] ?? current;

  return (
    <section className="relative w-full min-h-screen bg-[#152c44] text-white overflow-hidden">
      {/* پس‌زمینه پترن */}
      <div className="absolute inset-0 bg-[url('/images/utiles/pattern1.svg')] opacity-10 z-0" />

      <div className="container-xl relative z-10 py-10 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-ch text-4xl lg:text-5xl mb-4">ماشین حساب</h2>
          <p className="font-ir text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto bg-[#152c44]/70">
            ماشین حساب زیر نشون می‌ده که اگر در این طرح سرمایه‌گذاری می‌کردی،
            چقدر بازده بدست می‌آوردی.
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
          {/* بخش تنظیمات */}
          <div className="flex flex-col w-full lg:w-7/12 gap-6">
            {/* مبلغ سرمایه‌گذاری */}
            <div className="rounded-2xl border border-[#8B9BB4] bg-white text-[#1A0A3B] p-6">
              <p className="text-center text-lg font-semibold mb-8">
                مبلغ سرمایه‌گذاری
              </p>

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() =>
                    setAmount((prev) => getNext(prev, amountSteps))
                  }
                  className="w-10 h-10 rounded-full bg-gray-200 text-2xl font-bold flex items-center justify-center active:scale-95"
                >
                  +
                </button>

                <div className="flex-1 mx-2">
                  <Slider
                    min={1_000_000}
                    max={100_000_000}
                    step={1_000_000}
                    value={amount}
                    onChange={(val) =>
                      setAmount(getClosestValue(Number(val), amountSteps))
                    }
                    trackStyle={{
                      background:
                        "linear-gradient(90deg, rgb(244,184,150) 0%, rgb(218,222,241) 100%)",
                      height: 6,
                    }}
                    railStyle={{
                      backgroundColor: "#DADEF1",
                      height: 6,
                    }}
                    handleStyle={{
                      borderColor: "#aaa",
                      backgroundColor: "#fff",
                      width: 24,
                      height: 24,
                      marginTop: -9,
                    }}
                  />
                </div>

                <button
                  onClick={() =>
                    setAmount((prev) => getPrev(prev, amountSteps))
                  }
                  className="w-10 h-10 rounded-full bg-gray-200 text-2xl font-bold flex items-center justify-center active:scale-95"
                >
                  −
                </button>
              </div>

              <p className="mt-6 text-center font-ir font-bold text-[#1A0A3B]">
                {formatNumber(amount)}{" "}
                <span className="font-normal">تومان</span>
              </p>

              <div className="mx-2 mt-3 flex flex-row-reverse justify-between text-sm text-[#6b5ea0]">
                <p>۱ میلیون تومان</p>
                <p>۱۰۰ میلیون تومان</p>
              </div>
            </div>

            {/* مدت سرمایه‌گذاری */}
            <div className="rounded-2xl border border-[#8B9BB4] bg-white text-[#1A0A3B] p-6">
              <p className="text-center text-lg font-semibold mb-8">
                مدت سرمایه‌گذاری
              </p>

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() =>
                    setDuration((prev) => getNext(prev, durationSteps))
                  }
                  className="w-10 h-10 rounded-full bg-gray-200 text-2xl font-bold flex items-center justify-center active:scale-95"
                >
                  +
                </button>

                <div className="flex-1 mx-2">
                  <Slider
                    min={1}
                    max={12}
                    step={1}
                    value={duration}
                    onChange={(val) =>
                      setDuration(getClosestValue(Number(val), durationSteps))
                    }
                    trackStyle={{
                      background:
                        "linear-gradient(90deg, rgb(244,184,150) 0%, rgb(218,222,241) 100%)",
                      height: 6,
                    }}
                    railStyle={{
                      backgroundColor: "#DADEF1",
                      height: 6,
                    }}
                    handleStyle={{
                      borderColor: "#aaa",
                      backgroundColor: "#fff",
                      width: 24,
                      height: 24,
                      marginTop: -9,
                    }}
                  />
                </div>

                <button
                  onClick={() =>
                    setDuration((prev) => getPrev(prev, durationSteps))
                  }
                  className="w-10 h-10 rounded-full bg-gray-200 text-2xl font-bold flex items-center justify-center active:scale-95"
                >
                  −
                </button>
              </div>

              <p className="mt-6 text-center font-ir font-bold text-[#1A0A3B]">
                {duration} ماهه
              </p>

              <div className="mx-2 mt-3 flex flex-row-reverse justify-between text-sm text-[#6b5ea0]">
                <p>۱ ماه</p>
                <p>۱۲ ماه</p>
              </div>
            </div>
          </div>

          {/* بخش نتیجه */}
          <div className="w-full lg:w-5/12 flex flex-col items-center justify-center bg-[#1a0a3b]/50 rounded-2xl p-10">
            <p className="text-center text-2xl font-ch mb-8">
              نتیجه سرمایه‌گذاریت
            </p>

            <div className="bg-white text-[#1A0A3B] rounded-2xl py-8 px-12 flex items-center justify-center text-3xl font-ms">
              <CountUp
                start={prevResultRef.current}
                end={result}
                duration={0.8}
                separator=","
                formattingFn={(n) => formatNumber(n)}
              />
              <span className="ml-2 text-lg font-ir">تومان</span>
            </div>

            <Link
              href="/plans/gold#plan-banner"
              className="mt-10 w-full bg-mySecondary text-white rounded-full py-3 font-bold text-center hover:bg-[#ffd6b6] transition-colors"
            >
              سرمایه‌گذاری
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
