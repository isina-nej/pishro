"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState } from "react";

const LandingOverlay = () => {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const [hideMainText, setHideMainText] = useState(false);

  // مقدار اسکرول نسبت به سکشن اصلی
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // اورلی: وقتی ۲۰٪ از متن وارد شد، پس‌زمینه شروع به تاریک شدن می‌کنه
  // تا زمانی که حدود ۶۰٪ صفحه پر شد، کاملاً سیاه میشه
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.2, 0.55, 0.7],
    [0, 0.7, 0.9, 1]
  );

  // const mainTextOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  // const mainTextY = useTransform(scrollYProgress, [0, 0.1], [0, -20]);

  const TextOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.15],
    [0, 0.8, 1]
  );

  // کنترل پخش ویدیو
  useMotionValueEvent(overlayOpacity, "change", (latest) => {
    if (latest >= 0.98 && isVideoPlaying) {
      videoRef.current?.pause();
      setIsVideoPlaying(false);
    } else if (latest < 0.98 && !isVideoPlaying) {
      videoRef.current?.play();
      setIsVideoPlaying(true);
    }
  });

  return (
    <section ref={ref} className="relative w-full">
      {/* بخش چسبیده به بالای صفحه */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ویدیو پس‌زمینه */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-50"
        >
          <source src="/videos/aboutUs.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-black/20 transition-none" />
        {/* اورلی سیاه که با اسکرول تاریک‌تر میشه */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-black transition-none"
        />
      </div>
      {/* محتوای متن */}
      <AnimatePresence mode="wait">
        {!hideMainText && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute top-0 z-10"
          >
            <OverlayMainText />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative z-10 flex flex-col justify-start items-center">
        {/* وقتی اسکرول می‌کنی، متن بالا می‌ره طبیعی */}
        <motion.div
          style={{ opacity: TextOpacity }}
          className="flex items-center justify-center"
        >
          <OverlayText onEnter={(bol: boolean) => setHideMainText(bol)} />
        </motion.div>
      </div>
    </section>
  );
};

export default LandingOverlay;

// ------------ متن روی ویدیو -------------
const OverlayText = ({ onEnter }: { onEnter: (bol: boolean) => void }) => {
  const texts = [
    "پیشرو در مسیر سرمایه‌گذاری هوشمند",
    "ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌گذاری، شما را در مسیر رشد مالی همراهی می‌کنیم.",
    "از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای و همراهی در مسیر رشد سرمایه شما، همه و همه در پیشرو فراهم است.",
    "پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد پایدار و آینده‌ای روشن هستند.",
  ];

  return (
    <div className="w-full flex items-start justify-center pb-40">
      <div className="z-10 flex flex-col items-center justify-center text-right w-full">
        <div className="container space-y-12 px-4">
          {texts.map((text, i) => (
            <motion.h4
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.1, // دونه‌دونه ظاهر می‌شن
                ease: "easeOut",
              }}
              exit={{
                opacity: 0,
                y: i % 2 === 0 ? -50 : 50, // خروج متناسب با جهت ورود
                transition: { duration: 0.6, ease: "easeInOut" },
              }}
              viewport={{
                once: false,
                amount: 0.1,
              }}
              onViewportEnter={i === 0 ? () => onEnter(true) : undefined}
              onViewportLeave={i === 0 ? () => onEnter(false) : undefined}
              className="text-2xl md:text-4xl lg:text-5xl lg:leading-[64px] font-bold text-white w-full max-w-5xl"
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
    </div>
  );
};

const OverlayMainText = () => {
  return (
    <div className="h-screen container-xl pt-32 flex items-start justify-start">
      <h4 className="text-white text-9xl font-bold max-w-md">پیشرو</h4>
    </div>
  );
};
