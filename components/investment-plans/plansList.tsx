"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
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
import LottieRemote from "@/components/utils/LottieAnimation";

export const PlansListData = [
  { src: "/images/home/c/crypto.jpg", label: "ارز دیجیتال" },
  { src: "/images/home/c/stock.jpg", label: "بورس" },
  { src: "/images/home/c/metaverse.webp", label: "ترکیبی" },
];
const animationVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 0 },
};
const riskLevels = ["کم ریسک", "ریسک متوسط", "ریسک بالا"];
const durations = ["۱ ماه", "۳ ماه", "۶ ماه", "۱۲ ماه", "۲ سال", "۳ سال"];
const animationPath = "/animations/investment-education.json";

// Format amount: display in میلیون or میلیارد
function formatAmount(amount: number) {
  if (amount >= 1000) {
    return `${(amount / 1000).toLocaleString("fa-IR", {
      maximumFractionDigits: 1,
    })} میلیارد تومان`;
  }
  return `${amount.toLocaleString("fa-IR")} میلیون تومان`;
}

const PlansList = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [risk, setRisk] = useState<number>(1);
  const [duration, setDuration] = useState<number>(3);

  return (
    <div className="mt-24 mb-20 container">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {PlansListData.map((item, idx) => (
          <Drawer key={idx}>
            <DrawerTrigger asChild>
              <button className="group block relative">
                <div className="relative h-44 w-full rounded-tr-3xl rounded-bl-3xl group-hover:rounded-xl overflow-hidden transition-all shadow-2xl">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover group-hover:scale-105 group-hover:brightness-110 transition-all"
                  />
                  <div className="absolute inset-0 bg-gray-900/60 group-hover:bg-gray-900/40 transition-all"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white transition-all">
                      {item.label}
                    </span>
                  </div>
                </div>
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
                <div className="space-y-8 mt-6 w-full max-w-xl">
                  {/* Amount Slider */}
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      میزان سرمایه (میلیون تومان)
                    </label>

                    <Slider
                      min={10}
                      max={10000}
                      step={10}
                      value={[amount]}
                      onValueChange={([val]) => setAmount(val)}
                      className="h-3"
                      trackClassName="bg-gray-200"
                      rangeClassName="bg-green-600"
                      thumbClassName="border-green-600"
                    />

                    {/* لیبل‌های بازه مقدار */}
                    <div className="ltr flex justify-between text-xs text-gray-500 mt-1 font-medium">
                      <span>۱۰ میلیون</span>
                      <span>۱۰ میلیارد</span>
                    </div>

                    <div className="text-center mt-2 text-lg font-semibold text-green-700">
                      {formatAmount(amount)}
                    </div>
                  </div>

                  {/* Risk Slider */}
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

                  {/* Duration Slider */}
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
                {/* animation */}
                <div className="w-[400px] h-[300px] relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={"index"}
                      className="absolute inset-0"
                      variants={animationVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <LottieRemote key={animationPath} path={animationPath} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div className="mt-10 flex flex-col items-center gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:brightness-110 transition-all">
                  سبد شخصی من را بساز
                </button>

                <DrawerClose className="text-sm text-gray-500 underline mt-2 hover:text-gray-700 transition-colors">
                  بستن
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
