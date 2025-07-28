"use client";

import Image from "next/image";
import { investmentPlansData } from "@/public/data";

const InvestmentPlansLanding = () => {
  return (
    <div className="container flex flex-col lg:flex-row justify-between gap-8 py-1 mb-20">
      {/* Text & Actions */}
      <div className="flex-1 flex flex-col gap-y-10 text-center justify-center">
        <h3 className="text-4xl font-bold text-gray-900 leading-tight">
          {investmentPlansData.title}
        </h3>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          {investmentPlansData.text}
        </p>
      </div>

      {/* Image Section */}
      <div className="flex-1 relative flex items-center justify-center mt-12 lg:mt-0">
        <div className="relative w-full h-[630px] overflow-hidden isolate">
          <div className="absolute inset-y-0 left-0 w-[80px] bg-[linear-gradient(to_right,_#fefefe_50%,_transparent_100%)] z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[110px] bg-[linear-gradient(to_left,_#fefefe_40%,_transparent_100%)] z-10 pointer-events-none" />
          <Image
            className="object-contain"
            fill
            src={investmentPlansData.image}
            alt="مشاوره سرمایه‌گذاری"
          />
        </div>
      </div>
    </div>
  );
};

export default InvestmentPlansLanding;
