"use client";

import { useRef, useState } from "react";
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
  overlayTexts,
  slides,
  miniSlider1Data,
  miniSlider2Data,
}: LandingOverlayProps) => {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hideMainText, setHideMainText] = useState(false);

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
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.15],
    [0, 0.8, 1]
  );
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.9, 0.91],
    ["transparent", "transparent", "black"]
  );

  return (
    <>
      <section ref={ref} className="relative w-full">
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

        {/* متن روی ویدیو */}
        <AnimatePresence mode="wait">
          {!hideMainText && (
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 z-10"
            >
              <OverlayMainText
                title={mainHeroTitle}
                subtitle={mainHeroSubtitle}
                ctaLink={mainHeroCta1Link}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* متن‌های اسکرولی */}
        <div className="relative z-10 flex flex-col items-center justify-start">
          <motion.div
            style={{ opacity: textOpacity, backgroundColor: bgColor }}
            className="w-full flex justify-center"
          >
            <OverlayText onEnter={setHideMainText} texts={overlayTexts} />
          </motion.div>
        </div>
      </section>

      {/* اسلایدر نهایی */}
      <ImageZoomSliderSection
        parentRef={ref}
        slides={slides}
        miniSlider1Data={miniSlider1Data}
        miniSlider2Data={miniSlider2Data}
      />
    </>
  );
};

export default LandingOverlay;

// =================================================
//                   متن اسکرولی
// =================================================
const OverlayText = ({
  onEnter,
  texts,
}: {
  onEnter: (visible: boolean) => void;
  texts?: string[];
}) => {
  const defaultTexts = [
    "پیشرو در مسیر سرمایه‌ گذاری هوشمند",
    "ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری، شما را در مسیر رشد مالی همراهی می‌کنیم.",
    "از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای و همراهی در مسیر رشد سرمایه شما، همه و همه در پیشرو فراهم است.",
    "پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد پایدار و آینده‌ای روشن هستند.",
  ];

  const displayTexts = texts && texts.length > 0 ? texts : defaultTexts;

  return (
    <div className="w-full flex justify-center py-16 sm:py-24 md:py-32">
      <div className="z-10 flex flex-col items-center text-right w-full container-xl space-y-8 sm:space-y-10 md:space-y-12 px-4 sm:px-6">
        {displayTexts.map((text, i) => (
          <motion.h4
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            exit={{
              opacity: 0,
              y: i % 2 === 0 ? -50 : 50,
              transition: { duration: 0.6, ease: "easeInOut" },
            }}
            viewport={{ once: false, amount: 0.1 }}
            onViewportEnter={i === 0 ? () => onEnter(true) : undefined}
            onViewportLeave={i === 0 ? () => onEnter(false) : undefined}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white w-full !leading-[1.5]"
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
