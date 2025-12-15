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
    "با پیوستن به جمع هزاران دانشجوی موفق ما، اولین قدم را برای دستیابی به استقلال مالی بردارید";
  const ctaButtonText = buttonText || "مشاهده دوره‌ها";
  const ctaButtonLink = buttonLink || "/courses";

  return (
    <div ref={ref} className="container-md py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-myPrimary via-mySecondary to-myPrimary rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-12 md:p-16">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6"
            >
              <HiSparkles className="text-yellow-300 text-xl" />
              <span className="text-sm font-medium">شروع مسیر موفقیت</span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight px-4"
            >
              {ctaTitle}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto px-4"
            >
              {ctaDescription}
            </motion.p>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href={ctaButtonLink}
                className="group bg-white text-myPrimary px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>{ctaButtonText}</span>
                <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CtaSection;
