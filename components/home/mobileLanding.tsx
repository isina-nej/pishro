"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

// =================================================
//                   Types
// =================================================
type SlideData = {
  src: string;
  title: string;
  text: string;
};

type MobileLandingProps = {
  overlayTexts?: string[];
  slides?: SlideData[];
};

// =================================================
//             کامپوننت اصلی MobileLanding
// =================================================
const MobileLanding = ({ overlayTexts, slides }: MobileLandingProps) => {
  return (
    <div className="relative w-full bg-[#0A100E]">
      {/* Opening video replaced by CoinsHeroSection in homeContent */}
      <FeatureCardsSection overlayTexts={overlayTexts} />
      {slides && slides.length > 0 && <SlidesSwiperSection slides={slides} />}
    </div>
  );
};

export default MobileLanding;

// =================================================
//           Feature Cards Section
// =================================================
const FeatureCardsSection = ({ overlayTexts }: { overlayTexts?: string[] }) => {
  const defaultTexts = [
    "پیشرو در مسیر سرمایه‌ گذاری هوشمند",
    "ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری، شما را مسیر رشد همراهی می‌کنیم.",
    "از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای همراهی در مسیر رشد سرمایه شما، همه پیشرو فراهم است.",
    "پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد پایدار و آینده‌ای روشن هستند.",
  ];

  const texts =
    overlayTexts && overlayTexts.length > 0 ? overlayTexts : defaultTexts;

  const gradients = [
    "from-primary/20 to-accent/20",
    "from-primary/20 to-primary/20",
    "from-premium/20 to-destructive/20",
    "from-destructive/20 to-destructive/20",
  ];

  return (
    <section className="relative w-full overflow-x-hidden bg-[#0A100E] px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        {texts.map((text, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-3xl border border-border/10 bg-gradient-to-br ${
              gradients[index % gradients.length]
            } p-6 shadow-2xl backdrop-blur-xl`}
          >
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br from-card/5 to-transparent blur-3xl" />

            <div className="relative z-10">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border/20 bg-card/10">
                  <span className="text-sm font-bold text-foreground">
                    {index + 1}
                  </span>
                </div>
                <h3 className="flex-1 text-lg font-bold leading-relaxed text-foreground sm:text-xl">
                  {text.includes("پیشرو") ? (
                    <>
                      {text.split("پیشرو")[0]}
                      <span className="text-myPrimary">پیشرو</span>
                      {text.split("پیشرو")[1]}
                    </>
                  ) : (
                    text
                  )}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// =================================================
//           Slides Swiper Section
// =================================================
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
