"use client";

import { type CSSProperties } from "react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { mobileScrollerSteps, type MobileScrollerStep } from "./data";

import "swiper/css";
import "swiper/css/pagination";

type MobileSwiperProps = {
  steps?: MobileScrollerStep[];
};

export function MobileSwiper({ steps: providedSteps }: MobileSwiperProps = {}) {
  const steps =
    providedSteps && providedSteps.length > 0
      ? providedSteps
      : mobileScrollerSteps;

  return (
    <section className="relative w-full min-h-screen overflow-hidden mt-10 pb-20">
      <div className="container-md px-6 mx-auto h-full flex flex-col justify-start py-8">
        <div className="relative z-30 flex flex-col gap-2 text-center md:text-right mb-8">
          <h4 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">سامانه پیشرو</h4>
          <p className="text-xs sm:text-sm text-gray-500 leading-5 sm:leading-6">
            سامانه <span className="text-myPrimary">پیشرو</span>، مشاور و همراه
            مالی شما در مسیر پیشرفت
          </p>
        </div>

        <Swiper
          modules={[Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="relative z-10 !pb-16 !w-full"
          style={
            {
              "--swiper-pagination-bottom": "16px",
              width: "100%",
              height: "auto",
              minHeight: "600px",
            } as CSSProperties
          }
        >
          {steps.map((step) => (
            <SwiperSlide
              key={step.id}
              className="!h-auto !w-full overflow-visible"
            >
              <div className="relative w-full min-h-[600px] rounded-[28px] bg-mySecondary p-4 sm:p-6 pt-6 pb-[280px] sm:pb-[320px]">
                <div className="w-full text-center px-2 sm:px-4 mt-4 mb-4">
                  <h6 className="text-lg sm:text-xl md:text-2xl font-extrabold leading-7 sm:leading-8 md:leading-9 text-gray-100">
                    {step.text}
                  </h6>
                </div>

                <div className="w-full flex justify-center mt-3 mb-4 sm:mb-6">
                  {step.link ? (
                    <a
                      href={step.link}
                      className="inline-block px-6 sm:px-8 py-2 sm:py-2.5 bg-white/10 text-white rounded-full shadow-md hover:bg-white/5 transition text-xs sm:text-sm"
                    >
                      اطلاعات بیشتر
                    </a>
                  ) : (
                    <button className="px-6 sm:px-8 py-2 sm:py-2.5 bg-white/10 text-white rounded-full shadow-md hover:bg-white/5 transition text-xs sm:text-sm cursor-default">
                      اطلاعات بیشتر
                    </button>
                  )}
                </div>

                <div className="absolute -bottom-[80px] sm:-bottom-[100px] right-0 flex w-full flex-col items-center justify-center">
                  <div className="relative w-full max-w-[240px] sm:max-w-[270px] aspect-[500/960]">
                    {/* mobile frame (background layer) */}
                    <Image
                      src={
                        step.imgCover ||
                        "/images/home/mobile-scroll/mobile.webp"
                      }
                      alt="mobile frame"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 300px"
                    />
                    {/* mobile screen content (foreground layer) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-[100%] h-[100%]">
                        <Image
                          src={step.img}
                          alt="mobile screen content"
                          fill
                          className="object-contain"
                          sizes="(max-width: 1024px) 300px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
