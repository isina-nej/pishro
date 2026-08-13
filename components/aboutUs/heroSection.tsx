"use client";

import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import * as LuIcons from "react-icons/lu";
import { IconType } from "react-icons";
import type { StatItem } from "@/types/about-us";
import type { Prisma } from "@prisma/client";

interface HeroSectionProps {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  badgeText?: string | null;
  stats: Prisma.JsonValue;
}

const HeroSection = ({
  title,
  subtitle,
  description,
  badgeText,
  stats,
}: HeroSectionProps) => {
  // Parse stats JSON
  const statsData: StatItem[] = Array.isArray(stats)
    ? (stats as unknown as StatItem[])
    : [];

  // Helper function to get icon component from icon name
  const getIconComponent = (iconName?: string): IconType => {
    if (!iconName) return LuIcons.LuTarget;
    const IconComponent = (LuIcons as Record<string, IconType>)[iconName];
    return IconComponent || LuIcons.LuTarget;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/aboutUsLanding.webm" type="video/webm" />
      </video>

      {/* Soft vignette — keep video clear */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50" />

      <div className="container-md relative z-10 py-24">
        <div className="mx-auto max-w-5xl rounded-[2.25rem] border border-white/20 bg-black/40 p-7 text-center text-white shadow-2xl shadow-black/30 sm:p-10">
          {/* Badge */}
          {badgeText && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-2 mt-2 mb-6 text-white shadow-sm backdrop-blur-sm"
            >
              <HiSparkles className="text-premium text-xl" />
              <span className="text-sm font-medium">{badgeText}</span>
            </motion.div>
          )}

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.35] px-4 text-white"
          >
            {subtitle && (
              <>
                {subtitle}
                <br />
              </>
            )}
            <span className="text-premium">{title}</span>
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8 text-white/85 px-4"
            >
              {description}
            </motion.p>
          )}

          {/* Stats */}
          {statsData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-4"
            >
              {statsData.map((stat: StatItem, index: number) => {
                const IconComponent = getIconComponent(stat.icon);
                return (
                  <div
                    key={index}
                    className={`group rounded-3xl border border-white/15 bg-white/[0.08] p-6 text-white shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 ${
                      index === statsData.length - 1 &&
                      statsData.length % 3 !== 0
                        ? "sm:col-span-2 md:col-span-1"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-premium/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                        <IconComponent className="text-3xl md:text-4xl text-premium" />
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2 text-white">
                      {stat.value}
                    </div>
                    <div className="text-white/80 text-sm md:text-base">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute -bottom-10 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full text-foreground dark:text-bodyBg"
        >
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
