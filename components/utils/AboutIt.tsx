"use client";

import { StarIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import { cn } from "@/lib/utils";
import { aboutItCardsData } from "@/public/data";
import type { Swiper as SwiperClass } from "swiper/types";

const AboutIt = () => {
  const swiperRef = useRef<{ swiper: SwiperClass } | null>(null);

  const handleHover = (isHovering: boolean) => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    if (isHovering) {
      swiper.autoplay.stop();
    } else {
      swiper.autoplay.start();
    }
  };

  return (
    <div className="container-xl mb-20 -mt-24 z-30 relative">
      <div className="flex items-center mb-8">
        <StarIcon className="size-8 text-white ml-3 mb-2" />
        <h4 className="font-bold text-2xl text-gray-50">
          آنچه برای شروع نیاز دارید
        </h4>
      </div>

      <Swiper
        ref={swiperRef}
        slidesPerView={1.2}
        spaceBetween={16}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4.2 },
          1280: { slidesPerView: 5 },
        }}
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4500 }}
        pagination={{ clickable: true }}
        className="!pb-8"
      >
        {aboutItCardsData.map((card, index) => (
          <SwiperSlide key={index}>
            <HoverCard {...card} onHover={handleHover} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AboutIt;

interface HoverCardProps {
  title: string;
  description: string;
  onHover?: (isHovering: boolean) => void;
}

const HoverCard = ({ title, description, onHover }: HoverCardProps) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    onHover?.(false);
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "rounded-xl p-6 h-[300px] text-white transition-all duration-300 ease-in-out shadow-lg cursor-pointer group relative overflow-hidden",
        `bg-gradient-to-br from-[#214254] to-[#3a6073]`
      )}
    >
      {/* Dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 0.45 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black z-10"
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center text-center px-4 z-20"
      >
        <h2 className="text-2xl font-bold">{title}</h2>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: hovered ? 1 : 0,
          y: hovered ? 0 : 30,
        }}
        transition={{ duration: 0.4 }}
        className="absolute top-8 left-0 right-0 z-30 px-6 text-center flex flex-col items-center"
      >
        <p className="leading-relaxed text-sm md:text-base">{description}</p>
      </motion.div>

      {/* Fixed-position More button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{
          opacity: hovered ? 1 : 0,
          y: hovered ? 0 : 40,
        }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute bottom-6 left-0 right-0 z-30 flex justify-center"
      >
        <motion.button className="px-5 py-2 text-sm md:text-base rounded-full border border-white/70 bg-transparent text-white transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:text-white">
          مطالعه بیشتر
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
