// const CalculatorSection = () => {
//   return (
//     <section className="relative w-full h-screen bg-[#152c44] text-white snap-start">
//       <div className="absolute inset-0 bg-[url('/images/utiles/pattern1.svg')] opacity-10" />
//       <div className="container-xl h-full z-10">
//         {/* header */}
//         <div className="flex justify-center items-center flex-col mb-[72px]">
//           <h3>ماشین حساب</h3>
//         </div>
//         {/* body */}
//         <div></div>
//       </div>
//     </section>
//   );
// };

// export default CalculatorSection;

"use client";

import Link from "next/link";

const CalculatorSection = () => {
  return (
    <section className="relative w-full h-screen bg-[#152c44] text-white overflow-hidden">
      {/* پس‌زمینه با پترن */}
      <div className="absolute inset-0 bg-[url('/images/utiles/pattern1.svg')] opacity-10 z-0" />

      <div className="container-xl relative z-10 py-20 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="font-ch text-4xl lg:text-5xl mb-6">ماشین حساب</h2>
          <p className="font-ir text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto">
            ماشین حساب زیر نشون می‌ده که اگر در این طرح سرمایه‌گذاری می‌کردی،
            چقدر بازده بدست می‌آوردی.
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
          {/* بخش تنظیم مبلغ و مدت سرمایه‌گذاری */}
          <div className="flex flex-col w-full lg:w-7/12 gap-6">
            <div className="rounded-2xl border border-[#8B9BB4] bg-white text-[#1A0A3B] p-6">
              <p className="text-center text-lg font-semibold mb-8">
                مبلغ سرمایه‌گذاری
              </p>
              {/* مقدار و اسلایدر */}
              <div className="flex items-center justify-between">
                <button className="w-10 h-10 rounded-full bg-gray-200 text-2xl font-bold flex items-center justify-center">
                  +
                </button>
                <div className="flex-1 mx-4 h-1.5 rounded-full bg-gradient-to-r from-[#F4B896] to-[#DADEF1]" />
                <button className="w-10 h-10 rounded-full bg-gray-200 text-2xl font-bold flex items-center justify-center">
                  -
                </button>
              </div>
              <p className="mt-6 text-center font-ir font-bold">
                10,000,000 <span className="font-normal">تومان</span>
              </p>
            </div>

            <div className="rounded-2xl border border-[#8B9BB4] bg-white text-[#1A0A3B] p-6">
              <p className="text-center text-lg font-semibold mb-8">
                مدت سرمایه‌گذاری
              </p>
              {/* مقدار و اسلایدر */}
              <div className="flex items-center justify-between">
                <button className="w-10 h-10 rounded-full bg-gray-200 text-2xl font-bold flex items-center justify-center">
                  +
                </button>
                <div className="flex-1 mx-4 h-1.5 rounded-full bg-gradient-to-r from-[#F4B896] to-[#DADEF1]" />
                <button className="w-10 h-10 rounded-full bg-gray-200 text-2xl font-bold flex items-center justify-center">
                  -
                </button>
              </div>
              <p className="mt-6 text-center font-ir font-bold">یک ساله</p>
            </div>
          </div>

          {/* بخش نتیجه */}
          <div className="w-full h-[-webkit-fill-available] lg:w-5/12 flex flex-col items-center justify-center bg-[#1a0a3b]/50 rounded-2xl p-10">
            <p className="text-center text-2xl font-ch mb-8">
              نتیجه سرمایه‌گذاریت
            </p>
            <div className="bg-white text-[#1A0A3B] rounded-2xl py-8 px-12 flex items-center justify-center text-3xl font-ms">
              26,472,790 <span className="ml-2 text-lg font-ir">تومان</span>
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
