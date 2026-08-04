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

          {/* اورلی تیره فقط هنگام اسکرول پایین‌تر — بدون هاله کدر روی ویدیو در ابتدا */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-black/70"
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
              className="absolute top-0 z-10 hidden sm:block"
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
        <div className="relative z-10 flex-col items-center justify-start hidden sm:flex">
          <motion.div
            style={{ opacity: textOpacity, backgroundColor: bgColor }}
            className="w-full flex justify-center"
          >
            <OverlayText onEnter={setHideMainText} texts={overlayTexts} />
          </motion.div>
        </div>
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
    "ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری، شما را مسیر رشد همراهی می‌کنیم.",
    "از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای همراهی در مسیر رشد سرمایه شما، همه پیشرو فراهم است.",
    "پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد پایدار و آینده‌ای روشن هستند.",
  ];

  const displayTexts = texts && texts.length > 0 ? texts : defaultTexts;

  return (
    <div className="w-full flex justify-center py-16 sm:py-24 md:py-32">
      <div className="z-10 flex w-full flex-col items-center space-y-5 px-4 text-right sm:space-y-6 sm:px-6 container-xl">
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
            className="home-on-dark w-full max-w-5xl rounded-[2rem] border border-white/15 bg-black/45 p-6 text-xl font-bold shadow-2xl shadow-black/25 !leading-[1.65] sm:p-8 sm:text-2xl md:text-3xl lg:text-4xl"
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
  <div className="h-screen container-xl pt-28 sm:pt-32 md:pt-40 px-4 sm:px-6 flex flex-col items-start justify-start">
    <div className="max-w-4xl rounded-[2.25rem] border border-white/20 bg-black/40 p-7 shadow-2xl shadow-black/30 sm:p-10 lg:p-12">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4B06A]/40 bg-black/30 px-4 py-2 text-xs text-[#D4B06A]">
        <span className="h-2 w-2 rounded-full bg-[#D4B06A]" />
        آموزش، تحلیل و سرمایه‌گذاری در یک مسیر
      </div>
      <h1 className="home-on-dark max-w-3xl text-4xl font-black leading-[1.35] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
        {title || "خوش آمدید به خانواده بزرگ پیشرو"}
      </h1>
      <p className="home-on-dark-muted mt-5 max-w-2xl text-base leading-8">
        تصمیم مالی بهتر از وضوح شروع می‌شود؛ دانش، ابزار و همراهی تخصصی برای ساختن آینده‌ای مطمئن‌تر.
      </p>
      <motion.a
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        href={ctaLink || "/business-consulting"}
        className="mt-8 inline-flex items-center rounded-full bg-[#FBF9F5] px-7 py-3.5 text-sm font-black text-[#0B3D2E] shadow-xl shadow-black/15 transition hover:bg-[#1A6B45] hover:text-white sm:text-base"
      >
        {subtitle || "شروع مسیر موفقیت"}
      </motion.a>
    </div>
  </div>
);
