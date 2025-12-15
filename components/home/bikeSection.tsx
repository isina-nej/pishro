"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import { useRef } from "react";

const BikeSection = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 15 });

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-400px" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const rotateX = useTransform(smoothY, (val) => val * 10);
  const rotateY = useTransform(smoothX, (val) => val * -10);

  const texts = [
    { text: "آماده‌ای؟", top: "15%", left: "58%", delay: 0, depth: 1 },
    {
      text: "وقتشه که حرکت کنیم!",
      top: "22.5%",
      left: "20%",
      delay: 0.6,
      depth: 0.7,
    },
    { text: "بزن بریم!!", top: "35%", left: "58%", delay: 1.2, depth: 0.4 },
  ];

  const translateX1 = useTransform(smoothX, (v) => v * 60 * texts[0].depth);
  const translateY1 = useTransform(smoothY, (v) => v * 40 * texts[0].depth);
  const translateX2 = useTransform(smoothX, (v) => v * 60 * texts[1].depth);
  const translateY2 = useTransform(smoothY, (v) => v * 40 * texts[1].depth);
  const translateX3 = useTransform(smoothX, (v) => v * 60 * texts[2].depth);
  const translateY3 = useTransform(smoothY, (v) => v * 40 * texts[2].depth);

  const parallax = [
    { x: translateX1, y: translateY1 },
    { x: translateX2, y: translateY2 },
    { x: translateX3, y: translateY3 },
  ];

  return (
    <section
      ref={sectionRef}
      className="container-xl cursor-default relative overflow-hidden h-[420px] sm:h-[550px] md:h-[80vh] lg:h-screen mt-10 md:mt-20 px-0 sm:px-3 md:px-8 lg:px-0 flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full aspect-[1.7] md:aspect-[1361/646] flex items-center justify-center overflow-hidden"
      >
        <Image
          src="/images/home/bike.svg"
          fill
          alt="دوچرخه‌سوار"
          className="object-cover select-none"
          priority
        />

        {texts.map((item, i) => (
          <motion.div
            key={i}
            style={{
              top: item.top,
              left: item.left,
              translateX: parallax[i].x,
              translateY: parallax[i].y,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: item.delay,
                      duration: 0.6,
                      ease: "easeOut",
                    },
                  }
                : {}
            }
            whileInView={{
              scale: [1, 1.12, 1],
            }}
            transition={{
              scale: {
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
                delay: item.delay + 1.2,
              },
            }}
            className="absolute px-3 py-2 md:px-6 md:py-3 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 shadow-lg will-change-transform"
          >
            <p className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 whitespace-nowrap">
              {item.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BikeSection;
