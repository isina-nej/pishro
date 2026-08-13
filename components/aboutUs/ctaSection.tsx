"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { HiSparkles } from "react-icons/hi2";

interface CtaSectionProps {
  title?: string | null;
  description?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
}

const CtaSection = ({
  title,
  description,
  buttonText,
  buttonLink,
}: CtaSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Default values
  const ctaTitle = title || "آماده‌اید برای شروع سفر سرمایه‌ گذاری هوشمند؟";
  const ctaDescription =
    description ||
    "با پیوستن به جمع هزاران دانشجوی موفق ما، اولین قدم را برای دستیابی استقلال مالی بردارید";
  const ctaButtonText = buttonText || "مشاهده دوره‌ها";
  const ctaButtonLink = buttonLink || "/courses";

  return (
    <div ref={ref} className="container-md py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2.5rem] border border-white/15 shadow-2xl shadow-primary/20"
        style={{
          background:
            "linear-gradient(to bottom right, var(--home-deep), var(--home-glow), var(--home-deep))",
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-10 right-10 h-64 w-64 animate-pulse rounded-full bg-[var(--home-gold)]/35 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-80 w-80 animate-pulse rounded-full bg-white/15 blur-3xl delay-1000" />
        </div>

        <div className="relative z-10 p-12 md:p-16">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge — locked light text on dark emerald panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="home-on-dark mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-2 backdrop-blur-sm"
            >
              <HiSparkles className="text-xl text-[var(--home-gold)]" />
              <span className="text-sm font-medium">شروع مسیر موفقیت</span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="home-on-dark mb-6 px-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl"
            >
              {ctaTitle}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="home-on-dark-muted mx-auto mb-10 max-w-2xl px-4 text-base leading-relaxed sm:text-lg md:text-xl"
            >
              {ctaDescription}
            </motion.p>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col justify-center gap-4 sm:flex-row"
            >
              <Link
                href={ctaButtonLink}
                className="group flex items-center justify-center gap-2 rounded-xl bg-card px-8 py-4 text-lg font-bold text-[var(--home-deep)] shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:text-[var(--home-glow)]"
              >
                <span>{ctaButtonText}</span>
                <LuArrowLeft className="transition-transform group-hover:-translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CtaSection;
