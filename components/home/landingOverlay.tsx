"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

import ImageZoomSliderSection from "./imageZoomSliderSection";

// =================================================
//                   Types
// =================================================
type SlideData = {
  src: string;
  title: string;
  text: string;
};

type LandingOverlayProps = {
  overlayTexts?: string[];
  slides?: SlideData[];
  miniSlider1Data?: string[];
  miniSlider2Data?: string[];
};

// =================================================
//                   کامپوننت اصلی
// =================================================
const LandingOverlay = ({
  overlayTexts,
  slides,
  miniSlider1Data,
  miniSlider2Data,
}: LandingOverlayProps) => {
  const ref = useRef<HTMLElement>(null);

  return (
    <>
      <section
        ref={ref}
        className="relative hidden w-full bg-[#000412] lg:block"
      >
        {/* Opening video replaced by CoinsHeroSection in homeContent */}
        <div className="relative z-10 hidden flex-col items-center justify-start sm:flex">
          <div className="flex w-full justify-center">
            <OverlayText texts={overlayTexts} />
          </div>
        </div>
      </section>

      <div className="hidden lg:block">
        <ImageZoomSliderSection
          parentRef={ref}
          slides={slides}
          miniSlider1Data={miniSlider1Data}
          miniSlider2Data={miniSlider2Data}
        />
      </div>
    </>
  );
};

export default LandingOverlay;

// =================================================
//                   متن اسکرولی
// =================================================
const OverlayText = ({ texts }: { texts?: string[] }) => {
  const defaultTexts = [
    "پیشرو در مسیر سرمایه‌ گذاری هوشمند",
    "ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری، شما را مسیر رشد همراهی می‌کنیم.",
    "از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای همراهی در مسیر رشد سرمایه شما، همه پیشرو فراهم است.",
    "پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد پایدار و آینده‌ای روشن هستند.",
  ];

  const displayTexts = texts && texts.length > 0 ? texts : defaultTexts;

  return (
    <div className="flex w-full justify-center py-16 sm:py-24 md:py-32">
      <div className="container-xl z-10 flex w-full flex-col items-center space-y-5 px-4 text-right sm:space-y-6 sm:px-6">
        {displayTexts.map((text, i) => (
          <motion.h4
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.1 }}
            className="home-on-dark w-full max-w-5xl rounded-[2rem] border border-white/10 bg-[#0F2A1F]/55 p-6 text-xl font-bold !leading-[1.65] shadow-2xl shadow-black/15 backdrop-blur-xl sm:p-8 sm:text-2xl md:text-3xl lg:text-4xl"
          >
            {text.includes("پیشرو") ? (
              <>
                {text.split("پیشرو")[0]}
                <span className="font-bold">پیشرو</span>
                {text.split("پیشرو")[1]}
              </>
            ) : (
              text
            )}
          </motion.h4>
        ))}
      </div>
    </div>
  );
};
