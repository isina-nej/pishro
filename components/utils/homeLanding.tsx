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

const HomeLanding = ({ size = "normal", darker }: LandingProps) => {
  const pathname = usePathname();

  // get related data
  const data =
    landingData[pathname as keyof typeof landingData] || landingData["/"];

  return (
    <div
      className={cn(
        "relative w-full",
        size === "small"
          ? "h-[360px] sm:h-[280px] xs:h-[220px]"
          : "h-[474px] sm:h-[360px] xs:h-[280px]"
      )}
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
              {/* Background image */}
              <Image
                src={imageUrl}
                alt={`landing slide ${index + 1}`}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover object-center"
              />
              {/* Dark overlay */}
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

export default HomeLanding;
