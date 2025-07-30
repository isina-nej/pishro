"use client";

import { StarIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { aboutItCardsData } from "@/public/data";

const AboutIt = () => {
  return (
    <div className="container-xl mb-20 -mt-24 z-30 relative">
      <div className="flex items-center mb-8">
        <StarIcon className="size-8 text-white ml-3 mb-2" />
        <h4 className="font-bold text-2xl text-gray-50">
          آنچه برای شروع نیاز دارید
        </h4>
      </div>

      <Swiper
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
            <HoverCard {...card} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AboutIt;

// HoverCard component
interface HoverCardProps {
  title: string;
  description: string;
}

const HoverCard = ({ title, description }: HoverCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "rounded-xl p-6 h-[300px] text-white transition-all duration-300 ease-in-out shadow-lg cursor-pointer group relative overflow-hidden",
        `bg-gradient-to-br from-[#214254] to-[#3a6073]`
      )}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Dark overlay after hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 0.4 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black z-15 pointer-events-none"
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center text-center px-4 z-10"
      >
        <h2 className="text-2xl font-bold">{title}</h2>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: hovered ? 1 : 0,
          y: hovered ? 0 : 20,
        }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 z-20 p-6 text-base flex items-center justify-center text-center leading-relaxed"
      >
        {description}
      </motion.div>
    </motion.div>
  );
};
