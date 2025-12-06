"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  MotionStyle,
} from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Swiper as SwiperType } from "swiper/types";
import clsx from "clsx";
import "swiper/css";
import MiniMovingSlider from "./miniMovingSlider";

/* ------------------------- 🖼️ Types ------------------------- */
type SlideData = {
  src: string;
  title: string;
  text: string;
};

const DEFAULT_SLIDES: SlideData[] = [
  {
    src: "/images/home/landing-slider/p01.webp",
    title: "سرمایه‌ گذاری هوشمند",
    text: "با راهکارهای نوین و تحلیل‌های دقیق، آینده مالی خود را تضمین کنید.",
  },
  {
    src: "/images/home/landing-slider/p02.webp",
    title: "آموزش‌های تخصصی",
    text: "یادگیری اصول بازارهای مالی با بهره‌گیری از تجربه بهترین اساتید.",
  },
  {
    src: "/images/home/landing-slider/p03.webp",
    title: "مشاوره حرفه‌ای",
    text: "ارائه مشاوره‌های اختصاصی برای بهینه‌سازی سبد سرمایه شما.",
  },
  {
    src: "/images/home/landing-slider/p04.webp",
    title: "رشد پایدار",
    text: "همراهی شما در مسیر رشد و توسعه کسب‌وکار با استراتژی‌های موثر.",
  },
];

/* ------------------------------------------------------------------ */
/* 🧠 Hook: Handles all scroll-based animations and scale transitions */
/* ------------------------------------------------------------------ */
const useImageZoomScroll = (
  parentRef: React.RefObject<HTMLElement | null>,
  sectionRef: React.RefObject<HTMLDivElement | null>
) => {
  const { scrollYProgress: parentScroll } = useScroll({
    target: parentRef,
    offset: ["end end", "end start"],
  });

  const { scrollYProgress: sectionScroll } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Stage 1: parent text fade out → zoom in
  const firstStageScale = useTransform(parentScroll, [0, 1], [1.8, 1.7]);
  // Stage 2: section scroll → zoom back to normal
  const secondStageScale = useTransform(sectionScroll, [0.645, 0.68], [1.7, 1]);

  // Combine two transitions dynamically
  const bgScale = useTransform([parentScroll, sectionScroll], ([p]) =>
    (p as number) < 1 ? firstStageScale.get() : secondStageScale.get()
  );

  // Derivative transforms
  const otherSlidesOpacity = useTransform(bgScale, [1.7, 1.2, 1], [0, 0, 0.6]);
  const otherSlidesScale = useTransform(bgScale, [1.2, 1], [1 / 1.2, 1]);
  const sectionOpacity = useTransform(parentScroll, [0, 0.01], [0, 1]);
  const btnOpacity = useTransform(bgScale, [1.2, 1.1], [0, 1]);
  const revealSlides = useTransform(parentScroll, [0, 0.05, 0.1], [0, 0, 1]);

  // 🔹 Text appearance opacity (when scale → 1)
  const textOpacity = useTransform(bgScale, [1.05, 1], [0, 1]);
  const overlayTextOpacity = useTransform(
    bgScale,
    [1.78, 1.75, 1.72, 1.01, 1],
    [0, 0.1, 1, 1, 0]
  );
  const overlayTextRight = useTransform(
    bgScale,
    [1.8, 1.7, 1.05],
    [48, 42, 16]
  );
  const overlayTextTop = useTransform(
    bgScale,
    [1.8, 1.7, 1.05],
    ["20%", "25%", "25%"]
  );

  return {
    parentScroll,
    sectionScroll,
    bgScale,
    otherSlidesOpacity,
    otherSlidesScale,
    sectionOpacity,
    btnOpacity,
    revealSlides,
    textOpacity,
    overlayTextOpacity,
    overlayTextRight,
    overlayTextTop,
  };
};

/* ------------------------------------------------------------------ */
/* 🧩 Component: Navigation Buttons for Swiper */
/* ------------------------------------------------------------------ */
const SliderNavigation = ({
  onPrev,
  onNext,
  style,
}: {
  onPrev: () => void;
  onNext: () => void;
  style: MotionStyle;
}) => (
  <motion.div
    style={style}
    className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 md:px-[5vw]"
  >
    <button
      onClick={onPrev}
      className="text-white/80 hover:text-white transition-colors z-50"
    >
      <HiChevronRight className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14" />
    </button>
    <button
      onClick={onNext}
      className="text-white/80 hover:text-white transition-colors z-50"
    >
      <HiChevronLeft className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14" />
    </button>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* 🌌 Main Component */
/* ------------------------------------------------------------------ */
const ImageZoomSliderSection = ({
  parentRef,
  slides: slidesData,
  miniSlider1Data,
  miniSlider2Data,
}: {
  parentRef: React.RefObject<HTMLElement | null>;
  slides?: SlideData[];
  miniSlider1Data?: string[];
  miniSlider2Data?: string[];
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    parentScroll,
    sectionScroll,
    bgScale,
    otherSlidesOpacity,
    otherSlidesScale,
    sectionOpacity,
    btnOpacity,
    revealSlides,
    textOpacity,
    overlayTextOpacity,
    overlayTextRight,
    overlayTextTop,
  } = useImageZoomScroll(parentRef, sectionRef);

  const [showMiniSlider, setShowMiniSlider] = useState(false);

  // ✅ Listen to bgScale value changes
  useMotionValueEvent(bgScale, "change", (latest) => {
    if (latest <= 1.01) setShowMiniSlider(true);
    else setShowMiniSlider(false);
  });

  // Use provided slides or default slides
  const slides = useMemo(() => {
    const activeSlides =
      slidesData && slidesData.length > 0 ? slidesData : DEFAULT_SLIDES;
    // Duplicate slides for smoother loop if not enough slides
    if (activeSlides.length < 4) {
      return [...activeSlides, ...activeSlides, ...activeSlides].slice(0, 6); // Ensure at least 4-6 items for loop
    }
    return activeSlides;
  }, [slidesData]);

  // 🌀 Control autoplay based on visibility
  useMotionValueEvent(sectionScroll, "change", (latestSection) => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const textsGone = parentScroll.get() > 0.98;
    const inView = latestSection > 0 && latestSection < 1;

    if (textsGone && inView) swiper.autoplay.start();
    else swiper.autoplay.stop();
  });

  // 🧭 Callbacks for cleaner handlers
  const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), []);
  const handleNext = useCallback(() => swiperRef.current?.slideNext(), []);

  return (
    <>
      <motion.section
        ref={sectionRef}
        style={{ opacity: sectionOpacity }}
        className="relative h-screen sm:h-[215vh] md:h-[225vh] -mt-0 sm:-mt-[100vh]"
      >
        <div className="sticky top-0 h-screen flex items-center justify-center bg-black overflow-hidden">
          <motion.div className="relative w-full flex items-center justify-center">
            <motion.div
              style={{ opacity: revealSlides }}
              className="w-full relative"
            >
              <Swiper
                modules={[Autoplay]}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                slidesPerView={1}
                centeredSlides
                loop={slides.length >= 4}
                allowTouchMove={false}
                spaceBetween={15}
                autoplay={{
                  delay: 10000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                breakpoints={{
                  640: {
                    slidesPerView: 1.2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 1.5,
                    spaceBetween: 30,
                  },
                }}
                className="w-full flex items-center justify-center !overflow-visible"
              >
                {slides.map((slide, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <SwiperSlide
                      key={index}
                      className={clsx("relative", isActive ? "z-20" : "z-0")}
                    >
                      {/* Main Image */}
                      <motion.div
                        style={{
                          opacity: isActive ? 1 : otherSlidesOpacity,
                          scale: isActive ? bgScale : otherSlidesScale,
                        }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
                      >
                        <Image
                          src={slide.src}
                          alt={`slide-${index}`}
                          fill
                          className="object-cover"
                          priority
                        />
                        {/* 🔹 Text Appears When Scale = 1 */}

                      </motion.div>

                      {/* Zoomed Overlay */}
                      {isActive && (
                        <>
                          <motion.div
                            style={{ scale: bgScale }}
                            className="absolute inset-0 z-10 rounded-3xl overflow-hidden"
                          >
                            <div className="size-full relative">
                              <Image
                                src={slide.src}
                                alt="Zoom Background"
                                fill
                                className="object-cover"
                                priority
                              />

                            </div>
                          </motion.div>
                        </>
                      )}
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {/* Navigation */}
              <SliderNavigation
                onPrev={handlePrev}
                onNext={handleNext}
                style={{ opacity: btnOpacity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      {(miniSlider1Data || miniSlider2Data) && (
        <motion.div className="relative w-full py-2 sm:py-3 md:py-4 bg-black mt-0 sm:-mt-16 md:-mt-20">
          {miniSlider1Data && miniSlider1Data.length > 0 && (
            <MiniMovingSlider
              isVisible={showMiniSlider}
              data={miniSlider1Data}
              baseSpeed={10000}
            />
          )}
          <div className="h-3 sm:h-4 md:h-5"></div>
          {miniSlider2Data && miniSlider2Data.length > 0 && (
            <MiniMovingSlider
              isVisible={showMiniSlider}
              data={miniSlider2Data}
              baseSpeed={8000}
            />
          )}
        </motion.div>
      )}
    </>
  );
};

export default ImageZoomSliderSection;
