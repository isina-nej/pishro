"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const BikeSection = () => {
  // 🌀 متغیرهای اصلی برای موقعیت موس
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 🔄 حرکت نرم و طبیعی موس
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 15 });

  // 🎮 تابع تشخیص موقعیت موس
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    mouseX.set(x);
    mouseY.set(y);
  };

  // 🔁 افکت چرخش کلی برای پس‌زمینه
  const rotateX = useTransform(smoothY, (val) => val * 10);
  const rotateY = useTransform(smoothX, (val) => val * -10);

  // 🪶 داده‌های نوشته‌ها
  const texts = [
    { text: "آماده‌ای؟", top: "15%", left: "58%", delay: 0, depth: 1 },
    {
      text: "وقتشه که حرکت کنیم!",
      top: "22.5%",
      left: "20%",
      delay: 1,
      depth: 0.7,
    },
    { text: "بزن بریم 🚴‍♂️", top: "35%", left: "58%", delay: 2, depth: 0.4 },
  ];

  // ✅ برای هر نوشته، transformها رو اینجا صدا می‌زنیم (نه داخل map)
  const translateX1 = useTransform(smoothX, (v) => v * 60 * texts[0].depth);
  const translateY1 = useTransform(smoothY, (v) => v * 40 * texts[0].depth);

  const translateX2 = useTransform(smoothX, (v) => v * 60 * texts[1].depth);
  const translateY2 = useTransform(smoothY, (v) => v * 40 * texts[1].depth);

  const translateX3 = useTransform(smoothX, (v) => v * 60 * texts[2].depth);
  const translateY3 = useTransform(smoothY, (v) => v * 40 * texts[2].depth);

  const parallax = [
    { x: translateX1, y: translateY1 },
    { x: translateX2, y: translateY2 },
    { x: translateX3, y: translateY3 },
  ];

  return (
    <section
      className="container-xl mb-20 pt-20 cursor-default relative overflow-hidden h-screen"
      onMouseMove={handleMouseMove}
    >
      {/* محتوای اصلی */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full aspect-[1361/646] flex items-center justify-center overflow-hidden"
      >
        {/* تصویر دوچرخه */}
        <Image
          src="/images/home/bike.svg"
          fill
          alt="دوچرخه‌سوار"
          className="object-cover select-none"
          priority
        />

        {/* نوشته‌ها */}
        {texts.map((item, i) => (
          <motion.div
            key={i}
            style={{
              top: item.top,
              left: item.left,
              translateX: parallax[i].x,
              translateY: parallax[i].y,
            }}
            animate={{ scale: [1, 1.12, 1] }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
              delay: item.delay,
            }}
            className="absolute px-6 py-3 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 shadow-lg will-change-transform"
          >
            <p className="text-lg md:text-xl font-semibold text-gray-800 whitespace-nowrap">
              {item.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BikeSection;
