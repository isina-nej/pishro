"use client";

import { useState } from "react";
import clsx from "clsx";
import { Bitcoin, LineChart, PieChart, XIcon } from "lucide-react";
import { InvestmentPlans, InvestmentPlan, InvestmentTag } from "@prisma/client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { useInvestmentStore } from "@/stores/investmentStore"; // ✅ import store

export const PlansListData = [
  { label: "ارز دیجیتال", Icon: Bitcoin },
  { label: "بورس", Icon: LineChart },
  { label: "ترکیبی", Icon: PieChart },
];

interface PlansListProps {
  investmentPlansData: InvestmentPlans & {
    plans: InvestmentPlan[];
    tags: InvestmentTag[];
  };
}

const riskLevels = ["کم ریسک", "ریسک متوسط", "ریسک بالا"];
const durations = ["۱ ماه", "۳ ماه", "۶ ماه", "۱۲ ماه", "۲ سال", "۳ سال"];

// Format amount: display in میلیون or میلیارد
function formatAmount(amount: number) {
  if (amount >= 1000) {
    return `${(amount / 1000).toLocaleString("fa-IR", {
      maximumFractionDigits: 1,
    })} میلیارد تومان`;
  }
  return `${amount.toLocaleString("fa-IR")} میلیون تومان`;
}

const PlansList = ({ investmentPlansData }: PlansListProps) => {
  const [amount, setAmount] = useState<number>(
    investmentPlansData.minAmount || 1000
  );
  const [risk, setRisk] = useState<number>(1);
  const [duration, setDuration] = useState<number>(3);

  const setInvestmentData = useInvestmentStore((state) => state.setData); // ✅ store setter

  const handleCreatePortfolio = (selectedType: string) => {
    setInvestmentData({
      type: selectedType,
      amount,
      risk,
      duration,
    });

    // Scroll to portfolio selection form section
    const portfolioFormSection = document.querySelector("#portfolio-selection-form");
    if (portfolioFormSection) {
      portfolioFormSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mt-10 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PlansListData.map((item, idx) => (
          <Drawer key={idx}>
            <DrawerTrigger asChild>
              <button className="group relative w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm shadow-lg transition-all flex items-center justify-center gap-2">
                <item.Icon className="h-5 w-5 text-white/80 group-hover:scale-110 transition-transform" />
                {item.label}
              </button>
            </DrawerTrigger>

            <DrawerContent className="rounded-t-2xl px-6 pb-8 pt-4 bg-gray-50 shadow-2xl border-t border-gray-200">
              <DrawerHeader className="text-center border-b pb-4 border-gray-200">
                <DrawerTitle className="text-2xl font-bold text-gray-800">
                  ساخت سبد سرمایه‌گذاری ({item.label})
                </DrawerTitle>
                <DrawerDescription className="text-gray-600 mt-1">
                  لطفاً اطلاعات زیر را وارد کنید:
                </DrawerDescription>
              </DrawerHeader>

              <div className="flex gap-6 justify-center items-center">
                {/* sliders */}
                <div className="space-y-8 mt-6 w-full max-w-2xl">
                  {/* Amount */}
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      میزان سرمایه (میلیون تومان)
                    </label>
                    <Slider
                      min={investmentPlansData.minAmount || 10}
                      max={investmentPlansData.maxAmount || 10000}
                      step={investmentPlansData.amountStep || 10}
                      value={[amount]}
                      onValueChange={([val]) => setAmount(val)}
                      className="h-3"
                      trackClassName="bg-gray-200"
                      rangeClassName="bg-green-600"
                      thumbClassName="border-green-600"
                    />
                    <div className="ltr flex justify-between text-xs text-gray-500 mt-1 font-medium">
                      <span>۱۰ میلیون</span>
                      <span>۱۰ میلیارد</span>
                    </div>
                    <div className="text-center mt-2 text-lg font-semibold text-green-700">
                      {formatAmount(amount)}
                    </div>
                  </div>

                  {/* Risk */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      میزان ریسک
                    </label>
                    <Slider
                      min={0}
                      max={2}
                      step={1}
                      value={[risk]}
                      onValueChange={([val]) => setRisk(val)}
                      className="h-3"
                      trackClassName="bg-gray-200"
                      rangeClassName={clsx(
                        risk === 0
                          ? "bg-green-500"
                          : risk === 1
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      )}
                      thumbClassName={clsx(
                        risk === 0
                          ? "border-green-600"
                          : risk === 1
                          ? "border-yellow-500"
                          : "border-red-600"
                      )}
                    />
                    <div className="flex ltr justify-between text-xs px-1 mt-2 font-medium">
                      {riskLevels.map((level, index) => (
                        <span
                          key={index}
                          className={clsx(
                            index === risk
                              ? risk === 0
                                ? "text-green-600 font-bold"
                                : risk === 1
                                ? "text-yellow-600 font-bold"
                                : "text-red-600 font-bold"
                              : "text-gray-500"
                          )}
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      مدت سرمایه‌گذاری
                    </label>
                    <Slider
                      min={0}
                      max={durations.length - 1}
                      step={1}
                      value={[duration]}
                      onValueChange={([val]) => setDuration(val)}
                      className="h-3"
                      rangeClassName="bg-indigo-500"
                      thumbClassName="border-indigo-600"
                    />
                    <div className="flex ltr justify-between text-xs text-gray-600 px-1 mt-2 font-medium">
                      {durations.map((d, i) => (
                        <span
                          key={i}
                          className={clsx(
                            i === duration
                              ? "text-indigo-600 font-bold"
                              : "text-gray-500"
                          )}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center gap-4">
                <button
                  onClick={() => handleCreatePortfolio(item.label)}
                  className="px-6 py-3 bg-gradient-to-r from-[#214254] to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:brightness-110 transition-all"
                >
                  سبد شخصی من را بساز
                </button>

                <DrawerClose className="text-sm text-gray-400 underline mt-2 hover:text-gray-600 transition-colors">
                  <XIcon />
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
    </div>
  );
};

export default PlansList;
