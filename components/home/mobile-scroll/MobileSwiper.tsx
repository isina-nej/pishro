"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { type CSSProperties, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { mobileScrollerSteps } from "./data";

import "swiper/css";
import "swiper/css/pagination";

const cardVariants = {
  initial: { opacity: 0, scale: 0.9, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
};

export function MobileSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full h-screen overflow-hidden mt-10">
      <div className="container px-6 mx-auto h-full flex flex-col justify-between py-8">
        <div className="flex flex-col gap-3 text-center md:text-right mb-6">
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
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onAfterInit={(swiper) => setActiveIndex(swiper.realIndex)}
          className="relative flex-1 !pb-16 !w-full"
          style={
            {
              "--swiper-pagination-bottom": "16px",
              width: "100%",
            } as CSSProperties
          }
        >
          {mobileScrollerSteps.map((step, stepIndex) => (
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
                  <div className="relative w-full max-w-[270px] aspect-[500/960] ">
                    <Image
                      src={step.img}
                      alt="mobile screen"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 300px"
                    />

                    {activeIndex === stepIndex && (
                      <AnimatePresence initial={false}>
                        {step.cards.map((card, cardIndex) => {
                          const Icon = card.icon;
                          return (
                            <motion.div
                              key={card.id}
                              variants={cardVariants}
                              initial="initial"
                              animate="animate"
                              exit="initial"
                              transition={{
                                duration: 0.45,
                                delay: cardIndex * 0.12,
                                ease: "easeOut",
                              }}
                              style={{
                                top: card.top,
                                left: card.left,
                                right: card.right,
                                transform: "translate(-50%, -50%)",
                              }}
                              className={clsx(
                                "absolute w-[96px] h-[96px] p-3 rounded-2xl border backdrop-blur-xl",
                                "bg-gradient-to-br",
                                step.gradient,
                                "shadow-[0_0_15px_-4px_rgba(255,255,255,0.25)] flex flex-col items-center justify-center text-center"
                              )}
                            >
                              <Icon className="w-5 h-5 mb-1.5 text-black/90" />
                              <h5 className="text-sm font-semibold text-black">
                                {card.title}
                              </h5>
                              <p className="text-[11px] text-gray-900/90 mt-0.5">
                                {card.desc}
                              </p>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    )}
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
