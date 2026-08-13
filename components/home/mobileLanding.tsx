"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

type SlideData = {
  src: string;
  title: string;
  text: string;
};

type MobileLandingProps = {
  slides?: SlideData[];
};

const MobileLanding = ({ slides }: MobileLandingProps) => {
  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full bg-[#0A100E]">
      <SlidesSwiperSection slides={slides} />
    </div>
  );
};

export default MobileLanding;

const SlidesSwiperSection = ({ slides }: { slides: SlideData[] }) => {
  return (
    <section className="relative w-full overflow-x-hidden bg-gradient-to-b from-background via-card to-background px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            خدمات ویژه پیشرو
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            راهکارهای حرفه‌ای برای موفقیت شما
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <Swiper
            effect="cards"
            grabCursor
            modules={[EffectCards, Autoplay, Pagination]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            className="!pb-16"
            style={
              {
                "--swiper-pagination-color": "#B8913A",
                "--swiper-pagination-bullet-inactive-color": "#5A615C",
                "--swiper-pagination-bullet-inactive-opacity": "0.45",
              } as React.CSSProperties
            }
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-border/10 bg-gradient-to-br from-card to-background shadow-2xl">
                  <div className="relative h-56 w-full bg-[#121a17]">
                    <Image
                      src={slide.src}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 640px"
                      className="object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 space-y-3 p-6">
                    <h3 className="text-2xl font-bold leading-tight text-foreground">
                      {slide.title}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {slide.text}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};
