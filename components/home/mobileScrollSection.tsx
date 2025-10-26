"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

const mobileScrollerSteps = [
  {
    id: 1,
    text: "با مشاوره‌های تخصصی و آموزش‌های کاربردی، اولین قدم مطمئن در بازار سرمایه را بردارید.",

    img: "/images/mobile-1.png",
  },
  {
    id: 2,
    text: "دسترسی به تحلیل‌های روزانه و فرصت‌های طلایی در بورس و بازارهای نوین.",

    img: "/images/mobile-2.png",
  },
  {
    id: 3,
    text: "با استراتژی‌های پیشرفته و ابزارهای مدرن، سبد سرمایه خود را حرفه‌ای مدیریت کنید.",
    img: "/images/mobile-3.png",
  },
];

export default function MobileScrollSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down"); // scroll direction
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let lastScrollTop = window.scrollY;

    const handleScroll = () => {
      const scrollTop = window.scrollY - node.offsetTop; // how much user scrolled inside section
      const stepHeight = 500;

      const newIndex = Math.min(
        mobileScrollerSteps.length - 1,
        Math.max(0, Math.floor(scrollTop / stepHeight))
      );

      // detect scroll direction
      setDirection(window.scrollY > lastScrollTop ? "down" : "up");
      lastScrollTop = window.scrollY;

      setIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // dynamic variants based on scroll direction
  const variants = {
    enter: (dir: "up" | "down") => ({
      opacity: 0,
      y: dir === "down" ? -80 : 80, // down → from top , up → from bottom
    }),
    center: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.4 } }, // only fade
  };

  return (
    <section
      ref={sectionRef}
      style={{ height: `calc(${mobileScrollerSteps.length * 501}px + 100vh)` }}
      className="relative w-full mt-20"
    >
      {/* Sticky content */}
      <div className="sticky top-0 h-screen flex items-center justify-center container-xl py-8">
        {/* header */}
        <div className="w-full px-40 flex flex-col items-start justify-start absolute top-10">
          <h4 className="text-6xl font-bold mb-2">سامانه پیشرو</h4>
          <p className="text-base text-gray-500">
            سامانه <span className="text-myPrimary">پیشرو</span>، مشاور و همراه
            مالی شما در مسیر پیشرفت
          </p>
        </div>
        {/* body */}
        <div className="w-full h-[700px] overflow-hidden flex flex-col justify-end mb-10">
          <div className="w-full h-[550px] bg-mySecondary rounded-[40px] relative">
            {/* bg colors */}
            <div className="absolute size-full rounded-[36px] flex overflow-hidden">
              <div className="relative size-full rounded-[36px] flex">
                <div className="w-[63%] h-full"></div>
                <div className="w-[37%] h-full bg-myGray"></div>
                <div className="absolute rotate-12 h-[900px] w-[10%] bg-myGray left-[30%] -top-10"></div>
              </div>
            </div>

            <div className="w-full h-full flex items-center justify-center">
              {/* Text and content */}
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
                        {/* بولت سفارشی */}
                        <span
                          className={clsx(
                            "size-2 rounded-full border transition-all",
                            i === index
                              ? "bg-white border-white" // حالت فعال
                              : "bg-gray-600 border-gray-500" // حالت غیرفعال
                          )}
                        ></span>

                        {/* متن */}
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

              {/* Image */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={mobileScrollerSteps[index].id}
                  variants={variants}
                  custom={direction} // pass direction to variants
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-[500px] flex justify-center pl-12"
                >
                  <div className="relative w-[435px] aspect-[500/980] -mb-[80px]">
                    <Image
                      src={"/images/home/mobile-scroll/mobile.webp"}
                      alt="mobile screen"
                      fill
                      className="object-cover rounded-2xl"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
