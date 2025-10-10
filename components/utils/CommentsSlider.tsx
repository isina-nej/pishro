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
    <section className="container-xl h-screen flex items-center justify-center">
      <div className="relative w-full">
        <h2 className="text-5xl font-bold mb-8 text-center">
          نظرات دوره‌آموزان
        </h2>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            className="!px-2"
            centeredSlides={true}
            slidesPerView={3}
            spaceBetween={0}
            loop={true}
            autoplay={{
              delay: 50000,
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
                  className={`px-2.5 py-6 !overflow-visible transition-transform duration-500 ease-in-out ${
                    isActive ? "scale-110 z-10" : "scale-90 opacity-90"
                  }`}
                >
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-200 py-8 px-5 flex flex-col items-center justify-between text-center h-[255px]">
                    <p className="text-[#8E8E8E] text-xs leading-5 font-bold mb-4">
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
                          <p className="font-bold text-[#353535]">
                            {comment.name}
                          </p>
                          <p className="text-xs font-bold text-[#8e8e8e]">
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

            <div className="custom-pagination-opinion h-3 flex justify-center gap-1.5 mt-6"></div>
          </Swiper>
        </div>

        {/* پیکان‌ها */}
        <div className="absolute top-0 right-8">
          <div className="relative w-[180px] h-[100px]">
            <Image
              src={"/icons/circle-arrow-left.svg"}
              alt="پیکان"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="absolute -bottom-10 left-8">
          <div className="relative w-[180px] h-[100px]">
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
