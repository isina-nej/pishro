"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import CountUp from "react-countup";
import { Wallet, Clock, BarChart3, PhoneCall, Send, XIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const CalculatorSection = () => {
  // 🧩 stateها
  const [amount, setAmount] = useState(10_000_000);
  const [duration, setDuration] = useState(6);
  const [portfolio, setPortfolio] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [result, setResult] = useState(0);

  const prevResultRef = useRef(result);

  // 💰 نرخ‌های سود بر اساس نوع سبد
  const rates = useMemo(
    () => ({
      low: 0.07, // 7 درصد ماهیانه
      medium: 0.08, // 8 درصد ماهیانه
      high: 0.11, // 11 درصد ماهیانه
    }),
    []
  );

  // 📊 متن توضیح برای هر نوع سبد
  const portfolioDescription = useMemo(
    () => ({
      low: "تضمین اصل سرمایه و سود بازدهی ثابت",
      medium: "تضمین اصل سرمایه و سود بازدهی ثابت",
      high: "تضمین اصل سرمایه با بازدهی بین ۵ تا ۵۰ درصد",
    }),
    []
  );

  // 📊 مقادیر اسلایدرها
  const amountSteps = [
    1_000_000, 10_000_000, 20_000_000, 30_000_000, 40_000_000, 50_000_000,
    60_000_000, 70_000_000, 80_000_000, 90_000_000, 100_000_000, 200_000_000,
    300_000_000, 500_000_000, 1_000_000_000, 2_000_000_000, 3_000_000_000,
    5_000_000_000,
  ];
  const durationSteps = [1, 3, 6, 9, 12];

  // 🧮 محاسبه سود مرکب بر اساس نوع سبد
  useEffect(() => {
    const rate = rates[portfolio];
    // فرمول سود مرکب
    const newResult = amount * Math.pow(1 + rate, duration);
    prevResultRef.current = result;
    setResult(newResult);
  }, [amount, duration, portfolio, rates, result]);
  // 🔢 فرمت فارسی عدد
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("fa-IR").format(Math.round(num));

  // 📍 کمکی برای اسلایدر و دکمه‌ها
  const getClosestValue = (val: number, arr: number[]) =>
    arr.reduce((prev, curr) =>
      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );

  const getNext = (current: number, arr: number[]) =>
    arr[arr.indexOf(current) + 1] ?? current;
  const getPrev = (current: number, arr: number[]) =>
    arr[arr.indexOf(current) - 1] ?? current;

  return (
    <section className="relative w-full min-h-[600px] md:min-h-screen bg-[#152c44] text-white overflow-hidden mt-8 md:mt-20">
      {/* pattern background */}
      <div className="absolute inset-0 bg-[url('/images/utiles/pattern1.svg')] opacity-10 z-0" />

      <div className="container-xl relative z-10 py-6 md:py-10 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10 px-2">
          <h4 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-2 md:mb-4 mt-10 md:mt-0">
            ماشین حساب
          </h4>
          <p className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-200 max-w-2xl mx-auto bg-[#152c44]/70">
            با انتخاب نوع سبد سرمایه‌ گذاری، مبلغ و مدت، میزان بازده خود را
            مشاهده کنید.
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 md:gap-10 lg:flex-row items-center justify-center">
          {/* Controls */}
          <div className="flex flex-col w-full lg:w-7/12 gap-4 px-1 md:px-0">
            {/* سبد سرمایه‌ گذاری */}
            <div className="rounded-2xl border border-[#8B9BB4] bg-white text-[#1A0A3B] px-4 sm:px-6 py-4">
              <p className="text-center text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                <BarChart3 size={22} className="text-[#1A0A3B]" />
                نوع سبد سرمایه‌ گذاری
              </p>

              <div className="flex items-center justify-center gap-4">
                {[
                  { key: "low", label: "کم‌ریسک" },
                  { key: "medium", label: "متوسط" },
                  { key: "high", label: "پر‌ریسک" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() =>
                      setPortfolio(item.key as "low" | "medium" | "high")
                    }
                    className={`px-5 py-2 rounded-full border transition-all  ${
                      portfolio === item.key
                        ? "bg-mySecondary text-white border-mySecondary"
                        : "bg-gray-100 text-mySecondary border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* مبلغ سرمایه‌ گذاری */}
            <div className="rounded-2xl border border-[#8B9BB4] bg-white text-[#1A0A3B] px-4 sm:px-6 py-4">
              <p className="text-center text-lg font-bold mb-8 flex items-center justify-center gap-2">
                <Wallet size={24} className="text-[#1A0A3B]" />
                مبلغ سرمایه‌ گذاری
              </p>

              <div className="flex items-start justify-between gap-4">
                <button
                  onClick={() =>
                    setAmount((prev) => getNext(prev, amountSteps))
                  }
                  className="size-6 md:size-10 rounded-full bg-gray-200 text-2xl font-bold flex items-center justify-center active:scale-95"
                >
                  <span className="mt-1">+</span>
                </button>

                <div className="flex-1 mx-2">
                  <Slider
                    min={1_000_000}
                    max={5_000_000_000}
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
                    railStyle={{ backgroundColor: "#DADEF1", height: 6 }}
                    handleStyle={{
                      borderColor: "#aaa",
                      backgroundColor: "#fff",
                      width: 24,
                      height: 24,
                      marginTop: -9,
                    }}
                  />
                  {/* ⬇️ Label range below slider */}
                  <div className="md:mx-2 mt-3 flex flex-row-reverse justify-between text-sm text-gray-900">
                    <p>۱ میلیون تومان</p>
                    <p>5 میلیارد تومان</p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setAmount((prev) => getPrev(prev, amountSteps))
                  }
                  className="size-6 md:size-10 rounded-full bg-gray-200 text-2xl font-bold flex items-center justify-center active:scale-95"
                >
                  <span className="mt-1">−</span>
                </button>
              </div>

              <p className="mt-6 text-center  font-bold text-[#1A0A3B]">
                {formatNumber(amount)}{" "}
                <span className="font-normal">تومان</span>
              </p>
            </div>

            {/* مدت سرمایه‌ گذاری */}
            <div className="rounded-2xl border border-[#8B9BB4] bg-white text-[#1A0A3B] px-4 sm:px-6 py-4">
              <p className="text-center text-lg font-bold mb-8 flex items-center justify-center gap-2">
                <Clock size={24} className="text-[#1A0A3B]" />
                مدت سرمایه‌ گذاری
              </p>

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() =>
                    setDuration((prev) => getNext(prev, durationSteps))
                  }
                  className="size-6 md:size-10 rounded-full bg-gray-200 text-2xl font-bold flex items-center justify-center active:scale-95"
                >
                  <span className="mt-1">+</span>
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
                    railStyle={{ backgroundColor: "#DADEF1", height: 6 }}
                    handleStyle={{
                      borderColor: "#aaa",
                      backgroundColor: "#fff",
                      width: 24,
                      height: 24,
                      marginTop: -9,
                    }}
                  />
                  {/* ⬇️ Label range below slider */}
                  <div className="sm:mx-2 mt-3 flex flex-row-reverse justify-between text-sm text-gray-900">
                    <p>۱ ماه</p>
                    <p>۱۲ ماه</p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setDuration((prev) => getPrev(prev, durationSteps))
                  }
                  className="size-6 md:size-10 rounded-full bg-gray-200 text-2xl font-bold flex items-center justify-center active:scale-95"
                >
                  <span className="mt-1">−</span>
                </button>
              </div>

              <p className="mt-6 text-center  font-bold text-[#1A0A3B]">
                {duration} ماهه
              </p>
            </div>
          </div>

          {/* Result */}
          <div className="w-full h-[-webkit-fill-available] lg:w-5/12 flex flex-col items-center justify-center bg-[#1a0a3b]/50 rounded-2xl p-4 md:p-10 mt-6 md:mt-0 mb-10 md:mb-0">
            <p className="text-center text-2xl font-bold mb-8">
              نتیجه سرمایه‌ گذاریت
            </p>

            {/* Result box */}
            <div className="bg-white text-[#1A0A3B] rounded-2xl pt-8 pb-4 px-4 flex flex-col items-center justify-center text-3xl font-medium shadow-lg relative">
              {/* قیمت و درصد سود */}
              <div className="flex items-center justify-between w-full gap-4 mb-4">
                {/* مبلغ کل - سمت راست */}
                <div className="flex flex-1 justify-center">
                  <CountUp
                    start={prevResultRef.current}
                    end={result}
                    duration={0.8}
                    separator=","
                    formattingFn={(n) => formatNumber(n)}
                  />
                  <span className="mr-2 mt-1 text-lg font-bold text-gray-400">
                    تومان
                  </span>
                </div>
                {/* درصد سود ماهیانه - سمت چپ */}
                <div className="flex flex-col items-center bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl px-4 py-3 shadow-sm border border-orange-200">
                  <p className="text-xs text-orange-600 font-medium mb-1">
                    سود ماهیانه
                  </p>
                  <p className="text-2xl font-bold text-orange-700">
                    {(rates[portfolio] * 100).toFixed(0)}٪
                  </p>
                </div>
              </div>

              {/* 🛡 پیام تضمین سرمایه */}
              <div className="mt-4 flex items-start gap-2 bg-green-100 border border-green-300 rounded-xl px-4 py-3 text-green-700 text-sm font-medium shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <p className="leading-relaxed">
                  {portfolioDescription[portfolio]}
                </p>
              </div>
            </div>

            <Link
              href="/investment-plans"
              className="mt-10 px-16 w-full sm:w-fit bg-mySecondary border border-mySecondary text-white rounded-full py-4 font-bold text-center hover:bg-mySecondary/30 hover:border-white transition-colors"
            >
              سرمایه‌ گذاری
            </Link>
          </div>
        </div>

        {/* دکمه‌های تماس با مشاورین - در پایین سکشن */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-10 w-full mt-16 mb-2 px-4">
          {/* 📍 مشاوره حضوری */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="group relative w-full sm:w-auto px-10 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm shadow-lg transition-all flex items-center justify-center gap-2">
                <PhoneCall className="h-5 w-5 text-green-400 group-hover:scale-110 transition-transform" />
                رزرو مشاوره حضوری
              </button>
            </DrawerTrigger>
            <DrawerContent className="p-6 rounded-t-2xl border-t bg-white shadow-2xl">
              <DrawerHeader className="text-center">
                <div className="flex justify-center">
                  <PhoneCall className="text-green-600 h-10 w-10" />
                </div>
                <DrawerTitle className="text-2xl font-bold text-gray-900 mt-2">
                  مشاوره حضوری
                </DrawerTitle>
                <DrawerDescription className="text-center text-gray-600 mt-1">
                  برای رزرو مشاوره حضوری با ما تماس بگیرید:
                </DrawerDescription>
              </DrawerHeader>
              <div className="text-center mt-4 space-y-3">
                <p className="text-xl font-semibold text-green-700 tracking-tight">
                  0912-123-4567
                </p>
                <a
                  href="tel:09121234567"
                  className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
                >
                  تماس بگیرید
                </a>
              </div>
              <DrawerFooter>
                <DrawerClose className="block mt-6 text-sm text-gray-400 hover:text-gray-600 underline text-center">
                  <XIcon className="inline-block" />
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* 💻 مشاوره آنلاین */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="group relative w-full sm:w-auto px-10 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm shadow-lg transition-all flex items-center justify-center gap-2">
                <Send className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                رزرو مشاوره آنلاین
              </button>
            </DrawerTrigger>
            <DrawerContent className="p-6 rounded-t-2xl border-t bg-white shadow-2xl">
              <DrawerHeader className="text-center">
                <div className="flex justify-center">
                  <Send className="text-blue-600 h-10 w-10" />
                </div>
                <DrawerTitle className="text-2xl font-bold text-gray-900 mt-2">
                  مشاوره آنلاین
                </DrawerTitle>
                <DrawerDescription className="text-center text-gray-600 mt-1">
                  برای دریافت مشاوره آنلاین از طریق تلگرام پیام دهید:
                </DrawerDescription>
              </DrawerHeader>
              <div className="text-center mt-4 space-y-3">
                <p className="text-xl font-semibold text-blue-700 tracking-tight">
                  @InvestmentSupport
                </p>
                <Link
                  href="https://t.me/amirhossein_v2"
                  target="_blank"
                  className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
                >
                  پیام در تلگرام
                </Link>
              </div>
              <DrawerFooter>
                <DrawerClose className="block mt-6 text-sm text-gray-400 hover:text-gray-600 underline text-center">
                  <XIcon className="inline-block" />
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
