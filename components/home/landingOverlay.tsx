"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import AboutUs from "./aboutUs";

const LandingOverlay = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Overlay fades in (unchanged)
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.25, 1], [0, 1, 1]);

  // Content animation: opacity + translateY
  const aboutOpacity = useTransform(scrollYProgress, [0.15, 0.18], [0, 1]);
  const aboutY = useTransform(scrollYProgress, [0.15, 0.18], [40, 0]);

  // Use spring for smoother animation
  const smoothOpacity = useSpring(aboutOpacity, {
    stiffness: 100,
    damping: 20,
  });
  const smoothY = useSpring(aboutY, { stiffness: 100, damping: 20 });

  return (
    <>
      {/* Section 1: Landing with video */}
      <section ref={ref} className="relative w-full h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/aboutUs.webm" type="video/mp4" />
        </video>

        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-white"
        />
      </section>

      {/* Section 2: About Us content */}
      <motion.div
        style={{
          opacity: smoothOpacity,
          y: smoothY,
        }}
        transition={{ duration: 0.2 }} // fallback duration
        className="-mt-[60vh] w-full mb-20"
      >
        <div className="w-full flex items-start pt-0 justify-center mb-20">
          <div className="z-10 bg-mySecondary h-[180px] w-[1174px] mx-auto rounded-[44px] flex items-center justify-between py-10">
            <StatCard number="7" label="سال سابقه" />
            <StatCard number="+50" label="همکاری موفق" />
            <StatCard number="3" label="شعبه فعال" />
            <StatCard number="+400" label="شبکه سازی" isLast />
          </div>
        </div>
        <AboutUs />
      </motion.div>
    </>
  );
};

export default LandingOverlay;

/* ----------------- New Component ----------------- */

type StatCardProps = {
  number: string;
  label: string;
  isLast?: boolean;
};

const StatCard = ({ number, label, isLast }: StatCardProps) => {
  return (
    <div
      className={`flex-1 h-full px-20 ${
        !isLast ? "border-l" : ""
      } flex flex-col justify-center items-center text-white`}
    >
      <p className="font-semibold text-4xl ltr">{number}</p>
      <p className="text-xl font-light">{label}</p>
    </div>
  );
};
