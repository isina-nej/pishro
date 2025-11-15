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
      <div className="relative h-screen w-full">
        {/* Background Image */}
        <Image
          alt="landing"
          src="/images/investment-plans/custom/landing.jpg"
          fill
          className="object-cover"
        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Top Arc Shape */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-[200px]">
          <TopArc />
        </div>

        {/* Text on top */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-0 flex justify-center items-center w-full h-[150px]">
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
      <div className="bg-muted py-10 px-6 sm:px-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          سبد سرمایه‌گذاری شخصی‌سازی شده شما
        </h2>
        {data && data.amount && data.risk && data.type && data.duration ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Investment Overview */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                خلاصه سرمایه‌گذاری شما
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">مبلغ سرمایه‌گذاری:</span>
                  <strong className="text-gray-800">
                    {data.amount.toLocaleString("fa-IR")} میلیون تومان
                  </strong>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">نوع سرمایه‌گذاری:</span>
                  <strong className="text-gray-800">{data.type}</strong>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">سطح ریسک:</span>
                  <strong className="text-gray-800">
                    {data.risk === 1
                      ? "کم"
                      : data.risk === 2
                      ? "متوسط"
                      : data.risk === 3
                      ? "بالا"
                      : data.risk}
                  </strong>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">دوره سرمایه‌گذاری:</span>
                  <strong className="text-gray-800">
                    {data.duration} ماه
                  </strong>
                </div>
              </div>
            </div>

            {/* Risk-based recommendations */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                توصیه‌های سرمایه‌گذاری
              </h3>
              <div className="text-gray-700 leading-relaxed space-y-3">
                {data.risk === 1 && (
                  <p>
                    با توجه به سطح ریسک پایین شما، سبد سرمایه‌گذاری شامل
                    دارایی‌های با ثبات و کم‌نوسان مانند اوراق مشارکت، صندوق‌های
                    درآمد ثابت و سپرده‌های بانکی می‌باشد. این سبد برای حفظ ارزش
                    سرمایه و کسب سود تضمینی طراحی شده است.
                  </p>
                )}
                {data.risk === 2 && (
                  <p>
                    با توجه به سطح ریسک متوسط شما، سبد سرمایه‌گذاری ترکیبی از
                    دارایی‌های با ریسک متوسط شامل سهام شرکت‌های بزرگ و
                    باثبات، صندوق‌های مختلط و بخشی از اوراق با درآمد ثابت
                    می‌باشد. این سبد تعادل مناسبی بین امنیت و بازدهی را برای شما
                    فراهم می‌کند.
                  </p>
                )}
                {data.risk === 3 && (
                  <p>
                    با توجه به سطح ریسک‌پذیری بالای شما، سبد سرمایه‌گذاری شامل
                    دارایی‌های رشدی مانند سهام شرکت‌های کوچک و متوسط، صندوق‌های
                    سهامی فعال و بخشی از ارزهای دیجیتال می‌باشد. این سبد پتانسیل
                    بازدهی بالایی دارد اما با نوسانات بیشتری همراه است.
                  </p>
                )}
                {data.duration <= 6 && (
                  <p className="mt-3 text-amber-700 bg-amber-50 p-3 rounded">
                    💡 با توجه به دوره کوتاه‌مدت سرمایه‌گذاری شما ({data.duration}{" "}
                    ماه)، توصیه می‌شود روی دارایی‌های با نقدشوندگی بالا تمرکز
                    کنید.
                  </p>
                )}
                {data.duration > 6 && data.duration <= 24 && (
                  <p className="mt-3 text-blue-700 bg-blue-50 p-3 rounded">
                    💡 با توجه به دوره میان‌مدت سرمایه‌گذاری شما ({data.duration}{" "}
                    ماه)، می‌توانید ترکیبی متعادل از دارایی‌های کوتاه‌مدت و
                    بلندمدت را در سبد خود داشته باشید.
                  </p>
                )}
                {data.duration > 24 && (
                  <p className="mt-3 text-green-700 bg-green-50 p-3 rounded">
                    💡 با توجه به دوره بلندمدت سرمایه‌گذاری شما ({data.duration}{" "}
                    ماه)، فرصت مناسبی برای سرمایه‌گذاری در دارایی‌های رشدی و
                    بهره‌مندی از قدرت سود مرکب دارید.
                  </p>
                )}
              </div>
            </div>

            {/* Next steps */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                مراحل بعدی
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>
                    جهت دریافت مشاوره تخصصی و تنظیم دقیق سبد سرمایه‌گذاری با
                    کارشناسان ما تماس بگیرید
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>
                    مدارک شناسایی و اطلاعات بانکی خود را برای افتتاح حساب آماده
                    کنید
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>
                    پس از تایید نهایی، سرمایه خود را طبق برنامه‌ریزی انجام شده
                    واریز نمایید
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto text-center">
            لطفاً ابتدا اطلاعات سرمایه‌گذاری خود را در فرم مربوطه وارد کنید تا
            سبد شخصی‌سازی شده برای شما تهیه شود.
          </p>
        )}
      </div>
    </>
  );
};

export default InvestmentCustomLanding;
