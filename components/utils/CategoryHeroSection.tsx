"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { LuTarget, LuBookOpen, LuUsers } from "react-icons/lu";

const CountUp = dynamic(() => import("react-countup"), { ssr: false });

interface StatsBox {
  text: string;
  number: string;
  icon?: string;
  top?: string;
  left?: string;
  align?: "left" | "right" | "center";
  col?: boolean;
}

interface StatCounter {
  number: number;
  suffix?: string;
  label: string;
}

interface Feature {
  icon?: React.ReactNode;
  iconName?: string;
  text: string;
}

interface CategoryHeroSectionProps {
  // Main content
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;

  // Call to actions
  cta1Text?: string;
  cta1Link?: string;
  cta2Text?: string;
  cta2Link?: string;

  // Optional enhancements
  statsBoxes?: StatsBox[];
  statCounters?: StatCounter[];
  features?: Feature[];
}

const CategoryHeroSection = ({
  title = "آموزش جامع",
  subtitle: _subtitle,
  description = "توضیحات کامل درباره این دسته‌بندی",
  image: _image = "/images/default-hero.jpg",
  cta1Text = "مشاهده دوره‌ها",
  cta1Link = "#courses",
  cta2Text = "مشاوره رایگان",
  cta2Link = "#contact",
  statsBoxes: _statsBoxes = [],
  statCounters = [],
  features = [
    {
      iconName: "LuTarget",
      text: "نقشه راه کامل از صفر",
    },
    {
      iconName: "LuBookOpen",
      text: "کامل‌ترین محتوا",
    },
    {
      iconName: "LuUsers",
      text: "اجتماع بزرگ دانش‌آموزان",
    },
  ],
}: CategoryHeroSectionProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Map icon names to actual icon components
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const iconMap: { [key: string]: React.ReactNode } = {
      LuTarget: <LuTarget className="text-myPrimary text-3xl" />,
      LuBookOpen: <LuBookOpen className="text-myPrimary text-3xl" />,
      LuUsers: <LuUsers className="text-myPrimary text-3xl" />,
    };
    return iconMap[iconName] || null;
  };

  return (
    <section className="min-h-screen relative overflow-hidden flex flex-col justify-between pt-6 sm:pt-8 md:pt-8 lg:pt-0 pb-8 lg:pb-0">
      {/* بخش بالا */}
      <div className="container-xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 mt-12 sm:mt-16 md:mt-20 lg:mt-24 px-4 sm:px-6 md:px-8">
        {/* محتوای متنی - تمام عرض */}
        <div className="w-full space-y-5 sm:space-y-6 md:space-y-6 z-10">
          {/* عنوان اصلی */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-mySecondary leading-tight mt-2 md:mt-0">
            {_subtitle ? (
              <>
                <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-muted-foreground dark:text-textSecondary mb-2">
                  {_subtitle}
                </span>
                <span className="text-myPrimary">{title}</span>
              </>
            ) : title.includes("پیشرو") ? (
              <>
                {title.split("پیشرو")[0]}
                <span className="text-myPrimary">پیشرو</span>
                {title.split("پیشرو")[1]}
              </>
            ) : (
              <>{title}</>
            )}
          </h1>

          {/* توضیحات */}
          <p className="text-muted-foreground dark:text-textSecondary text-sm sm:text-base md:text-lg leading-relaxed max-w-4xl">
            {description}
          </p>

          {/* دکمه‌های CTA */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-5">
            <a
              href={cta1Link}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-mySecondary text-primary-foreground border border-mySecondary font-semibold rounded-xl shadow-md transition-transform duration-300 ease-in-out text-sm sm:text-base hover:scale-105 hover:-rotate-1 active:scale-95 text-center"
            >
              {cta1Text}
            </a>

            <a
              href={cta2Link}
              className="px-5 sm:px-6 py-2.5 sm:py-3 border border-mySecondary text-mySecondary font-semibold rounded-xl transition-transform duration-300 ease-in-out text-sm sm:text-base hover:scale-105 hover:rotate-1 active:scale-95 text-center"
            >
              {cta2Text}
            </a>
          </div>

          {/* ویژگی‌ها */}
          {features.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8 pt-3 sm:pt-4 md:pt-6 lg:pt-8 flex-wrap">
              {features.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 sm:gap-3 bg-muted dark:bg-darkBgHidden sm:bg-transparent rounded-lg sm:rounded-none px-3 py-2.5 sm:px-0 sm:py-0"
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl flex-shrink-0">
                    {item.icon || getIcon(item.iconName)}
                  </div>
                  <p className="text-muted-foreground dark:text-textPrimary font-medium text-sm sm:text-base">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* آمار پایین - شمارنده‌ها */}
      {statCounters.length > 0 && (
        <div className="container-xl grid grid-cols-2 sm:flex sm:flex-row justify-around items-center pb-6 pt-2 sm:pb-8 sm:pt-4 gap-4 sm:gap-6 md:gap-4 px-4 sm:px-6 md:px-8">
          {statCounters.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center w-full sm:w-auto"
            >
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-mySecondary">
                {isClient ? (
                  <CountUp start={0} end={item.number} duration={2.5} />
                ) : (
                  0
                )}
                {item.suffix}
              </span>
              <p className="text-muted-foreground dark:text-textSecondary mt-1 sm:mt-2 font-medium text-xs sm:text-sm md:text-base lg:text-lg text-center">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryHeroSection;
