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
    <section className="h-screen relative overflow-hidden flex flex-col justify-between">
      {/* 🔹 بخش بالا */}
      <div className="container-xl flex items-center justify-between mt-28">
        {/* 🟢 سمت راست */}
        <div className="w-1/2 space-y-6 z-10">
          <h4 className="text-6xl font-extrabold text-mySecondary leading-tight">
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

          <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
            {description}
          </p>

          {/* 🔘 دکمه‌ها */}
          <div className="flex gap-4 pt-4">
            <button className="px-6 py-3 bg-mySecondary text-white font-semibold rounded-xl shadow-md hover:bg-blue-950 transition">
              {button1}
            </button>
            <button className="px-6 py-3 border border-mySecondary text-mySecondary font-semibold rounded-xl hover:bg-[#DCFCE7] transition">
              {button2}
            </button>
          </div>

          {/* 🌟 ویژگی‌ها */}
          {features.length > 0 && (
            <div className="flex gap-8 pt-8 flex-wrap">
              {features.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.icon}
                  <p className="text-gray-700 font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🟣 سمت چپ */}
        <div className="w-1/2 flex justify-end items-center relative">
          <div className="size-[495px] rounded-full bg-emerald-500 flex items-center justify-center relative shadow-lg">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain rounded-full"
            />

            {/* 🟩 باکس‌های شناور */}
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
                  "absolute bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-xl border border-gray-100 flex items-center gap-2 cursor-default",
                  box.align === "left" && "!items-end text-left",
                  box.align === "right" && "!items-start text-right",
                  box.col ? "flex-col justify-center" : "flex-row"
                )}
                style={{
                  top: box.top || "50%",
                  left: box.left || "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className={clsx(
                    "flex items-center justify-center rounded-xl relative",
                    box.col ? "size-20" : "bg-mySecondary p-2 size-12"
                  )}
                >
                  <Image
                    src={box.imgSrc}
                    alt={box.text}
                    width={box.col ? 80 : 30}
                    height={box.col ? 80 : 30}
                    className="object-contain"
                  />
                </div>
                <div className={clsx(box.col && "text-center")}>
                  <span className="text-mySecondary font-bold text-2xl">
                    {box.number}
                  </span>
                  <p className="text-gray-800 font-medium whitespace-nowrap text-sm">
                    {box.text}
                  </p>
                </div>
              </motion.div>
            ))}
            {/* decors */}
            <>
              {/* line */}
              <div
                className={clsx("absolute flex items-center z-50")}
                style={{
                  top: "-50px",
                  right: "-70px",
                }}
              >
                <div
                  className={clsx(
                    "flex items-center justify-center rounded-xl relative w-[220px] aspect-[200/140]"
                  )}
                >
                  <Image
                    src={"/images/utiles/decor1.svg"}
                    alt={"decor"}
                    fill
                    className="object-cover scale-x-[-1]"
                  />
                </div>
              </div>
              {/* small circle */}
              <div
                className={clsx("absolute flex items-center z-50")}
                style={{
                  bottom: "50px",
                  right: "10px",
                }}
              >
                <div
                  className={clsx(
                    "flex items-center justify-center rounded-xl relative size-[42px]"
                  )}
                >
                  <Image
                    src={"/images/utiles/ring3.svg"}
                    alt={"decor"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* big circle */}
              <div
                className={clsx("absolute flex items-center z-50")}
                style={{
                  bottom: "120px",
                  left: "-80px",
                }}
              >
                <div
                  className={clsx(
                    "flex items-center justify-center rounded-xl relative size-[82px]"
                  )}
                >
                  <Image
                    src={"/images/utiles/ring2.svg"}
                    alt={"decor"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </>
          </div>
        </div>
      </div>

      {/* 🔻 آمار پایین */}
      {stats.length > 0 && (
        <div className="container-xl flex justify-around items-center py-8">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <span className="text-5xl font-extrabold text-mySecondary">
                {isClient ? (
                  <CountUp start={0} end={item.number} duration={2.5} />
                ) : (
                  0
                )}
                {item.suffix}
              </span>
              <p className="text-gray-600 mt-2 font-medium text-lg">
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
