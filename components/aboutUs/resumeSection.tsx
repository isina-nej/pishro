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

  // Gradient color mapping - prevents Tailwind purging
  /*
   * کلیدها مقادیری هستند که در دیتابیس ذخیره شده‌اند (item.color) و نباید عوض
   * شوند، وگرنه جستجو رد می‌شود و همه‌ی آیتم‌ها به رنگ پیش‌فرض می‌افتند.
   * مقادیر، کلاس تیلویند خروجی‌اند و به پالت نگاشت شده‌اند. نوشتنشان به‌صورت
   * رشته‌ی کامل عمدی است تا JIT تیلویند آن‌ها را در اسکن پیدا کند.
   */
  const gradientColorMap: Record<string, string> = {
    "from-blue-500 to-purple-500": "from-chart-4 to-accent",
    "from-green-500 to-emerald-500": "from-primary to-success",
    "from-orange-500 to-red-500": "from-premium to-destructive",
    "from-pink-500 to-rose-500": "from-destructive to-chart-5",
    "from-purple-500 to-indigo-500": "from-accent to-chart-4",
    "from-red-500 to-orange-500": "from-destructive to-premium",
    "from-yellow-500 to-orange-500": "from-premium to-chart-5",
    "from-indigo-500 to-purple-500": "from-chart-4 to-accent",
    "from-teal-500 to-cyan-500": "from-success to-chart-2",
    "from-cyan-500 to-blue-500": "from-chart-2 to-chart-4",
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
        <h2 className="text-4xl font-bold mb-4 text-foreground dark:text-textPrimary">
          داستان <span className="text-myPrimary">پیشرو</span>
        </h2>
        <p className="text-lg text-muted-foreground dark:text-textSecondary max-w-2xl mx-auto">
          از آغاز تا امروز، با هدف واحد: ساختن آینده‌ای روشن‌تر برای
          سرمایه‌گذاران
        </p>
      </motion.div>

      {/* Resume Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resumeItems.map((item, index) => {
          const IconComponent = getIconComponent(item.icon);
          const gradientColor = gradientColorMap[item.color || ""] || "from-primary to-accent";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`public-page-card group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
            >
              {/* Gradient Background */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientColor} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}
              ></div>

              {/* Icon */}
              <div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradientColor} text-primary-foreground mb-6 group-hover:scale-110 transition-transform relative z-10`}
              >
                <IconComponent className="text-4xl" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-foreground dark:text-textPrimary relative z-10">
                {item.title}
              </h3>
              <p className="text-muted-foreground dark:text-textSecondary leading-relaxed relative z-10">
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
