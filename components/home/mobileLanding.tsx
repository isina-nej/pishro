"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards, Pagination } from "swiper/modules";
import { ArrowLeft, Sparkles } from "lucide-react";

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
  mainHeroTitle?: string;
  mainHeroSubtitle?: string;
  mainHeroCta1Link?: string;
  heroVideoUrl?: string;
  overlayTexts?: string[];
  slides?: SlideData[];
};

// =================================================
//             کامپوننت اصلی MobileLanding
// =================================================
const MobileLanding = ({
  mainHeroTitle,
  mainHeroSubtitle,
  mainHeroCta1Link,
  heroVideoUrl,
  overlayTexts,
  slides,
}: MobileLandingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative w-full bg-[#0A100E]">
      {/* Hero Section */}
      <HeroSection
        title={mainHeroTitle}
        subtitle={mainHeroSubtitle}
        ctaLink={mainHeroCta1Link}
        videoUrl={heroVideoUrl}
        videoLoaded={videoLoaded}
        setVideoLoaded={setVideoLoaded}
        opacity={opacity}
        scale={scale}
      />

      {/* Feature Cards Section */}
      <FeatureCardsSection overlayTexts={overlayTexts} />

      {/* Slides Swiper Section */}
      {slides && slides.length > 0 && <SlidesSwiperSection slides={slides} />}
    </div>
  );
};

export default MobileLanding;

// =================================================
//                 Hero Section
// =================================================
const HeroSection = ({
  title,
  subtitle,
  ctaLink,
  videoUrl,
  videoLoaded,
  setVideoLoaded,
  opacity,
  scale,
}: {
  title?: string;
  subtitle?: string;
  ctaLink?: string;
  videoUrl?: string;
  videoLoaded: boolean;
  setVideoLoaded: (loaded: boolean) => void;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}) => {
  return (
    <motion.section
      style={{ opacity, scale }}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {!videoLoaded && (
          <div className="absolute inset-0 bg-gradient-to-b from-mySecondary/30 via-myPrimary/20 to-background animate-pulse" />
        )}
        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl || "/videos/aboutUs.webm"} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-start justify-end px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full rounded-[2rem] border border-white/15 bg-[#0F2A1F]/72 p-6 shadow-2xl backdrop-blur-2xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4B06A]/35 bg-black/20 px-4 py-2 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#D4B06A]" />
            <span className="home-on-dark text-sm font-medium">
              پیشرو در مسیر موفقیت شما
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="home-on-dark text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            {title || "پیشرو بزرگترین مؤسسه سرمایه‌ گذاری در ایران"}
          </h1>

          {/* Description */}
          <p className="home-on-dark-muted text-base sm:text-lg leading-relaxed mb-6 max-w-lg">
            آموزش تخصصی بورس، بازارهای مالی و سرمایه‌گذاری از صفر تا صد
          </p>

          {/* CTA Button */}
          <motion.a
            href={ctaLink || "/business-consulting"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-full bg-[#FBF9F5] px-8 py-4 font-bold text-[#0B3D2E] shadow-xl transition-all hover:bg-[#1A6B45] hover:text-white"
          >
            <span>{subtitle || "شروع مسیر موفقیت"}</span>
            <ArrowLeft className="w-5 h-5" />
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-border/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-card dark:bg-cardBg rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

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
      <div className="max-w-4xl mx-auto space-y-6">
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
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-card/5 to-transparent rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border/20 bg-card/10">
                  <span className="text-foreground text-sm font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-foreground text-lg sm:text-xl font-bold leading-relaxed flex-1">
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
    <section className="relative w-full bg-gradient-to-b from-background via-card to-background py-20 px-6 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-foreground text-3xl sm:text-4xl font-extrabold mb-3">
            خدمات ویژه پیشرو
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            راهکارهای حرفه‌ای برای موفقیت شما
          </p>
        </motion.div>

        {/* Swiper */}
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
                <div className="relative w-full h-[420px] bg-gradient-to-br from-card to-background rounded-3xl overflow-hidden shadow-2xl border border-border/10">
                  {/* Image */}
                  <div className="relative w-full h-56 bg-[#121a17]">
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

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                    <h3 className="text-foreground text-2xl font-bold leading-tight">
                      {slide.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
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
