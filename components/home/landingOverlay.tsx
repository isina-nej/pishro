"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const LandingOverlay = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // تغییر اپاسیتی اورلی
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.9],
    [0, 0.8, 1]
  );

  const aboutOpacity = useTransform(scrollYProgress, [0.15, 0.18], [0, 1]);
  const aboutY = useTransform(scrollYProgress, [0.15, 0.18], [40, 0]);

  const smoothOpacity = useSpring(aboutOpacity, {
    stiffness: 100,
    damping: 20,
  });
  const smoothY = useSpring(aboutY, { stiffness: 100, damping: 20 });

  return (
    <>
      {/* Video fixed in background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-20"
      >
        <source src="/videos/aboutUs.webm" type="video/mp4" />
      </video>

      {/* White overlay fixed above video */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="fixed inset-0 bg-white -z-10"
      />

      {/* Landing Section (فقط برای ارتفاع اسکرول) */}
      <section ref={ref} className="relative w-full h-screen" />

      {/* Content sections (روی اورلی و ویدیو) */}
      <motion.div
        style={{
          opacity: smoothOpacity,
          y: smoothY,
        }}
        transition={{ duration: 0.2 }}
        className="relative z-10 -mt-[5vh] w-full pb-20"
      >
        <div className="w-full flex items-start pt-0 justify-center mb-20">
          <div className="z-10 flex flex-col items-center justify-center text-center w-full space-y-6 px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-mySecondary leading-tight max-w-4xl">
              پیشرو در مسیر سرمایه‌گذاری هوشمند
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-gray-700 max-w-3xl leading-relaxed">
              ما در <span className="font-semibold">پیشرو</span> با ارائه
              آموزش‌های تخصصی بورس، بازارهای مالی و مشاوره سرمایه‌گذاری، به شما
              کمک می‌کنیم تا دانش مالی خود را ارتقا دهید و تصمیم‌های آگاهانه‌تری
              برای آینده‌ی اقتصادی‌تان بگیرید.
            </p>
            <p className="text-lg md:text-xl lg:text-2xl font-medium text-gray-600 max-w-2xl leading-relaxed">
              از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای و همراهی در مسیر
              رشد سرمایه، ما در کنار شما هستیم تا مسیر موفقیت در بازارهای مالی
              را هموارتر کنید.
            </p>
            <p className="text-base md:text-lg lg:text-xl font-normal text-gray-500 max-w-2xl leading-relaxed">
              پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد
              پایدار و آینده‌ای روشن هستند.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default LandingOverlay;

// این کامنت هارو حذف نکن شاید بعدا لازم بشن

// /* ----------------- StatCard ----------------- */
// type StatCardProps = {
//   number: string;
//   label: string;
//   isLast?: boolean;
// };

// const StatCard = ({ number, label, isLast }: StatCardProps) => {
//   return (
//     <div
//       className={`flex-1 h-full px-20 ${
//         !isLast ? "border-l" : ""
//       } flex flex-col justify-center items-center text-white`}
//     >
//       <p className="font-semibold text-4xl ltr">{number}</p>
//       <p className="text-xl font-light">{label}</p>
//     </div>
//   );
// };
