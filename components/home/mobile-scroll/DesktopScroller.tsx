"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

import { mobileScrollerSteps, type MobileScrollerStep } from "./data";

type DesktopScrollerProps = {
  steps?: MobileScrollerStep[];
};

export function DesktopScroller({
  steps: providedSteps,
}: DesktopScrollerProps = {}) {
  const steps =
    providedSteps && providedSteps.length > 0
      ? providedSteps
      : mobileScrollerSteps;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let lastScrollTop = window.scrollY;
    const handleScroll = () => {
      const scrollTop = window.scrollY - node.offsetTop;
      const stepHeight = 500;
      const newIndex = Math.min(
        steps.length - 1,
        Math.max(0, Math.floor(scrollTop / stepHeight))
      );

      setDirection(window.scrollY > lastScrollTop ? "down" : "up");
      lastScrollTop = window.scrollY;
      setIndex(newIndex);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps]);

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
      style={{ height: `calc(${steps.length * 501}px + 100vh)` }}
      className="relative w-full mt-20"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center container-xl py-8">
        <div className="absolute top-[6%] z-10 flex w-full flex-col items-start justify-start px-40">
          <span className="mb-3 rounded-full border border-[#214254]/10 bg-white/50 px-4 py-2 text-xs font-bold text-[#214254] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-cyan-100">تجربه یکپارچه مالی</span>
          <h4 className="mb-2 text-6xl font-black tracking-tight text-[#112b3a] dark:text-white">سامانه پیشرو</h4>
          <p className="text-base text-gray-500 dark:text-textSecondary">
            سامانه <span className="text-myPrimary">پیشرو</span>، مشاور و همراه
            مالی شما در مسیر پیشرفت
          </p>
        </div>

        <div className="w-full h-[700px] overflow-hidden flex flex-col justify-end mb-10">
          <div className="home-glass-panel relative h-[74vh] w-full overflow-hidden rounded-[40px]">
            <div className="absolute inset-0 overflow-hidden rounded-[38px] bg-gradient-to-br from-[#12344b]/95 via-[#183c53]/90 to-[#0d2435]/95">
              <div className="absolute -right-32 -top-36 h-96 w-96 rounded-full bg-cyan-300/15 blur-3xl" />
              <div className="absolute -bottom-28 left-1/4 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
              <div className="absolute inset-y-0 left-0 w-[38%] border-r border-white/10 bg-white/[0.06] backdrop-blur-2xl" />
            </div>

            <div className="w-full h-full flex items-center justify-center">
              {/* right section */}
              <div className="flex-1 flex flex-col justify-between h-full pt-28 pb-20 pr-12 pl-8 z-10">
                <div>
                  <h4 className="text-6xl font-semibold text-white mb-12">
                    از مزایای <span className="">پیشرو</span> بودن
                  </h4>

                  <ul className="space-y-4">
                    {steps.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-center space-x-4 space-x-reverse"
                      >
                        <span
                          className={clsx(
                            "size-2 rounded-full border transition-all",
                            i === index
                              ? "bg-white dark:bg-cardBg border-white"
                              : "bg-gray-600 border-gray-500"
                          )}
                        />
                        <span
                          className={clsx(
                            "text-base transition-all",
                            i === index
                              ? "text-white font-semibold"
                              : "text-gray-400 dark:text-textSecondary"
                          )}
                        >
                          {step.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-10">
                    {steps[index].link ? (
                      <a
                        href={steps[index].link}
                        className="inline-block rounded-full border border-white/20 bg-white px-10 py-3 font-bold text-[#112b3a] shadow-xl transition hover:-translate-y-0.5 hover:bg-cyan-50"
                      >
                        اطلاعات بیشتر
                      </a>
                    ) : (
                      <button className="cursor-default rounded-full border border-white/20 bg-white px-10 py-3 font-bold text-[#112b3a] shadow-xl">
                        اطلاعات بیشتر
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* left section */}
              <div className="relative w-[500px] flex justify-center pl-12">
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={steps[index].id}
                    variants={variants}
                    custom={direction}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative w-[435px] aspect-[500/980] -mb-[80px]"
                  >
                    {/* mobile frame (background layer) */}
                    <Image
                      src={
                        steps[index].imgCover ||
                        "/images/home/mobile-scroll/mobile.webp"
                      }
                      alt="mobile frame"
                      fill
                      className="object-cover rounded-2xl"
                      priority
                    />
                    {/* mobile screen content (foreground layer) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-[100%] h-[100%]">
                        <Image
                          src={steps[index].img}
                          alt="mobile screen content"
                          fill
                          className="object-contain"
                        />
                      </div>
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
