"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { stockMarketData } from "@/public/data";
import SliderCard from "@/components/stockMarket/sliderCard";

const Slider = () => {
  const items = stockMarketData; // لیست آیتم‌ها

  return (
    <div className="h-[300px] my-8 relative">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={3000}
        loop={true}
        slidesPerView={4}
        spaceBetween={30}
        centeredSlides={true}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            spaceBetween: 15,
          },
          640: {
            slidesPerView: 2.2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            {() => <SliderCard item={item} />}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
