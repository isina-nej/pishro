"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { whyUsData } from "@/public/data";
import { cn } from "@/lib/utils";

// انیمیشن‌های مربوط به ورود و خروج متن
const textVariants = {
  initial: { opacity: 0, x: 50 }, // شروع از سمت راست (x: 50) و شفافیت صفر
  animate: { opacity: 1, x: 0 }, // ورود به جایگاه اصلی با شفافیت کامل
  exit: { opacity: 0, x: 0 }, // خروج به سمت راست (x: 50) با محو شدن
};

const WhyUs = () => {
  const [index, setIndex] = useState(0);

  return (
    <div className="my-48 container">
      <h2 className="text-4xl text-center">چرا پیشرو</h2>
      <div>
        {/* لیست لیبل‌ها */}
        <div className="my-16 flex gap-28 justify-center text-xl text-[#717a86]">
          {whyUsData.map((item, idx) => (
            <h4
              key={idx}
              className={cn(
                "cursor-pointer relative pb-6 font-iransans font-bold", // افزودن relative جهت موقعیت‌دهی خط زیرین
                idx === index ? "text-[#172b3d]" : ""
              )}
              onClick={() => setIndex(idx)}
            >
              {item.label}
              {/* اگر این لیبل انتخاب شده باشد، خط زرد زیرین نمایش داده می‌شود */}
              {idx === index && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-red-500 rounded"
                />
              )}
            </h4>
          ))}
        </div>
        {/* بخش نمایش عنوان و متن */}
        <div className="max-w-[730px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index} // تغییر کلید باعث ری‌ندر شدن انیمیشن در هنگام تغییر ایندکس می‌شود
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-4xl leading-[56px] font-bold font-iransans text-[#172b3d] mb-4">
                {whyUsData[index].title}
              </h4>
              <p className="text-xl text-[#707177] leading-9">
                {whyUsData[index].text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
