"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import Heading from "./heading";

import { homeCommentsData } from "@/public/data";

// Custom Navigation Buttons
const PrevButton = () => (
  <button className="custom-prev text-gray-600 hover:text-primary transition">
    <BsChevronRight size={24} />
  </button>
);

const NextButton = () => (
  <button className="custom-next text-gray-600 hover:text-primary transition">
    <BsChevronLeft size={24} />
  </button>
);

const CommentsSlider = () => {
  return (
    <section className="container my-16 relative">
      <Heading className="text-2xl font-bold mb-8 text-center">
        نظرات کاربران
      </Heading>
      <div className="relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={4}
          spaceBetween={20}
          loop={true}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {homeCommentsData.map((comment) => (
            <SwiperSlide className="pb-8" key={comment.id}>
              <div className="bg-white rounded-mb shadow-lg p-4 flex flex-col items-center text-center h-full">
                <Image
                  src={comment.avatar}
                  alt={comment.name}
                  width={60}
                  height={60}
                  className="rounded-full mb-3"
                />
                <h3 className="font-semibold">{comment.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{comment.position}</p>
                <p className="text-gray-700 text-sm my-4">{comment.comment}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 right-8 z-10">
        <PrevButton />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-8 z-10">
        <NextButton />
      </div>
    </section>
  );
};

export default CommentsSlider;
