"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
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

const SLIDE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 70vw";
const NEAR_SLIDE_DISTANCE = 1;

function circularDistance(a: number, b: number, length: number) {
  if (length <= 0) return 0;
  const diff = Math.abs(a - b);
  return Math.min(diff, length - diff);
}

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

  // Stage 1: mild zoom while previous section ends
  const firstStageScale = useTransform(parentScroll, [0, 1], [1.12, 1.06]);
  // Stage 2: settle to normal
  const secondStageScale = useTransform(sectionScroll, [0.2, 0.55], [1.06, 1]);

  // Combine two transitions dynamically
  const bgScale = useTransform([parentScroll, sectionScroll], ([p]) =>
    (p as number) < 1 ? firstStageScale.get() : secondStageScale.get()
  );

  // Derivative transforms
  const otherSlidesOpacity = useTransform(bgScale, [1.08, 1.03, 1], [0, 0.25, 0.55]);
  const otherSlidesScale = useTransform(bgScale, [1.08, 1], [0.92, 1]);
  const sectionOpacity = useTransform(parentScroll, [0, 0.2], [1, 1]);
  const btnOpacity = useTransform(bgScale, [1.05, 1.02], [0.35, 1]);
  const revealSlides = useTransform(parentScroll, [0, 0.05], [1, 1]);

  // 🔹 Text appearance opacity (when scale → 1)
  const textOpacity = useTransform(bgScale, [1.04, 1], [0, 1]);
  const overlayTextOpacity = useTransform(
    bgScale,
    [1.12, 1.08, 1.04, 1.01, 1],
    [0, 0.15, 1, 1, 0]
  );
  const overlayTextRight = useTransform(bgScale, [1.12, 1.06, 1.02], [40, 28, 16]);
  const overlayTextTop = useTransform(bgScale, [1.12, 1.06, 1.02], ["18%", "22%", "24%"]);

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
      className="text-[#E8F0EB]/90 hover:text-[#E8F0EB] transition-colors z-50"
    >
      <HiChevronRight className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14" />
    </button>
    <button
      onClick={onNext}
      className="text-[#E8F0EB]/90 hover:text-[#E8F0EB] transition-colors z-50"
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
  const [shouldLoadImages, setShouldLoadImages] = useState(false);

  const {
    parentScroll,
    sectionScroll,
    bgScale,
    otherSlidesOpacity,
    otherSlidesScale,
    sectionOpacity,
    btnOpacity,
    revealSlides,
  } = useImageZoomScroll(parentRef, sectionRef);

  const [showMiniSlider, setShowMiniSlider] = useState(true);

  // Mount images only when the album is near the viewport (avoids decode spike)
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || shouldLoadImages) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadImages(true);
          observer.disconnect();
        }
      },
      { rootMargin: "280px 0px", threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoadImages]);

  // ✅ Listen to bgScale value changes
  useMotionValueEvent(bgScale, "change", (latest) => {
    if (latest <= 1.05) setShowMiniSlider(true);
    else setShowMiniSlider(false);
  });

  // Keep original slide count — enough for Swiper loop without doubling decode cost
  const slides = useMemo(
    () => (slidesData?.length ? slidesData : []),
    [slidesData]
  );

  // 🌀 Control autoplay based on visibility
  useMotionValueEvent(sectionScroll, "change", (latestSection) => {
    const swiper = swiperRef.current;
    if (!swiper?.autoplay) return;

    const inView = latestSection > 0.05 && latestSection < 0.95;
    if (inView) swiper.autoplay.start();
    else swiper.autoplay.stop();
  });

  // 🧭 Callbacks for cleaner handlers
  const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), []);
  const handleNext = useCallback(() => swiperRef.current?.slideNext(), []);

  const shouldRenderSlideImage = useCallback(
    (index: number) => {
      if (!shouldLoadImages) return false;
      return (
        circularDistance(index, activeIndex, slides.length) <=
        NEAR_SLIDE_DISTANCE
      );
    },
    [activeIndex, shouldLoadImages, slides.length]
  );

  return (
    <>
      <motion.section
        ref={sectionRef}
        style={{ opacity: sectionOpacity }}
        className="relative min-h-[100svh] bg-[#000412] md:min-h-[130vh]"
      >
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-[#000412]">
          <motion.div className="relative flex w-full max-w-[1600px] items-center justify-center px-3 sm:px-6">
            <motion.div
              style={{ opacity: revealSlides }}
              className="relative w-full"
            >
              <Swiper
                modules={[Autoplay]}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  swiper.autoplay?.start();
                }}
                slidesPerView={1}
                centeredSlides
                loop={slides.length >= 4}
                watchSlidesProgress
                allowTouchMove
                spaceBetween={12}
                autoplay={{
                  delay: 10000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                breakpoints={{
                  640: {
                    slidesPerView: 1.15,
                    spaceBetween: 16,
                  },
                  1024: {
                    slidesPerView: 1.35,
                    spaceBetween: 24,
                  },
                }}
                className="flex !w-full items-center justify-center !overflow-visible"
              >
                {slides.map((slide, index) => {
                  const isActive = activeIndex === index;
                  const renderImage = shouldRenderSlideImage(index);
                  return (
                    <SwiperSlide
                      key={`${slide.src}-${index}`}
                      className={clsx("relative", isActive ? "z-20" : "z-0")}
                    >
                      <motion.div
                        style={{
                          opacity: isActive ? 1 : otherSlidesOpacity,
                          scale: isActive ? bgScale : otherSlidesScale,
                        }}
                        transition={{ duration: 0.4 }}
                        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#121a17] shadow-2xl shadow-black/40 sm:aspect-[16/9] sm:rounded-[1.75rem]"
                      >
                        {renderImage ? (
                          <Image
                            src={slide.src}
                            alt={slide.title || `slide-${index + 1}`}
                            fill
                            sizes={SLIDE_SIZES}
                            className="object-cover"
                            priority={index === 0 && shouldLoadImages}
                            loading={
                              index === 0 && shouldLoadImages
                                ? "eager"
                                : "lazy"
                            }
                          />
                        ) : null}
                      </motion.div>
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
        <motion.div className="relative mt-0 w-full bg-[#000412] py-4 sm:py-5 md:py-6">
          {miniSlider1Data && miniSlider1Data.length > 0 && (
            <MiniMovingSlider
              isVisible={showMiniSlider}
              data={miniSlider1Data}
              baseSpeed={10000}
            />
          )}
          <div className="h-3 sm:h-4 md:h-5" />
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
