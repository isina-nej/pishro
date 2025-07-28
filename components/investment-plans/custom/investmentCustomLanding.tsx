// app/components/InvestmentCustomLanding.tsx
"use client";

import Image from "next/image";
import { useInvestmentStore } from "@/stores/investmentStore";
import TopArc from "./topArc";

const InvestmentCustomLanding = () => {
  const data = useInvestmentStore((state) => state.data);

  return (
    <>
      {/* Landing Section */}
      <div className="relative h-[90vh] w-full">
        {/* Background Image */}
        <Image
          alt="landing"
          src="/images/investment-plans/custom/landing.jpg"
          fill
          className="object-cover"
        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Top Arc Shape */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-[250px]">
          <TopArc />
        </div>

        {/* Text on top */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-0 flex justify-center items-center w-full h-[200px]">
          <div className="text-center w-full">
            <h1 className="text-2xl sm:text-4xl font-bold text-white drop-shadow-md">
              سبد سرمایه‌گذاری سفارشی شما آماده است
            </h1>
            <p className="mt-3 text-white/90">
              با توجه به اطلاعاتی که وارد کردید، مناسب‌ترین پیشنهاد برای شما
              تنظیم شده است.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic personalized info section */}
      <div className="bg-muted py-10 px-6 sm:px-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          تحلیل شما بر اساس اطلاعات وارد شده
        </h2>
        {data && data.amount && data.risk && data.type && data.duration ? (
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
            با توجه به اینکه میزان سرمایه‌ی شما <strong>{data.amount}</strong>{" "}
            میلیون تومان بوده، و سطح ریسک‌پذیری‌تان <strong>{data.risk}</strong>{" "}
            است، ما به شما سبدی با نوع <strong>{data.type}</strong> و دوره‌ی{" "}
            <strong>{data.duration}</strong> ماهه پیشنهاد می‌کنیم. این سبد شامل
            تنوعی از دارایی‌های امن و سودآور است که با هدف رشد تدریجی و
            کنترل‌شده طراحی شده‌اند.
          </p>
        ) : (
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
            لطفاً اطلاعات خود را تکمیل کنید تا پیشنهاد مناسب برای شما ارائه شود.
          </p>
        )}

        {/* Additional informative text */}
        <div className="mt-10 text-gray-600 max-w-3xl mx-auto leading-relaxed text-justify">
          <p>
            سرمایه‌گذاری هوشمندانه ترکیبی از دانش مالی، شناخت دقیق از بازار، و
            درک صحیح از اهداف شخصی است. در این مسیر، ما تلاش کرده‌ایم با تحلیل
            داده‌های شما، مسیر سرمایه‌گذاری‌ای را طراحی کنیم که نه‌تنها با سطح
            ریسک‌پذیری و توان مالی شما سازگار باشد، بلکه بتواند در بلندمدت
            بازدهی مناسبی نیز برایتان به ارمغان بیاورد. لازم به ذکر است که این
            سبدها به گونه‌ای طراحی شده‌اند که امکان به‌روزرسانی و اصلاح دوره‌ای
            داشته باشند، تا در صورت تغییر شرایط مالی یا اقتصادی، همچنان بتوانند
            عملکرد مناسبی از خود نشان دهند.
          </p>
        </div>
      </div>
    </>
  );
};

export default InvestmentCustomLanding;
