"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import clsx from "clsx";
import { LuTarget, LuBookOpen, LuUsers } from "react-icons/lu";

const CountUp = dynamic(() => import("react-countup"), { ssr: false });

interface BoxData {
  text: string;
  number: string;
  imgSrc: string;
  top?: string;
  left?: string;
  align?: "left" | "right" | "center";
  col?: boolean;
}

interface StatData {
  number: number;
  suffix?: string;
  label: string;
}

interface Landing3Props {
  data: {
    title: string;
    mainWord?: string;
    description: string;
    button1: string;
    button2: string;
    image: string;
    boxes?: BoxData[];
    stats?: StatData[];
    features?: { icon?: React.ReactNode; text: string }[];
  };
}

const Landing3 = ({ data }: Landing3Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ fallback برای داده‌های اختیاری
  const {
    title,
    description,
    button1,
    button2,
    image,
    boxes = [],
    stats = [],
    features = [
      {
        icon: <LuTarget className="text-myPrimary text-3xl" />,
        text: "نقشه راه کامل از صفر",
      },
      {
        icon: <LuBookOpen className="text-myPrimary text-3xl" />,
        text: "کامل‌ترین محتوا",
      },
      {
        icon: <LuUsers className="text-myPrimary text-3xl" />,
        text: "اجتماع بزرگ دانش‌آموزان",
      },
    ],
  } = data;

  return (
    <section className="min-h-screen relative overflow-hidden flex flex-col justify-between pt-6 sm:pt-8 md:pt-8 lg:pt-0 pb-8 lg:pb-0">
      {/* 🔹 بخش بالا */}
      <div className="container-xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 mt-12 sm:mt-16 md:mt-20 lg:mt-24 px-4 sm:px-6 md:px-8">
        {/* 🟢 سمت راست */}
        <div className="w-full lg:w-1/2 space-y-5 sm:space-y-6 md:space-y-6 z-10 order-2 lg:order-1">
          <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-mySecondary leading-tight mt-2 md:mt-0">
            {title.includes("پیشرو") ? (
              <>
                {title.split("پیشرو")[0]}
                <span className="text-myPrimary">پیشرو</span>
                {title.split("پیشرو")[1]}
              </>
            ) : (
              <>{title}</>
            )}
          </h4>

          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
            {description}
          </p>

          {/* 🔘 دکمه‌ها */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-5">
            <button
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-mySecondary text-white border border-mySecondary 
                font-semibold rounded-xl shadow-md transition-transform duration-300 ease-in-out 
                text-sm sm:text-base hover:scale-105 hover:-rotate-1 active:scale-95
              "
            >
              {button1}
            </button>

            <button
              className="px-5 sm:px-6 py-2.5 sm:py-3 border border-mySecondary text-mySecondary 
    font-semibold rounded-xl transition-transform duration-300 ease-in-out 
    text-sm sm:text-base hover:scale-105 hover:rotate-1 active:scale-95"
            >
              {button2}
            </button>
          </div>

          {/* 🌟 ویژگی‌ها */}
          {features.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8 pt-3 sm:pt-4 md:pt-6 lg:pt-8 flex-wrap">
              {features.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 sm:gap-3 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none px-3 py-2.5 sm:px-0 sm:py-0"
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-gray-700 font-medium text-sm sm:text-base">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🟣 سمت چپ */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center relative order-1 lg:order-2">
          {/* container-md برای باکس‌های شناور - برای موبایل بزرگتر */}
          <div className="relative size-[100%] sm:size-[380px] md:size-[450px] lg:size-[520px] flex items-center justify-center overflow-visible">
            {/* تصویر اصلی */}
            <div className="size-[320px] sm:size-[350px] md:size-[420px] lg:size-[495px] rounded-full bg-emerald-500 flex items-center justify-center relative shadow-lg">
              <Image
                src={image}
                alt={title}
                fill
                className="object-contain rounded-full"
              />
            </div>

            {/* 🟩 باکس‌های شناور - در container-md بزرگتر قرار می‌گیرند تا از تصویر خارج نشوند */}
            {boxes.map((box, i) => (
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
                  // برای موبایل: باکس‌ها را کوچکتر و در لبه‌ها قرار بده تا از کادر خارج نشوند
                  "max-w-[85px] sm:max-w-none",
                  box.col
                    ? "w-[85px] sm:w-[90px] md:w-[120px] lg:w-[140px] xl:w-auto"
                    : "min-w-[95px] sm:min-w-[97px] md:min-w-[100px] lg:min-w-[120px]",
                  box.align === "left" && "!items-end text-left",
                  box.align === "right" && "!items-start text-right",
                  box.col ? "flex-col justify-center" : "flex-row"
                )}
                style={{
                  // موقعیت اصلی باکس
                  top: box.top || "50%",
                  left: i !== 2 ? box.left || "50%" : "74%",
                  transform: "translate(-50%, -50%)",
                }}
                // برای موبایل: باکس‌های نزدیک به مرکز را با media query به سمت خارج می‌کشیم
                // از طریق className های responsive
              >
                <div
                  className={clsx(
                    "flex items-center justify-center rounded-lg sm:rounded-xl relative",
                    box.col
                      ? "size-14 sm:size-16 md:size-20"
                      : "bg-mySecondary p-0 px-0.5 sm:p-0.5 md:p-2 size-8 sm:size-12"
                  )}
                >
                  <Image
                    src={box.imgSrc}
                    alt={box.text}
                    width={box.col ? 56 : 24}
                    height={box.col ? 56 : 24}
                    className="object-contain sm:w-full sm:h-full"
                    sizes={box.col ? "56px" : "24px"}
                  />
                </div>
                <div className={clsx(box.col && "text-center")}>
                  <span className="text-mySecondary font-bold text-sm sm:text-lg md:text-xl lg:text-2xl">
                    {box.number}
                  </span>
                  <p className="text-gray-800 font-medium text-[10px] sm:text-xs md:text-sm lg:whitespace-nowrap break-words sm:whitespace-nowrap">
                    {box.text}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* decors - داخل container-md باکس‌ها */}
            <>
              {/* line */}
              <div
                className={clsx(
                  "absolute flex items-center z-50 -top-3 -right-3 lg:-top-[50px] lg:-right-[70px]"
                )}
              >
                <div
                  className={clsx(
                    "flex items-center justify-center rounded-xl relative w-[110px] md:w-[180px] lg:w-[220px] aspect-[200/140]"
                  )}
                >
                  <Image
                    src={"/images/utiles/decor1.svg"}
                    alt={"decor"}
                    fill
                    className="object-cover scale-x-[-1]"
                    sizes="(max-width: 768px) 140px, (max-width: 1024px) 180px, 220px"
                  />
                </div>
              </div>
              {/* small circle */}
              <div
                className={clsx(
                  "absolute flex items-center z-50 bottom-5 sm:bottom-8 md:bottom-12 lg:bottom-[50px] right-1 sm:right-2 md:right-[10px]"
                )}
              >
                <div
                  className={clsx(
                    "flex items-center justify-center rounded-xl relative size-[28px] sm:size-[35px] md:size-[42px]"
                  )}
                >
                  <Image
                    src={"/images/utiles/ring3.svg"}
                    alt={"decor"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 28px, (max-width: 768px) 35px, 42px"
                  />
                </div>
              </div>
              {/* big circle */}
              <div
                className={clsx(
                  "absolute flex items-center z-[9] bottom-0 md:bottom-24 lg:bottom-[120px] -left-0 md:-left-10 lg:-left-12"
                )}
              >
                <div
                  className={clsx(
                    "flex items-center justify-center rounded-xl relative size-[60px] md:size-[70px] lg:size-[82px]"
                  )}
                >
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

      {/* 🔻 آمار پایین */}
      {stats.length > 0 && (
        <div className="container-xl grid grid-cols-2 sm:flex sm:flex-row justify-around items-center pb-6 pt-2 sm:pb-8 sm:pt-4 gap-4 sm:gap-6 md:gap-4 px-4 sm:px-6 md:px-8">
          {stats.map((item, i) => (
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

export default Landing3;
