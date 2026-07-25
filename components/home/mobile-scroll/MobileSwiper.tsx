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
    <section className="relative mt-4 min-h-screen w-full overflow-hidden pb-20">
      <div className="container-md mx-auto flex h-full flex-col justify-start px-6 py-8">
        <div className="relative z-30 mb-8 flex flex-col gap-2 text-center md:text-right">
          <span className="mx-auto mb-2 rounded-full border border-[#214254]/10 bg-white/55 px-4 py-2 text-[11px] font-bold text-[#214254] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-cyan-100">تجربه یکپارچه مالی</span>
          <h4 className="text-2xl font-black tracking-tight text-[#112b3a] dark:text-white sm:text-3xl md:text-4xl">سامانه پیشرو</h4>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-textSecondary leading-5 sm:leading-6">
            سامانه <span className="text-myPrimary">پیشرو</span>، مشاور و همراه
            مالی شما در مسیر پیشرفت
          </p>
        </div>

        <Swiper
          modules={[Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          slidesPerGroup={1}
          pagination={{ clickable: true }}
          allowTouchMove
          simulateTouch
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
              <div className="home-glass-panel relative min-h-[600px] w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#12344b]/95 via-[#183c53]/90 to-[#0d2435]/95 p-4 pb-[280px] pt-6 sm:p-6 sm:pb-[320px]">
                <div className="w-full text-center px-2 sm:px-4 mt-4 mb-4">
                  <h6 className="text-lg sm:text-xl md:text-2xl font-extrabold leading-7 sm:leading-8 md:leading-9 text-gray-100">
                    {step.text}
                  </h6>
                </div>

                <div className="w-full flex justify-center mt-3 mb-4 sm:mb-6">
                  {step.link ? (
                    <a
                      href={step.link}
                      className="inline-block rounded-full bg-white px-6 py-2 text-xs font-bold text-[#112b3a] shadow-xl transition hover:bg-cyan-50 sm:px-8 sm:py-2.5 sm:text-sm"
                    >
                      اطلاعات بیشتر
                    </a>
                  ) : (
                    <button className="cursor-default rounded-full bg-white px-6 py-2 text-xs font-bold text-[#112b3a] shadow-xl sm:px-8 sm:py-2.5 sm:text-sm">
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
