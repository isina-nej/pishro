"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { landingData } from "@/public/data";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/pagination";

interface LandingProps {
  size?: "small" | "normal";
  darker?: boolean;
}

const Landing = ({ size = "normal", darker }: LandingProps) => {
  const pathname = usePathname();

  // دریافت داده مرتبط با مسیر جاری
  const data =
    landingData[pathname as keyof typeof landingData] || landingData["/"];

  const height = size === "small" ? 360 : 474;
  const width = 1521; // طبق طراحی

  return (
    <div
      className={cn("relative w-full", `h-[${height}px]`)}
      style={{ height: `${height}px` }}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-full"
      >
        {data.backgroundImage.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {/* Background image as Next.js <Image /> */}
              <Image
                src={imageUrl}
                alt={`landing slide ${index + 1}`}
                fill
                sizes="100vw"
                priority={index === 0} // Only the first image loads eagerly
                className="object-cover"
                placeholder="blur" // Optional: use blurDataURL if available
                blurDataURL="/images/placeholder.jpg" // Optional blur image
              />
              {/* Optional dark overlay */}
              {darker && (
                <div className="absolute inset-0 bg-black/30 z-10"></div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Landing;
