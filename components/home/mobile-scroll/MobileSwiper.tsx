"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { mobileScrollerSteps, type MobileScrollerStep } from "./data";

type MobileSwiperProps = {
  steps?: MobileScrollerStep[];
};

export function MobileSwiper({ steps: providedSteps }: MobileSwiperProps = {}) {
  const steps =
    providedSteps && providedSteps.length > 0
      ? providedSteps
      : mobileScrollerSteps;

  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 22,
    mass: 0.4,
  });

  useEffect(() => {
    return scrollYProgress.on("change", (value) => {
      const clamped = Math.min(0.999, Math.max(0, value));
      const newIndex = Math.min(
        steps.length - 1,
        Math.floor(clamped * steps.length)
      );
      setIndex((prev) => {
        if (prev === newIndex) return prev;
        setDirection(newIndex > prev ? "down" : "up");
        return newIndex;
      });
    });
  }, [scrollYProgress, steps.length]);

  // Continuous 3D tilt tied to scroll position — the phone gently turns in
  // and out of the screen as each step enters, giving a real sense of depth.
  const cycle = useTransform(
    smoothProgress,
    (v) => v * steps.length * Math.PI
  );
  const rotateY = useTransform(cycle, (v) => Math.sin(v) * 14);
  const rotateX = useTransform(cycle, (v) => Math.cos(v) * 5);
  const translateZ = useTransform(cycle, (v) => Math.abs(Math.sin(v)) * -60);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  const currentStep = steps[index];

  const textVariants = {
    enter: (dir: "up" | "down") => ({
      opacity: 0,
      y: dir === "down" ? 18 : -18,
      filter: "blur(4px)",
    }),
    center: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: {
      opacity: 0,
      filter: "blur(4px)",
      transition: { duration: 0.25 },
    },
  };

  const phoneVariants = {
    enter: (dir: "up" | "down") => ({
      opacity: 0,
      scale: 0.85,
      rotateX: dir === "down" ? 35 : -35,
    }),
    center: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: (dir: "up" | "down") => ({
      opacity: 0,
      scale: 0.9,
      rotateX: dir === "down" ? -25 : 25,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <section
      ref={sectionRef}
      style={{ height: `${steps.length * 100}vh` }}
      className="relative lg:hidden"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full flex-col overflow-hidden">
        <div className="relative z-20 flex flex-col items-center gap-1 px-6 pt-8 text-center">
          <span className="mb-1 rounded-full border border-primary/15 bg-card/55 px-4 py-1.5 text-[11px] font-bold text-primary backdrop-blur-xl/10/5">
            تجربه یکپارچه مالی
          </span>
          <h4 className="text-2xl font-black tracking-tight text-[#0B3D2E] sm:text-3xl">
            سامانه پیشرو
          </h4>
          <p className="text-xs leading-5 text-muted-foreground dark:text-textSecondary sm:text-sm">
            سامانه <span className="text-myPrimary">پیشرو</span>، مشاور و
            همراه مالی شما در مسیر پیشرفت
          </p>
        </div>

        <div className="relative z-20 mt-4 flex items-center justify-center gap-2">
          {steps.map((step, i) => (
            <span
              key={step.id}
              className={clsx(
                "h-1.5 rounded-full transition-all duration-500",
                i === index
                  ? "w-8 bg-gradient-to-r from-primary to-premium"
                  : "w-1.5 bg-primary/20"
              )}
            />
          ))}
        </div>

        <div
          className="relative z-10 mt-5 flex flex-1 items-center justify-center px-5 pb-8"
          style={{ perspective: "1300px" }}
        >
          <div className="home-glass-panel relative flex h-full max-h-[600px] w-full max-w-sm flex-col items-center overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0F2A1F]/95 via-[#0B3D2E]/90 to-[#0A100E]/95 px-5 pt-7">
            <motion.div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
              style={{ x: useTransform(cycle, (v) => Math.sin(v) * 16) }}
            />
            <motion.div
              className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-premium/10 blur-3xl"
              style={{ x: useTransform(cycle, (v) => Math.cos(v) * -16) }}
            />

            <div className="relative z-20 h-[86px] w-full px-1 text-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.h6
                  key={`text-${currentStep.id}`}
                  custom={direction}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="text-base font-extrabold leading-7 text-foreground sm:text-lg"
                >
                  {currentStep.text}
                </motion.h6>
              </AnimatePresence>
            </div>

            <motion.div
              className="relative z-10 mt-2 h-[300px] w-[170px] drop-shadow-[0_30px_45px_rgba(0,0,0,0.45)] sm:h-[330px] sm:w-[186px]"
              style={{
                rotateY,
                rotateX,
                translateZ,
                transformStyle: "preserve-3d",
              }}
            >
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={currentStep.id}
                  custom={direction}
                  variants={phoneVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Image
                    src={
                      currentStep.imgCover ||
                      "/images/home/mobile-scroll/mobile.webp"
                    }
                    alt="mobile frame"
                    fill
                    className="object-cover rounded-2xl"
                    sizes="(max-width: 1024px) 220px"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-full w-full">
                      <Image
                        src={currentStep.img}
                        alt="mobile screen content"
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 220px"
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="relative z-20 mb-6 mt-auto w-full pt-4 text-center">
              {currentStep.link ? (
                <a
                  href={currentStep.link}
                  className="inline-block rounded-full bg-card px-8 py-2.5 text-xs font-bold text-[#0B3D2E] shadow-xl transition hover:bg-primary sm:text-sm"
                >
                  اطلاعات بیشتر
                </a>
              ) : (
                <button className="cursor-default rounded-full bg-card px-8 py-2.5 text-xs font-bold text-[#0B3D2E] shadow-xl sm:text-sm">
                  اطلاعات بیشتر
                </button>
              )}
            </div>
          </div>
        </div>

        {index === 0 && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="pointer-events-none absolute bottom-4 left-0 right-0 z-20 flex flex-col items-center gap-1"
          >
            <span className="text-[11px] font-semibold text-primary/60">
              برای ادامه اسکرول کنید
            </span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="h-6 w-4 rounded-full border border-primary/30"
            >
              <motion.span
                animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="mx-auto mt-1 block h-1.5 w-1.5 rounded-full bg-primary/60"
              />
            </motion.span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
