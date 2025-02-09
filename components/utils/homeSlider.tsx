"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import { homeSliderData } from "@/public/data";
import "@/app/styles/swiper.css";

// Import Swiper styles (if not imported in a global CSS file)
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HomeSlider = () => {
  return (
    // Outer container with group to manage hover effects for navigation buttons
    <div className="relative w-full h-[500px] overflow-hidden group transition">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-full"
      >
        {homeSliderData.map((slide, index) => (
          <SwiperSlide key={index}>
            {/* Background image for the slide */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black opacity-30"></div>
            {/* Content container positioned on the right center */}
            <div className="absolute inset-0 flex items-center justify-start pr-16">
              <div className="text-right">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {slide.text}
                </h2>
                <Link href={slide.linkUrl}>
                  <div className="inline-block px-6 py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition">
                    {slide.linkText}
                  </div>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation arrows appear on hover */}
      <div className="absolute right-10 bottom-10 flex w-28 items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition">
        <button className="custom-nav-button swiper-button-prev size-10 bg-white text-black rounded-full hover:bg-gray-200 transition flex justify-center items-center">
          <div className="size-4">
            <BsChevronRight className="-mr-0.5" />
          </div>
        </button>
        <button className="custom-nav-button swiper-button-next size-10 bg-white text-black rounded-full hover:bg-gray-200 transition flex justify-center items-center">
          <div className="size-4">
            <BsChevronLeft className="mr-0.5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default HomeSlider;
