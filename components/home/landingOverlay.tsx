"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useRef, useState } from "react";

const LandingOverlay = () => {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // مقدار اسکرول نسبت به سکشن اصلی
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // اورلی: وقتی ۲۰٪ از متن وارد شد، پس‌زمینه شروع به تاریک شدن می‌کنه
  // تا زمانی که حدود ۶۰٪ صفحه پر شد، کاملاً سیاه میشه
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.2, 0.6, 0.8],
    [0, 0.7, 0.9, 1]
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
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/aboutUs.webm" type="video/webm" />
        </video>

        {/* اورلی سیاه که با اسکرول تاریک‌تر میشه */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-black transition-none"
        />

        {/* محتوای متن */}
      </div>
      <div className="relative z-10 flex flex-col justify-start items-center">
        {/* وقتی اسکرول می‌کنی، متن بالا می‌ره طبیعی */}
        <div className="flex items-center justify-center">
          <OverlayText />
        </div>
      </div>
    </section>
  );
};

export default LandingOverlay;

// ------------ متن روی ویدیو -------------
const OverlayText = () => {
  return (
    <div className="w-full flex items-start justify-center pb-40">
      <div className="z-10 flex flex-col items-center justify-center text-center w-full">
        <div className="container space-y-12 px-4">
          <h4 className="text-2xl md:text-4xl lg:text-5xl lg:leading-[64px] font-bold text-white w-full max-w-5xl">
            پیشرو در مسیر سرمایه‌گذاری هوشمند
          </h4>
          <h4 className="text-2xl md:text-4xl lg:text-5xl lg:leading-[64px] font-bold text-white w-full max-w-5xl ">
            ما در <span className="font-bold">پیشرو</span> با ارائه آموزش‌های
            تخصصی بورس، بازارهای مالی و سرمایه‌گذاری، شما را در مسیر رشد مالی
            همراهی می‌کنیم.
          </h4>
          <h4 className="text-2xl md:text-4xl lg:text-5xl lg:leading-[64px] font-bold text-white w-full max-w-5xl ">
            از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای و همراهی در مسیر
            رشد سرمایه شما، همه و همه در{" "}
            <span className="font-bold">پیشرو</span> فراهم است.
          </h4>
          <h4 className="text-2xl md:text-4xl lg:text-5xl lg:leading-[64px] font-bold text-white w-full max-w-5xl ">
            پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد
            پایدار و آینده‌ای روشن هستند.
          </h4>
        </div>
      </div>
    </div>
  );
};
