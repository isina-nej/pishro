"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

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
  mainHeroTitle?: string;
  mainHeroSubtitle?: string;
  mainHeroCta1Link?: string;
  heroVideoUrl?: string;
  overlayTexts?: string[];
  slides?: SlideData[];
  miniSlider1Data?: string[];
  miniSlider2Data?: string[];
};

// =================================================
//                   کامپوننت اصلی
// =================================================
const LandingOverlay = ({
  mainHeroTitle,
  mainHeroSubtitle,
  mainHeroCta1Link,
  heroVideoUrl,
  overlayTexts: _overlayTexts,
  slides,
  miniSlider1Data,
  miniSlider2Data,
}: LandingOverlayProps) => {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // پیشرفت اسکرول نسبت به سکشن اصلی
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // افکت‌ها
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.2, 0.65, 0.95],
    [0, 0.7, 0.7, 1]
  );
  const _textOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.15],
    [0, 0.8, 1]
  );
  const _bgColor = useTransform(
    scrollYProgress,
    [0, 0.9, 0.91],
    ["transparent", "transparent", "black"]
  );

  return (
    <>
      <section ref={ref} className="relative w-full hidden lg:block">
        {/* ویدیو و اورلی تاریک */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover -z-50"
          >
            <source
              src={heroVideoUrl || "/videos/aboutUs.webm"}
              type="video/webm"
            />
          </video>

          {/* پس‌زمینه نیمه‌تاریک */}
          <div className="absolute inset-0 bg-black/25" />

          {/* اورلی سیاه تدریجی */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-black"
          />
        </div>

        {/* متن اصلی روی ویدیو */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute top-0 z-10 hidden sm:block"
          >
            <OverlayMainText
              title={mainHeroTitle}
              subtitle={mainHeroSubtitle}
              ctaLink={mainHeroCta1Link}
            />
          </motion.div>
        </AnimatePresence>

        {/* Scroll overlay text removed */}
        <div className="relative z-10 flex-col items-center justify-start hidden sm:flex" />
      </section>

      {/* اسلایدر نهایی - فقط در دسکتاپ */}
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
//                   متن اصلی (روی ویدیو)
// =================================================
const OverlayMainText = ({
  title,
  subtitle,
  ctaLink,
}: {
  title?: string;
  subtitle?: string;
  ctaLink?: string;
}) => (
  <div className="h-screen container-xl pt-20 sm:pt-24 md:pt-32 px-4 sm:px-6 flex flex-col items-start justify-start space-y-4 sm:space-y-6 md:space-y-8">
    <h4 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[88px] font-extrabold leading-tight max-w-4xl">
      {title || "پیشرو بزرگترین مؤسسه سرمایه‌ گذاری در ایران"}
    </h4>

    <motion.a
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      href={ctaLink || "/business-consulting"}
      className="bg-white text-black font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg shadow-lg hover:bg-white/90 transition-all"
    >
      {subtitle || "شروع مسیر موفقیت"}
    </motion.a>
  </div>
);
