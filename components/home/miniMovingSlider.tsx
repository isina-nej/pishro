"use client";

import { useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import { Swiper as SwiperType } from "swiper/types";

interface MiniMovingSliderProps {
  isVisible: boolean;
  data: string[];
  baseSpeed?: number;
}

const MINI_SIZES =
  "(max-width: 640px) 55vw, (max-width: 1024px) 35vw, 24vw";

const MiniMovingSlider = ({
  isVisible,
  data,
  baseSpeed = 8000,
}: MiniMovingSliderProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isHovered, setIsHovered] = useState<number | null>(null);

  // Enough slides for seamless loop without exploding DOM for long CMS lists
  const loopSlides = useMemo(() => {
    if (!data.length) return [];
    if (data.length >= 8) return data;
    return [...data, ...data];
  }, [data]);

  const handleMouseEnter = (index: number) => {
    setIsHovered(index);
  };

  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 100,
      }}
      transition={{
        duration: 1,
        ease: "easeOut",
      }}
      className="relative w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[212px] flex items-center justify-center overflow-hidden"
    >
      {/* Defer Swiper + image decode until the album zoom finishes */}
      {isVisible ? (
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1.5}
          loop={loopSlides.length >= 4}
          allowTouchMove={false}
          spaceBetween={12}
          centeredSlides={false}
          speed={baseSpeed}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2.5,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 3.8,
              spaceBetween: 20,
            },
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="w-full h-full"
          wrapperClass="swiper-wrapper !ease-linear"
        >
          {loopSlides.map((src, i) => (
            <SwiperSlide key={`${src}-${i}`} className="relative w-full h-full">
              <div
                className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#121a17] shadow-lg"
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  src={src}
                  alt={`mini-slide-${i + 1}`}
                  fill
                  sizes={MINI_SIZES}
                  className="object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    opacity: isHovered === i ? 1 : 0,
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
    </motion.div>
  );
};

export default MiniMovingSlider;
