"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import {
  LineChart,
  GraduationCap,
  Headphones,
  Lightbulb,
  BarChart3,
  Bell,
  Lock,
  TrendingUp,
  Wrench,
} from "lucide-react";

const mobileScrollerSteps = [
  {
    id: 1,
    text: "با مشاوره‌های تخصصی و آموزش‌های کاربردی، اولین قدم مطمئن در بازار سرمایه را بردارید.",
    img: "/images/home/mobile-scroll/mobile.webp",
    gradient: "from-blue-400/30 via-indigo-400/20 to-transparent",
    cards: [
      {
        id: 1,
        title: "شروع",
        desc: "ورود مطمئن",
        top: "25%",
        left: "75%",
        icon: LineChart,
      },
      {
        id: 2,
        title: "آموزش",
        desc: "مبتدی‌ها",
        top: "26%",
        left: "0%",
        icon: GraduationCap,
      },
      {
        id: 3,
        title: "پشتیبانی",
        desc: "کاربران",
        top: "55%",
        left: "75%",
        icon: Headphones,
      },
      {
        id: 4,
        title: "پیشنهاد",
        desc: "سرمایه‌گذاری",
        top: "55%",
        left: "0%",
        icon: Lightbulb,
      },
    ],
  },
  {
    id: 2,
    text: "دسترسی به تحلیل‌های روزانه و فرصت‌های طلایی در بورس و بازارهای نوین.",
    img: "/images/home/mobile-scroll/mobile.webp",
    gradient: "from-blue-400/30 via-mySecondary-400/20 to-transparent",
    cards: [
      {
        id: 1,
        title: "تحلیل",
        desc: "بازارها",
        top: "25%",
        left: "75%",
        icon: BarChart3,
      },
      {
        id: 2,
        title: "فرصت",
        desc: "سیگنال‌ها",
        top: "25%",
        left: "0%",
        icon: Lightbulb,
      },
      {
        id: 3,
        title: "نمودار",
        desc: "ابزارها",
        top: "55%",
        left: "75%",
        icon: Wrench,
      },
      {
        id: 4,
        title: "یادآوری",
        desc: "نوتیف‌ها",
        top: "55%",
        left: "0%",
        icon: Bell,
      },
    ],
  },
  {
    id: 3,
    text: "با استراتژی‌های پیشرفته و ابزارهای مدرن، سبد سرمایه خود را حرفه‌ای مدیریت کنید.",
    img: "/images/home/mobile-scroll/mobile.webp",
    gradient: "from-amber-400/30 via-orange-400/20 to-transparent",
    cards: [
      {
        id: 1,
        title: "مدیریت",
        desc: "سبد",
        top: "25%",
        left: "75%",
        icon: LineChart,
      },
      {
        id: 2,
        title: "ابزار",
        desc: "تحلیل",
        top: "25%",
        left: "0%",
        icon: Wrench,
      },
      {
        id: 3,
        title: "امنیت",
        desc: "اطلاعات",
        top: "55%",
        left: "75%",
        icon: Lock,
      },
      {
        id: 4,
        title: "رشد",
        desc: "سرمایه",
        top: "55%",
        left: "0%",
        icon: TrendingUp,
      },
    ],
  },
];

export default function MobileScrollSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const sectionRef = useRef<HTMLElement>(null);

  // 🧭 Scroll handler for changing index dynamically
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let lastScrollTop = window.scrollY;
    const handleScroll = () => {
      const scrollTop = window.scrollY - node.offsetTop;
      const stepHeight = 500;
      const newIndex = Math.min(
        mobileScrollerSteps.length - 1,
        Math.max(0, Math.floor(scrollTop / stepHeight))
      );

      setDirection(window.scrollY > lastScrollTop ? "down" : "up");
      lastScrollTop = window.scrollY;
      setIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🎬 Animation variants
  const variants = {
    enter: (dir: "up" | "down") => ({
      opacity: 0,
      y: dir === "down" ? -80 : 80,
    }),
    center: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.4 } },
  };

  return (
    <section
      ref={sectionRef}
      style={{ height: `calc(${mobileScrollerSteps.length * 501}px + 100vh)` }}
      className="relative w-full mt-20"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center container-xl py-8">
        {/* Header */}
        <div className="w-full px-40 flex flex-col items-start justify-start absolute top-10">
          <h4 className="text-6xl font-bold mb-2">سامانه پیشرو</h4>
          <p className="text-base text-gray-500">
            سامانه <span className="text-myPrimary">پیشرو</span>، مشاور و همراه
            مالی شما در مسیر پیشرفت
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full h-[700px] overflow-hidden flex flex-col justify-end mb-10">
          <div className="w-full h-[550px] bg-mySecondary rounded-[40px] relative">
            {/* Background */}
            <div className="absolute size-full rounded-[36px] flex overflow-hidden">
              <div className="relative size-full rounded-[36px] flex">
                <div className="w-[63%] h-full"></div>
                <div className="w-[37%] h-full bg-myGray"></div>
                <div className="absolute rotate-12 h-[900px] w-[10%] bg-myGray left-[30%] -top-10"></div>
              </div>
            </div>

            {/* Layout */}
            <div className="w-full h-full flex items-center justify-center">
              {/* Left Text */}
              <div className="flex-1 flex flex-col justify-between h-full pt-28 pb-20 pr-12 pl-8 z-10">
                <div>
                  <h4 className="text-6xl font-semibold text-white mb-12">
                    از مزایای <span className="">پیشرو</span> بودن
                  </h4>

                  <ul className="space-y-4">
                    {mobileScrollerSteps.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-center space-x-4 space-x-reverse"
                      >
                        <span
                          className={clsx(
                            "size-2 rounded-full border transition-all",
                            i === index
                              ? "bg-white border-white"
                              : "bg-gray-600 border-gray-500"
                          )}
                        ></span>
                        <span
                          className={clsx(
                            "text-base transition-all",
                            i === index
                              ? "text-white font-semibold"
                              : "text-gray-400"
                          )}
                        >
                          {step.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-10">
                    <button className="px-10 py-3 bg-white/10 text-white rounded-full shadow-md hover:bg-white/5 transition">
                      شروع کنید
                    </button>
                  </div>
                </div>
              </div>

              {/* ✅ Mobile + Floating Cards */}
              <div className="relative w-[500px] flex justify-center pl-12">
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={mobileScrollerSteps[index].id}
                    variants={variants}
                    custom={direction}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative w-[435px] aspect-[500/980] -mb-[80px]"
                  >
                    <Image
                      src={mobileScrollerSteps[index].img}
                      alt="mobile screen"
                      fill
                      className="object-cover rounded-2xl"
                    />

                    {/* 🌈 Floating Cards */}
                    <div className="absolute inset-0">
                      {mobileScrollerSteps[index].cards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0.7, scale: 0.9 }}
                            animate={{
                              opacity: 1,
                              scale: [1, 1.08, 1],
                              y: [0, -6, 0],
                            }}
                            transition={{
                              duration: 3,
                              delay: i * 0.3,
                              repeat: Infinity,
                              repeatType: "mirror",
                              ease: "easeInOut",
                            }}
                            style={{
                              top: card.top,
                              left: card.left,
                              transform: "translate(-50%, -50%)",
                            }}
                            className={clsx(
                              "absolute w-[120px] h-[120px] p-3 rounded-2xl border backdrop-blur-xl",
                              "shadow-[0_0_20px_-5px_rgba(255,255,255,0.25)] transition-all",
                              "bg-gradient-to-br",
                              mobileScrollerSteps[index].gradient,
                              "hover:scale-105 hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center text-center"
                            )}
                          >
                            <Icon className="w-6 h-6 mb-2 text-black/90" />
                            <h5 className="text-lg font-bold text-black">
                              {card.title}
                            </h5>
                            <p className="text- text-gray-900/90 mt-1">
                              {card.desc}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
