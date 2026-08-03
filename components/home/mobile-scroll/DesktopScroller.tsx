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

    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const handleScroll = () => {
      if (!desktopQuery.matches) return;

      const rect = node.getBoundingClientRect();

      // 0 when the top of this section reaches the top of the viewport
      const scrolledPastTop = Math.max(0, -rect.top);

      // Make the entire extra height of the section drive the steps.
      // We gave the section extra height (steps.length * 100vh), so use that as range.
      const totalExtraHeight = Math.max(1, rect.height - window.innerHeight);

      const progress = Math.min(0.999, scrolledPastTop / totalExtraHeight);

      const newIndex = Math.min(
        steps.length - 1,
        Math.floor(progress * steps.length)
      );

      if (newIndex !== index) {
        const goingDown = newIndex > index;
        setDirection(goingDown ? "down" : "up");
        setIndex(newIndex);
      }
    };

    // Run once after mount
    requestAnimationFrame(handleScroll);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [steps, index]);

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
      style={{ height: `${steps.length * 100}vh` }}
      className="relative mt-20 w-full"
    >
      <div className="sticky top-0 grid h-screen grid-rows-[auto_minmax(0,1fr)] gap-5 py-6 container-xl">
        <div className="relative z-10 flex w-full flex-col items-start justify-start px-8 xl:px-20">
          <span className="mb-2 rounded-full border border-[#214254]/10 bg-card/50 px-4 py-2 text-xs font-bold text-[#214254] backdrop-blur-xl/10/5">تجربه یکپارچه مالی</span>
          <h4 className="mb-1 text-4xl font-black tracking-tight text-[#112b3a] xl:text-5xl">سامانه پیشرو</h4>
          <p className="text-sm text-muted-foreground dark:text-textSecondary xl:text-base">
            سامانه <span className="text-myPrimary">پیشرو</span>، مشاور و همراه
            مالی شما در مسیر پیشرفت
          </p>
        </div>

        <div className="min-h-0 w-full overflow-hidden pb-4">
          <div className="home-glass-panel relative h-full min-h-[520px] w-full overflow-hidden rounded-[40px]">
            <div className="absolute inset-0 overflow-hidden rounded-[38px] bg-gradient-to-br from-[#12344b]/95 via-[#183c53]/90 to-[#0d2435]/95">
              <div className="absolute -right-32 -top-36 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
              <div className="absolute -bottom-28 left-1/4 h-80 w-80 rounded-full bg-premium/10 blur-3xl" />
              <div className="absolute inset-y-0 left-0 w-[38%] border-r border-border/10 bg-card/[0.06] backdrop-blur-2xl" />
            </div>

            <div className="w-full h-full flex items-center justify-center">
              {/* right section */}
              <div className="z-10 flex h-full flex-1 flex-col justify-between py-10 pr-12 pl-8 xl:py-14">
                <div>
                  <h4 className="mb-8 text-4xl font-semibold text-foreground xl:text-5xl">
                    از مزایای پیشرو بودن
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
                              ? "bg-card dark:bg-cardBg border-border"
                              : "bg-accent border-border"
                          )}
                        />
                        <span
                          className={clsx(
                            "text-base transition-all",
                            i === index
                              ? "text-foreground font-semibold"
                              : "text-muted-foreground dark:text-textSecondary"
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
                        className="inline-block rounded-full border border-border/20 bg-card px-10 py-3 font-bold text-[#112b3a] shadow-xl transition hover:-translate-y-0.5 hover:bg-primary"
                      >
                        اطلاعات بیشتر
                      </a>
                    ) : (
                      <button className="cursor-default rounded-full border border-border/20 bg-card px-10 py-3 font-bold text-[#112b3a] shadow-xl">
                        اطلاعات بیشتر
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* left section */}
              <div className="relative flex h-full w-[42%] min-w-[390px] justify-center pl-8">
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={steps[index].id}
                    variants={variants}
                    custom={direction}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative h-[115%] max-h-[720px] w-full max-w-[435px] -mb-[80px]"
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
