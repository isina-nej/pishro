"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";

import "swiper/css";
import "swiper/css/pagination";

import RatingStars from "./RatingStars";
import LikeDislike from "./LikeDislike";

type Comment = {
  id: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  rating: number;
  content: string;
  date: string;
  verified: boolean;
  likes: number;
};

interface CommentSliderProps {
  comments: Comment[];
  title?: string;
}

const CommentsSlider = ({
  comments,
  title = "نظرات دوره آموزان",
}: CommentSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      className="container-xl flex items-center justify-center mt-20 sm:mt-24 md:mt-28 lg:mt-32"
      aria-label="نظرات کاربران"
    >
      <div className="relative w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 md:mb-16 lg:mb-20 text-center">
          {title}
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
            {comments.map((comment, idx) => {
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
                      {comment.userName}
                    </p>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center justify-start w-full">
                        <Image
                          src={comment.userAvatar}
                          alt={comment.userName}
                          width={48}
                          height={48}
                          className="rounded-full ml-2"
                        />
                        <div>
                          <p className="font-bold text-[#353535] text-xs sm:text-base">
                            {comment.userRole}
                          </p>
                          <p className="text-[11px] sm:text-xs font-bold text-[#8e8e8e]">
                            {comment.date}
                          </p>
                        </div>
                      </div>
                      <div>
                        <RatingStars rating={comment.rating || 3} />
                        <LikeDislike likes={comment.likes} />
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
        <div className="absolute top-0 lg:top-12 right-0 sm:right-4 md:right-8 hidden sm:block">
          <div className="relative w-[80px] sm:w-[120px] md:w-[180px] h-[45px] sm:h-[65px] md:h-[100px]">
            <Image
              src={"/icons/circle-arrow-left.svg"}
              alt="پیکان چپ"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, (max-width: 768px) 120px, 180px"
            />
          </div>
        </div>
        <div className="absolute -bottom-2 sm:-bottom-6 md:-bottom-10 left-0 sm:left-4 md:left-8 hidden sm:block">
          <div className="relative w-[80px] sm:w-[120px] md:w-[180px] h-[45px] sm:h-[65px] md:h-[100px]">
            <Image
              src={"/icons/circle-arrow-right.svg"}
              alt="پیکان راست"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, (max-width: 768px) 120px, 180px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommentsSlider;
