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
    const portfolioFormSection = document.querySelector(
      "#portfolio-selection-form"
    );
    if (portfolioFormSection) {
      portfolioFormSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="mt-10 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PlansListData.map((item, idx) => (
          <Drawer key={idx}>
            <DrawerTrigger asChild>
              <button className="group relative flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-card px-6 py-3 font-medium text-mySecondary shadow-lg shadow-emerald-950/5 transition-all hover:border-primary hover:bg-primary sm:w-auto dark:border-borderColor dark:bg-cardBg dark:text-textPrimary dark:hover:bg-darkBgHidden">
                <item.Icon className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                {item.label}
              </button>
            </DrawerTrigger>

            <DrawerContent className="rounded-t-2xl px-6 pb-8 pt-4 bg-muted dark:bg-darkBgHidden shadow-2xl border-t border-border dark:border-borderColor">
              <DrawerHeader className="text-center border-b pb-4 border-border dark:border-borderColor">
                <DrawerTitle className="text-2xl font-bold text-foreground dark:text-textPrimary">
                  ساخت سبد سرمایه‌ گذاری ({item.label})
                </DrawerTitle>
                <DrawerDescription className="text-muted-foreground dark:text-textSecondary mt-1">
                  لطفاً اطلاعات زیر را وارد کنید:
                </DrawerDescription>
              </DrawerHeader>

              <div className="flex gap-6 justify-center items-center">
                {/* sliders */}
                <div className="space-y-8 mt-6 w-full max-w-2xl">
                  {/* Amount */}
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-muted-foreground dark:text-textPrimary">
                      میزان سرمایه (میلیون تومان)
                    </label>
                    <Slider
                      min={investmentPlansData.minAmount || 10}
                      max={investmentPlansData.maxAmount || 10000}
                      step={investmentPlansData.amountStep || 10}
                      value={[amount]}
                      onValueChange={([val]) => setAmount(val)}
                      className="h-3"
                      trackClassName="bg-muted dark:bg-darkBgHidden"
                      rangeClassName="bg-primary"
                      thumbClassName="border-primary"
                    />
                    <div className="ltr flex justify-between text-xs text-muted-foreground dark:text-textSecondary mt-1 font-medium">
                      <span>۱۰ میلیون</span>
                      <span>۱۰ میلیارد</span>
                    </div>
                    <div className="text-center mt-2 text-lg font-semibold text-primary">
                      {formatAmount(amount)}
                    </div>
                  </div>

                  {/* Risk */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-muted-foreground dark:text-textPrimary">
                      میزان ریسک
                    </label>
                    <Slider
                      min={0}
                      max={2}
                      step={1}
                      value={[risk]}
                      onValueChange={([val]) => setRisk(val)}
                      className="h-3"
                      trackClassName="bg-muted dark:bg-darkBgHidden"
                      rangeClassName={clsx(
                        risk === 0
                          ? "bg-primary"
                          : risk === 1
                          ? "bg-premium"
                          : "bg-destructive"
                      )}
                      thumbClassName={clsx(
                        risk === 0
                          ? "border-primary"
                          : risk === 1
                          ? "border-premium"
                          : "border-destructive"
                      )}
                    />
                    <div className="flex ltr justify-between text-xs px-1 mt-2 font-medium">
                      {riskLevels.map((level, index) => (
                        <span
                          key={index}
                          className={clsx(
                            index === risk
                              ? risk === 0
                                ? "text-primary font-bold"
                                : risk === 1
                                ? "text-premium font-bold"
                                : "text-destructive font-bold"
                              : "text-muted-foreground dark:text-textSecondary"
                          )}
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-muted-foreground dark:text-textPrimary">
                      مدت سرمایه‌ گذاری
                    </label>
                    <Slider
                      min={0}
                      max={durations.length - 1}
                      step={1}
                      value={[duration]}
                      onValueChange={([val]) => setDuration(val)}
                      className="h-3"
                      rangeClassName="bg-primary"
                      thumbClassName="border-primary"
                    />
                    <div className="flex ltr justify-between text-xs text-muted-foreground dark:text-textSecondary px-1 mt-2 font-medium">
                      {durations.map((d, i) => (
                        <span
                          key={i}
                          className={clsx(
                            i === duration
                              ? "text-primary font-bold"
                              : "text-muted-foreground dark:text-textSecondary"
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
                  className="px-6 py-3 bg-gradient-to-r from-[#214254] to-primary text-foreground font-semibold rounded-xl shadow-lg hover:brightness-110 transition-all"
                >
                  سبد شخصی من را بساز
                </button>

                <DrawerClose className="text-sm text-muted-foreground dark:text-textSecondary underline mt-2 hover:text-muted-foreground dark:hover:text-textSecondary transition-colors">
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
