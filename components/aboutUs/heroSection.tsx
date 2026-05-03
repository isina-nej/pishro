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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container-md py-24 relative z-10">
        <div className="text-center text-white">
          {/* Badge */}
          {badgeText && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mt-2 mb-6"
            >
              <HiSparkles className="text-yellow-300 text-xl" />
              <span className="text-sm font-medium">{badgeText}</span>
            </motion.div>
          )}

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight px-4"
          >
            {subtitle && (
              <>
                {subtitle}
                <br />
              </>
            )}
            <span className="text-yellow-300">{title}</span>
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8 text-white/90 px-4"
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
                    className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group ${
                      index === statsData.length - 1 &&
                      statsData.length % 3 !== 0
                        ? "sm:col-span-2 md:col-span-1"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-yellow-300/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                        <IconComponent className="text-3xl md:text-4xl text-yellow-300" />
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">
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
          viewBox="0 0 1440 220"
          className="w-full"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
