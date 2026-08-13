"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

import ImageZoomSliderSection from "./imageZoomSliderSection";

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
        <div className="relative z-10 hidden flex-col items-center justify-start sm:flex">
          <OverlayText texts={overlayTexts} />
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

const OverlayText = ({ texts }: { texts?: string[] }) => {
  const defaultTexts = [
    "پیشرو در مسیر سرمایه‌ گذاری هوشمند",
    "ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری، شما را مسیر رشد همراهی می‌کنیم.",
    "از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای همراهی در مسیر رشد سرمایه شما، همه پیشرو فراهم است.",
    "پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد پایدار و آینده‌ای روشن هستند.",
  ];

  const displayTexts = texts && texts.length > 0 ? texts : defaultTexts;

  return (
    <div className="flex w-full justify-center px-4 py-10 sm:px-6 sm:py-14 md:py-16">
      <div className="z-10 mx-auto flex w-full max-w-5xl flex-col items-stretch gap-4 text-right sm:gap-5">
        {displayTexts.map((text, i) => (
          <motion.h4
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.25 }}
            className="home-on-dark w-full rounded-2xl border border-white/10 bg-[#0F2A1F]/55 px-5 py-4 text-base font-bold !leading-[1.7] shadow-xl shadow-black/15 backdrop-blur-xl sm:rounded-3xl sm:px-7 sm:py-5 sm:text-lg md:text-xl lg:text-2xl"
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
