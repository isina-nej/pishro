"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";

import "swiper/css";
import "swiper/css/pagination";

import { homeCommentsData } from "@/public/data";
import RatingStars from "./RatingStars";
import LikeDislike from "./LikeDislike";

const CommentsSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="container-xl flex items-center justify-center mt-40 md:mt-32 px-1 sm:px-6 md:px-10 lg:px-24">
      <div className="relative w-full">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-20 -mt-16 sm:mt-0 sm:mb-8 text-center">
          نظرات دوره‌آموزان
        </h2>

        <div className="relative">
          <Swiper
            id="comments-slider"
            modules={[Autoplay, Pagination]}
            className="!px-2"
            centeredSlides={true}
            slidesPerView={3}
            spaceBetween={0}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".custom-pagination-opinion",
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {homeCommentsData.map((comment, idx) => {
              const isActive = idx === activeIndex;
              return (
                <SwiperSlide
                  key={comment.id}
                  className={`px-1.5 sm:px-2.5 py-4 sm:py-6 !overflow-visible transition-transform duration-500 ease-in-out ${
                    isActive
                      ? "!scale-105 sm:!scale-110 z-10"
                      : "!scale-95 sm:!scale-90 opacity-90"
                  }`}
                >
                  <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 py-5 md:py-8 px-3 md:px-5 flex flex-col items-center justify-between text-center h-[220px] sm:h-[230px] md:h-[255px]">
                    <p className="text-[#8E8E8E] text-right text-[11px] sm:text-xs leading-5 font-bold mb-2 md:mb-4">
                      {comment.comment}
                    </p>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center justify-start w-full">
                        <Image
                          src={comment.avatar}
                          alt={comment.name}
                          width={48}
                          height={48}
                          className="rounded-full ml-2"
                        />
                        <div>
                          <p className="font-bold text-[#353535] text-xs sm:text-base">
                            {comment.name}
                          </p>
                          <p className="text-[11px] sm:text-xs font-bold text-[#8e8e8e]">
                            {comment.position}
                          </p>
                        </div>
                      </div>
                      <div>
                        <RatingStars rating={4} />
                        <LikeDislike />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}

            <div className="custom-pagination-opinion h-3 flex justify-center gap-0.5 sm:gap-1.5 mt-4 md:mt-6"></div>
          </Swiper>
        </div>

        {/* پیکان‌ها */}
        <div className="absolute top-0 right-1 sm:right-8">
          <div className="relative w-[90px] sm:w-[180px] h-[50px] sm:h-[100px]">
            <Image
              src={"/icons/circle-arrow-left.svg"}
              alt="پیکان"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="absolute -bottom-4 sm:-bottom-10 left-1 sm:left-8">
          <div className="relative w-[90px] sm:w-[180px] h-[50px] sm:h-[100px]">
            <Image
              src={"/icons/circle-arrow-right.svg"}
              alt="پیکان"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommentsSlider;
