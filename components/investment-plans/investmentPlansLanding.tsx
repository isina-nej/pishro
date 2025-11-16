"use client";

import Image from "next/image";
import { InvestmentPlans, InvestmentPlan, InvestmentTag } from "@prisma/client";

interface InvestmentPlansLandingProps {
  investmentPlansData: InvestmentPlans & {
    plans: InvestmentPlan[];
    tags: InvestmentTag[];
  };
}

const InvestmentPlansLanding = ({
  investmentPlansData,
}: InvestmentPlansLandingProps) => {
  return (
    <div className="relative w-full h-screen lg:h-screen overflow-hidden isolate flex items-center justify-start text-center px-4 mb-32">
      {/* Image behind everything */}
      <Image
        src={investmentPlansData.image || "/images/investment-plans.jpg"}
        alt="سبدهای سرمایه‌گذاری"
        fill
        className="object-cover z-0"
        priority
      />

      {/* Gradient overlay to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/95 via-black/60 to-black/5 z-10 pointer-events-none" />

      {/* Text content over image */}
      <div className="relative z-20 max-w-2xl text-white flex flex-col items-center rtl gap-y-8 px-8">
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
          {investmentPlansData.title}
        </h1>
        <p className="text-lg lg:text-xl text-white/90 lg:leading-8">
          {investmentPlansData.description}
        </p>
      </div>
    </div>
  );
};

export default InvestmentPlansLanding;
