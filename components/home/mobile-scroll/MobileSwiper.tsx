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
    <section className="relative w-full h-screen overflow-hidden mt-10">
      <div className="container-md px-6 mx-auto h-full flex flex-col justify-between py-8">
        <div className="relative z-30 flex flex-col gap-3 text-center md:text-right mb-6">
          <h4 className="text-4xl font-extrabold sm:text-5xl">سامانه پیشرو</h4>
          <p className="text-sm text-gray-500 leading-6">
            سامانه <span className="text-myPrimary">پیشرو</span>، مشاور و همراه
            مالی شما در مسیر پیشرفت
          </p>
        </div>

        <Swiper
          modules={[Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="relative z-10 flex-1 !pb-16 !w-full"
          style={
            {
              "--swiper-pagination-bottom": "16px",
              width: "100%",
            } as CSSProperties
          }
        >
          {steps.map((step) => (
            <SwiperSlide
              key={step.id}
              className="!h-full !w-full overflow-hidden"
            >
              <div className="relative size-full rounded-[28px] bg-mySecondary p-6">
                <div className="w-full text-center px-4 mt-6 mb-6">
                  <h6 className="text-2xl font-extrabold leading-9 text-gray-100">
                    {step.text}
                  </h6>
                </div>

                <div className="absolute -bottom-[100px] right-0 flex w-full flex-col items-center justify-center">
                  <div className="relative w-full max-w-[270px] aspect-[500/960]">
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
