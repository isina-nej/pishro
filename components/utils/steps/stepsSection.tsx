"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import StepListTablet from "./StepListTablet";
import StepListMobile from "./StepListMobile";
// import StepsDecorations from "@/components/home/stepsDecorations";

// Types for steps
interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepsSectionProps {
  steps: Step[];
  sectionQuote?: string;
  sectionTitle: string;
  sectionSubtitle: string;
  sectionCta?: string;
}

// Step item component
const StepItem = ({
  step,
  index,
  activeIndex,
}: {
  step: Step;
  index: number;
  activeIndex: number;
}) => {
  const isActive = index <= activeIndex;

  return (
    <motion.div
      key={step.id}
      className="relative min-w-[220px] min-h-[200px] p-6"
    >
      {/* Circle + pulse animation */}
      <div className="absolute -top-6 right-8 bg-gray-50/50 rounded-full size-16 flex justify-center items-center">
        <div
          className={clsx(
            "size-8 rounded-full transition",
            isActive ? "bg-yellow-300" : "bg-gray-300"
          )}
        />

        {isActive && (
          <motion.div
            className="absolute size-8 rounded-full bg-yellow-300"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {/* Text & number */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{
          opacity: isActive ? 1 : 0,
          x: isActive ? 0 : 100,
        }}
        transition={{ duration: 0.6 }}
        className="relative size-full flex flex-col items-start justify-start pt-8"
      >
        <h3 className="text-[22px] font-bold text-gray-900 mb-2 mt-1">
          {step.title}
        </h3>
        <p className="text-gray-600 mb-4 leading-7 max-w-[240px]">
          {step.description}
        </p>

        <div
          className={clsx(
            "absolute -z-10",
            index === 0 ? "-left-[26px] -top-10" : "-left-[64px] -top-[58]"
          )}
        >
          <p className="text-[160px] font-black text-gray-300">{step.id}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StepsSection = ({
  steps,
  sectionQuote,
  sectionTitle,
  sectionSubtitle,
  sectionCta = "شروع کنید",
}: StepsSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepPoints, setStepPoints] = useState<{ x: number; y: number }[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // Calculate scroll activeIndex
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY - node.offsetTop;
      const vh = window.innerHeight;
      const newIndex = Math.min(
        steps.length - 1,
        Math.max(0, Math.floor(scrollTop / vh))
      );
      setActiveIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps.length]);

  // Calculate points from SVG path → تبدیل به درصد
  useEffect(() => {
    const path = document.querySelector("#stepsPath") as SVGPathElement;
    if (!path) return;

    const svg = path.ownerSVGElement!;
    const pathLength = path.getTotalLength();

    const vb = svg.viewBox.baseVal; // ابعاد viewBox
    const vbWidth = vb.width;
    const vbHeight = vb.height;

    const start = 0.11; // 11%
    const end = 0.95; // 95%

    const points = steps.map((_, i) => {
      const t = start + (i / (steps.length - 1)) * (end - start); // بین 0.05 تا 0.95
      const point = path.getPointAtLength(t * pathLength);

      // تبدیل به درصد
      const xPercent = (point.x / vbWidth) * 100;
      const yPercent = (point.y / vbHeight) * 100;

      return { x: xPercent, y: yPercent };
    });

    setStepPoints(points);
  }, [steps]);

  return (
    <>
      <section
        ref={sectionRef}
        id="stepsSection"
        style={{ height: `calc(${steps.length} * 100vh + 300px)` }}
        className="relative w-full hidden lg:block"
      >
        <div className="sticky top-0 h-screen container-xl">
          {/* Background Decorations */}
          {/* <StepsDecorations /> */}
          <div className="w-full h-32"></div>
          {/* steps section */}
          <div className="relative flex w-[80%] [aspect-ratio:1071/449]">
            {/* Header */}
            <div className="absolute flex flex-col justify-start py-6 px-4 w-[65%] right-0 -top-16 z-10">
              <p className="text-myPrimary font-bold text-sm mb-2">
                {sectionQuote}
              </p>
              <h2 className="text-5xl leading-tight font-extrabold text-gray-800 max-w-[700px]">
                {sectionTitle}
              </h2>
              <p className="mt-4 max-w-[620px] text-gray-600 leading-7">
                {sectionSubtitle}
              </p>
              <button className="rounded-full hover:text-[#344052] text-white bg-[#344052] hover:bg-white transition-all duration-300 font-bold px-4 py-2.5 border-2 border-[#344052] flex items-center justify-center w-fit mt-8">
                {sectionCta}
              </button>
            </div>
            <div className="relative size-full">
              {/* SVG Line Path */}
              <div className="absolute inset-0 size-full">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1071 449"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid meet"
                  className="absolute inset-0"
                >
                  <path
                    id="stepsPath"
                    d="M1043.6865 311
                C995.6865 346 883.887 412 820.687 396
                C741.687 376 722.187 273 600.187 249
                  C478.187 225 388.687 308.5 294.187 188
                  C199.687 67.5003 153.687 -11.4997 26.69 5.50027"
                    stroke="#D32F2F"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {stepPoints.map((p, i) => (
              <div
                key={steps[i].id}
                className="absolute w-[320px] -translate-x-[245px] -translate-y-[8px]"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <StepItem step={steps[i]} index={i} activeIndex={activeIndex} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* نسخه تبلت */}
      <StepListTablet
        steps={steps}
        sectionTitle={sectionTitle}
        sectionSubtitle={sectionSubtitle}
      />

      {/* نسخه موبایل */}
      <StepListMobile
        steps={steps}
        sectionTitle={sectionTitle}
        sectionSubtitle={sectionSubtitle}
      />
    </>
  );
};

export default StepsSection;
