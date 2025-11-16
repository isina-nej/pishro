"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import clsx from "clsx";
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
  subtitle,
  description = "توضیحات کامل درباره این دسته‌بندی",
  image = "/images/default-hero.jpg",
  cta1Text = "مشاهده دوره‌ها",
  cta1Link = "#courses",
  cta2Text = "مشاوره رایگان",
  cta2Link = "#contact",
  statsBoxes = [],
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
  const [heroImageSrc, setHeroImageSrc] = useState(image);
  const defaultHeroImage = "/images/default-hero.jpg";

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
        {/* سمت راست - محتوای متنی */}
        <div className="w-full lg:w-1/2 space-y-5 sm:space-y-6 md:space-y-6 z-10 order-2 lg:order-1">
          {/* عنوان اصلی */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-mySecondary leading-tight mt-2 md:mt-0">
            {subtitle ? (
              <>
                <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-600 mb-2">
                  {subtitle}
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
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
            {description}
          </p>

          {/* دکمه‌های CTA */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-5">
            <a
              href={cta1Link}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-mySecondary text-white border border-mySecondary
                font-semibold rounded-xl shadow-md transition-transform duration-300 ease-in-out
                text-sm sm:text-base hover:scale-105 hover:-rotate-1 active:scale-95 text-center
              "
            >
              {cta1Text}
            </a>

            <a
              href={cta2Link}
              className="px-5 sm:px-6 py-2.5 sm:py-3 border border-mySecondary text-mySecondary
                font-semibold rounded-xl transition-transform duration-300 ease-in-out
                text-sm sm:text-base hover:scale-105 hover:rotate-1 active:scale-95 text-center"
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
                  className="flex items-center gap-2.5 sm:gap-3 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none px-3 py-2.5 sm:px-0 sm:py-0"
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl flex-shrink-0">
                    {item.icon || getIcon(item.iconName)}
                  </div>
                  <p className="text-gray-700 font-medium text-sm sm:text-base">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* سمت چپ - تصویر و باکس‌های شناور */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center relative order-1 lg:order-2">
          <div className="relative size-[100%] sm:size-[380px] md:size-[450px] lg:size-[520px] flex items-center justify-center overflow-visible">
            {/* تصویر اصلی */}
            <div className="size-[320px] sm:size-[350px] md:size-[420px] lg:size-[495px] rounded-full bg-emerald-500 flex items-center justify-center relative shadow-lg">
              <Image
                src={heroImageSrc}
                alt={title}
                fill
                className="object-contain rounded-full"
                onError={() => setHeroImageSrc(defaultHeroImage)}
              />
            </div>

            {/* باکس‌های شناور از statsBoxes */}
            {statsBoxes.map((box, i) => {
              // Default positions for stats boxes when not provided by backend
              const defaultPositions = [
                { top: "5%", left: "-8%" }, // Top-left area
                { top: "72%", left: "0%" }, // Bottom-left area
                { top: "20%", left: "78%" }, // Right area
                { top: "65%", left: "82%" }, // Bottom-right area
              ];

              const position = defaultPositions[i] || {
                top: "50%",
                left: "50%",
              };
              const boxTop = box.top || position.top;
              const boxLeft = box.left || position.left;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.95, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: [1, 1.15, 1], y: 0 }}
                  transition={{
                    delay: 0.8 * i,
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                  className={clsx(
                    "absolute bg-white/95 backdrop-blur-sm p-1.5 sm:p-3 md:p-4 lg:p-5 rounded-lg sm:rounded-xl shadow-xl border border-gray-100 flex items-center gap-0.5 sm:gap-2 cursor-default z-10",
                    "max-w-[85px] sm:max-w-none z-[51]",
                    box.col
                      ? "w-[85px] sm:w-[90px] md:w-[120px] lg:w-[140px] xl:w-auto"
                      : "min-w-[95px] sm:min-w-[97px] md:min-w-[100px] lg:min-w-[120px]",
                    box.align === "left" && "!items-end text-left",
                    box.align === "right" && "!items-start text-right",
                    box.col ? "flex-col justify-center" : "flex-row"
                  )}
                  style={{
                    top: boxTop,
                    left: boxLeft,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {box.icon && (
                    <div
                      className={clsx(
                        "flex items-center justify-center rounded-lg sm:rounded-xl relative",
                        box.col
                          ? "size-14 sm:size-16 md:size-20"
                          : "bg-mySecondary p-0 px-0.5 sm:p-0.5 md:p-2 size-8 sm:size-12"
                      )}
                    >
                      {/* Check if icon is a URL or an emoji */}
                      {box.icon.startsWith("/") ||
                      box.icon.startsWith("http") ? (
                        <Image
                          src={box.icon}
                          alt={box.text}
                          width={box.col ? 56 : 24}
                          height={box.col ? 56 : 24}
                          className="object-contain sm:w-full sm:h-full"
                          sizes={box.col ? "56px" : "24px"}
                        />
                      ) : (
                        <span className="text-2xl sm:text-3xl md:text-4xl">
                          {box.icon}
                        </span>
                      )}
                    </div>
                  )}
                  <div className={clsx(box.col && "text-center")}>
                    <span className="text-mySecondary font-bold text-sm sm:text-lg md:text-xl lg:text-2xl">
                      {box.number}
                    </span>
                    <p className="text-gray-800 font-medium text-[10px] sm:text-xs md:text-sm lg:whitespace-nowrap break-words sm:whitespace-nowrap">
                      {box.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* دکوراسیون‌ها */}
            <>
              {/* خط */}
              <div className="absolute flex items-center z-50 -top-3 -right-3 lg:-top-[50px] lg:-right-[70px]">
                <div className="flex items-center justify-center rounded-xl relative w-[110px] md:w-[180px] lg:w-[220px] aspect-[200/140]">
                  <Image
                    src={"/images/utiles/decor1.svg"}
                    alt={"decor"}
                    fill
                    className="object-cover scale-x-[-1]"
                    sizes="(max-width: 768px) 140px, (max-width: 1024px) 180px, 220px"
                  />
                </div>
              </div>
              {/* دایره کوچک */}
              <div className="absolute flex items-center z-50 bottom-5 sm:bottom-8 md:bottom-12 lg:bottom-[50px] right-1 sm:right-2 md:right-[10px]">
                <div className="flex items-center justify-center rounded-xl relative size-[28px] sm:size-[35px] md:size-[42px]">
                  <Image
                    src={"/images/utiles/ring3.svg"}
                    alt={"decor"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 28px, (max-width: 768px) 35px, 42px"
                  />
                </div>
              </div>
              {/* دایره بزرگ */}
              <div className="absolute flex items-center z-[9] bottom-0 md:bottom-24 lg:bottom-[120px] -left-0 md:-left-10 lg:-left-12">
                <div className="flex items-center justify-center rounded-xl relative size-[60px] md:size-[70px] lg:size-[82px]">
                  <Image
                    src={"/images/utiles/ring2.svg"}
                    alt={"decor"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 60px, (max-width: 1024px) 70px, 82px"
                  />
                </div>
              </div>
            </>
          </div>
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
              <p className="text-gray-600 mt-1 sm:mt-2 font-medium text-xs sm:text-sm md:text-base lg:text-lg text-center">
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
