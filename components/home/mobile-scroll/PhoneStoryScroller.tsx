"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { mobileScrollerSteps, type MobileScrollerStep } from "./data";

type PhoneStoryScrollerProps = {
  steps?: MobileScrollerStep[];
};

function ScreenContent({
  step,
  priority,
  interactive,
}: {
  step: MobileScrollerStep;
  priority?: boolean;
  interactive?: boolean;
}) {
  const isPage = step.contentType === "PAGE" && Boolean(step.pageUrl);

  if (isPage && step.pageUrl) {
    return (
      <iframe
        src={step.pageUrl}
        title={step.title}
        className={clsx(
          "absolute inset-0 h-full w-full border-0 bg-[var(--home-bg,#F7F5F0)]",
          interactive ? "pointer-events-auto" : "pointer-events-none"
        )}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        // Showcase only — keep site scroll owning the section scrub
        tabIndex={interactive ? 0 : -1}
      />
    );
  }

  const src = step.img || "/images/home/mobile-scroll/in-mobile-1.svg";
  return (
    <Image
      src={src}
      alt=""
      fill
      className="object-contain"
      sizes="(max-width: 1024px) 220px, 320px"
      priority={priority}
    />
  );
}

function ScreenLayer({
  step,
  progress,
  stepIndex,
  stepCount,
  priority,
  isNearActive,
  isActive,
}: {
  step: MobileScrollerStep;
  progress: MotionValue<number>;
  stepIndex: number;
  stepCount: number;
  priority?: boolean;
  isNearActive: boolean;
  isActive: boolean;
}) {
  const start = stepIndex / stepCount;
  const mid = (stepIndex + 0.5) / stepCount;
  const end = (stepIndex + 1) / stepCount;
  const fadeIn = Math.max(start, mid - 0.12 / stepCount);
  const fadeOut = Math.min(end, mid + 0.12 / stepCount);

  const opacity = useTransform(
    progress,
    [start, fadeIn, fadeOut, end],
    stepIndex === 0
      ? [1, 1, 1, 0]
      : stepIndex === stepCount - 1
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0]
  );

  const isPage = step.contentType === "PAGE" && Boolean(step.pageUrl);
  // Mount iframes only near the active step to avoid loading every page at once
  const shouldRender = !isPage || isNearActive;

  return (
    <motion.div className="absolute inset-0" style={{ opacity }} aria-hidden={!isActive}>
      {shouldRender ? (
        <ScreenContent step={step} priority={priority} interactive={false} />
      ) : null}
    </motion.div>
  );
}

function StaticFallback({ steps }: { steps: MobileScrollerStep[] }) {
  return (
    <section className="relative w-full py-16 container-xl">
      <header className="mb-10 max-w-xl px-4 text-right lg:px-8">
        <p className="mb-2 text-xs font-bold text-primary">
          تجربه یکپارچه مالی
        </p>
        <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          سامانه پیشرو
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          سامانه{" "}
          <span className="text-primary">پیشرو</span>، مشاور و همراه مالی شما
          در مسیر پیشرفت
        </p>
      </header>

      <ul className="mx-auto flex max-w-3xl flex-col gap-8 px-4 lg:px-8">
        {steps.map((step) => (
          <li
            key={step.id}
            className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8"
          >
            <div className="relative h-56 w-32 shrink-0 overflow-hidden rounded-[1.6rem] shadow-lg sm:h-64 sm:w-36">
              <Image
                src={
                  step.imgCover || "/images/home/mobile-scroll/mobile.webp"
                }
                alt=""
                fill
                className="object-cover"
                sizes="144px"
              />
              <div className="absolute inset-[6%] overflow-hidden rounded-[1.1rem]">
                <ScreenContent step={step} />
              </div>
            </div>
            <div className="flex-1 text-center sm:pt-6 sm:text-right">
              <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {step.text}
              </p>
              {step.link ? (
                <a
                  href={step.link}
                  className="mt-4 inline-block text-sm font-bold text-primary underline-offset-4 hover:underline"
                >
                  اطلاعات بیشتر
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PhoneStoryScroller({
  steps: providedSteps,
}: PhoneStoryScrollerProps = {}) {
  const steps =
    providedSteps && providedSteps.length > 0
      ? providedSteps
      : mobileScrollerSteps;

  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.35,
  });

  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

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

  const currentStep = steps[index];
  // Keep the bezel fixed; only in-screen layers scrub with scroll.
  const frameSrc =
    steps[0]?.imgCover || "/images/home/mobile-scroll/mobile.webp";

  const captionVariants = {
    enter: (dir: "up" | "down") => ({
      opacity: 0,
      y: dir === "down" ? 28 : -28,
      filter: "blur(6px)",
    }),
    center: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: {
      opacity: 0,
      filter: "blur(6px)",
      y: 0,
      transition: { duration: 0.28 },
    },
  };

  if (reduceMotion) {
    return <StaticFallback steps={steps} />;
  }

  return (
    <section
      ref={sectionRef}
      style={{ height: `${Math.max(1, steps.length) * 100}vh` }}
      className="relative mt-12 w-full lg:mt-20"
      aria-label="مزایای سامانه پیشرو"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden
        >
          <div className="absolute left-1/2 top-1/3 hidden h-[50vmin] w-[50vmin] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl dark:block" />
          <div className="absolute bottom-1/4 right-[10%] hidden h-[35vmin] w-[35vmin] rounded-full bg-premium/[0.06] blur-3xl dark:block" />
        </div>

        <div className="container-xl flex min-h-0 flex-1 flex-col px-4 py-6 lg:px-8 lg:py-8">
          <header className="relative z-10 shrink-0 text-right">
            <p className="mb-1 text-[11px] font-bold tracking-wide text-muted-foreground lg:text-xs">
              سامانه پیشرو
            </p>
            <div className="mt-3 h-[2px] w-full max-w-xs overflow-hidden rounded-full bg-border">
              <motion.div
                className="h-full origin-right rounded-full bg-gradient-to-l from-primary to-premium"
                style={{ width: progressWidth }}
              />
            </div>
          </header>

          <div className="relative z-10 mt-4 flex min-h-0 flex-1 flex-col items-center gap-6 lg:mt-0 lg:flex-row lg:items-center lg:justify-center lg:gap-16 xl:gap-24">
            <div className="order-1 flex w-full max-w-md shrink-0 flex-col justify-center text-center lg:order-2 lg:max-w-sm lg:text-right xl:max-w-md">
              <div className="mb-3 flex max-w-full flex-wrap items-center justify-center gap-2 lg:justify-start">
                {steps.map((step, i) => (
                  <span
                    key={step.id}
                    className={clsx(
                      "h-1.5 rounded-full transition-all duration-500",
                      i === index
                        ? "w-7 bg-primary"
                        : "w-1.5 bg-muted-foreground/35"
                    )}
                    aria-hidden
                  />
                ))}
                <span className="sr-only">
                  مرحله {index + 1} از {steps.length}
                </span>
              </div>

              <div className="relative min-h-[9.5rem] lg:min-h-[11rem]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep.id}
                    custom={direction}
                    variants={captionVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-x-0 top-0"
                  >
                    <p className="mb-2 text-xs font-bold text-primary lg:text-sm">
                      {currentStep.title}
                    </p>
                    <h3 className="text-xl font-black leading-9 tracking-tight text-foreground sm:text-2xl lg:text-3xl lg:leading-[2.6rem]">
                      {currentStep.text}
                    </h3>
                    {currentStep.link ? (
                      <a
                        href={currentStep.link}
                        className="mt-5 inline-block text-sm font-bold text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline"
                      >
                        اطلاعات بیشتر
                      </a>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="order-2 flex shrink-0 items-center justify-center lg:order-1">
              <div className="relative h-[min(58vh,420px)] w-[min(52vw,220px)] drop-shadow-[0_28px_50px_rgba(11,61,46,0.22)] sm:h-[min(62vh,520px)] sm:w-[min(42vw,260px)] lg:h-[min(72vh,640px)] lg:w-[300px] xl:w-[320px]">
                <Image
                  src={frameSrc}
                  alt="نمای سامانه پیشرو روی موبایل"
                  fill
                  className="object-cover rounded-[2rem] lg:rounded-[2.4rem]"
                  sizes="(max-width: 1024px) 260px, 320px"
                  priority
                />
                <div className="absolute inset-[3.5%] overflow-hidden rounded-[1.55rem] bg-[var(--home-bg,#F7F5F0)] lg:inset-[3%] lg:rounded-[1.85rem]">
                  {steps.map((step, i) => (
                    <ScreenLayer
                      key={step.id}
                      step={step}
                      progress={smoothProgress}
                      stepIndex={i}
                      stepCount={steps.length}
                      priority={i === 0}
                      isNearActive={Math.abs(i - index) <= 1}
                      isActive={i === index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {index === 0 ? (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="pointer-events-none absolute bottom-5 left-0 right-0 z-20 flex flex-col items-center gap-1"
          >
            <span className="text-[11px] font-semibold text-muted-foreground">
              برای ادامه اسکرول کنید
            </span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-6 w-4 rounded-full border border-muted-foreground/40"
            >
              <motion.span
                animate={{ y: [0, 7, 0], opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mx-auto mt-1 block h-1.5 w-1.5 rounded-full bg-muted-foreground/70"
              />
            </motion.span>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
