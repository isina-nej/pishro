"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import * as LuIcons from "react-icons/lu";
import { IconType } from "react-icons";
import type { ResumeItem } from "@/types/about-us";

interface ResumeSectionProps {
  resumeItems: ResumeItem[];
}

const ResumeSection = ({ resumeItems }: ResumeSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Helper function to get icon component from icon name
  const getIconComponent = (iconName?: string | null): IconType => {
    if (!iconName) return LuIcons.LuTarget;
    const IconComponent = (LuIcons as Record<string, IconType>)[iconName];
    return IconComponent || LuIcons.LuTarget;
  };

  // Background color mapping - prevents Tailwind purging
  const bgColorMap: Record<string, string> = {
    "bg-blue-50": "bg-blue-50",
    "bg-green-50": "bg-green-50",
    "bg-orange-50": "bg-orange-50",
    "bg-pink-50": "bg-pink-50",
    "bg-purple-50": "bg-purple-50",
    "bg-red-50": "bg-red-50",
    "bg-yellow-50": "bg-yellow-50",
    "bg-indigo-50": "bg-indigo-50",
    "bg-teal-50": "bg-teal-50",
    "bg-cyan-50": "bg-cyan-50",
    "bg-gray-50": "bg-gray-50",
  };

  // Gradient color mapping - prevents Tailwind purging
  const gradientColorMap: Record<string, string> = {
    "from-blue-500 to-purple-500": "from-blue-500 to-purple-500",
    "from-green-500 to-emerald-500": "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500": "from-orange-500 to-red-500",
    "from-pink-500 to-rose-500": "from-pink-500 to-rose-500",
    "from-purple-500 to-indigo-500": "from-purple-500 to-indigo-500",
    "from-red-500 to-orange-500": "from-red-500 to-orange-500",
    "from-yellow-500 to-orange-500": "from-yellow-500 to-orange-500",
    "from-indigo-500 to-purple-500": "from-indigo-500 to-purple-500",
    "from-teal-500 to-cyan-500": "from-teal-500 to-cyan-500",
    "from-cyan-500 to-blue-500": "from-cyan-500 to-blue-500",
  };

  if (resumeItems.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className="container-md py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          داستان <span className="text-myPrimary">پیشرو</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          از آغاز تا امروز، با هدف واحد: ساختن آینده‌ای روشن‌تر برای
          سرمایه‌گذاران
        </p>
      </motion.div>

      {/* Resume Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resumeItems.map((item, index) => {
          const IconComponent = getIconComponent(item.icon);
          const bgColor = bgColorMap[item.bgColor || ""] || "bg-gray-50";
          const gradientColor = gradientColorMap[item.color || ""] || "from-blue-500 to-purple-500";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${bgColor} rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
            >
              {/* Gradient Background */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientColor} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}
              ></div>

              {/* Icon */}
              <div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradientColor} text-white mb-6 group-hover:scale-110 transition-transform relative z-10`}
              >
                <IconComponent className="text-4xl" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-gray-800 relative z-10">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ResumeSection;
