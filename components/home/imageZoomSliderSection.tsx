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
import { miniSliderData1, miniSliderData2 } from "@/public/data";

/* ------------------------- 🖼️ Image Data ------------------------- */
const SLIDES = [
  {
    src: "/images/home/c/metaverse.webp",
    title: "آینده متاورس",
    text: "کشف نسل بعدی از جهان‌های دیجیتال.",
  },
  {
    src: "/images/home/c/airdrop.jpg",
    title: "انقلاب ایردراپ",
    text: "پاداش‌ها را فوراً دریافت کنید و درآمد کسب کنید.",
  },
  {
    src: "/images/home/c/nft.jpg",
    title: "تکامل NFT",
    text: "هنر مالکیت دیجیتال را کشف کنید.",
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
    className="absolute inset-0 flex items-center justify-between px-[5vw]"
  >
    <button
      onClick={onPrev}
      className="text-white/80 hover:text-white transition-colors z-50"
    >
      <HiChevronRight size={60} />
    </button>
    <button
      onClick={onNext}
      className="text-white/80 hover:text-white transition-colors z-50"
    >
      <HiChevronLeft size={60} />
    </button>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* 🌌 Main Component */
/* ------------------------------------------------------------------ */
const ImageZoomSliderSection = ({
  parentRef,
}: {
  parentRef: React.RefObject<HTMLElement | null>;
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
  } = useImageZoomScroll(parentRef, sectionRef);

  const [showMiniSlider, setShowMiniSlider] = useState(false);

  // ✅ Listen to bgScale value changes
  useMotionValueEvent(bgScale, "change", (latest) => {
    if (latest <= 1.01) setShowMiniSlider(true);
    else setShowMiniSlider(false);
  });

  const slides = useMemo(() => [...SLIDES, ...SLIDES], []);

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
        className="relative h-[225vh] -mt-[100vh]"
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
                slidesPerView={1.5}
                centeredSlides
                loop={slides.length >= 4}
                allowTouchMove={false}
                spaceBetween={30}
                autoplay={{
                  delay: 10000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
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
                        className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl"
                      >
                        <Image
                          src={slide.src}
                          alt={`slide-${index}`}
                          fill
                          className="object-cover"
                          priority
                        />
                      </motion.div>

                      {/* Zoomed Overlay */}
                      {isActive && (
                        <>
                          <motion.div
                            style={{ scale: bgScale }}
                            className="absolute inset-0 z-10 rounded-3xl overflow-hidden"
                          >
                            <Image
                              src={slide.src}
                              alt="Zoom Background"
                              fill
                              className="object-cover"
                              priority
                            />
                          </motion.div>

                          {/* 🔹 Text Appears When Scale = 1 */}
                          <motion.div
                            style={{ opacity: textOpacity }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute top-6 right-8 text-right text-white z-20"
                          >
                            <h3 className="text-2xl font-semibold mb-1 drop-shadow-lg">
                              {slide.title}
                            </h3>
                            <p className="text-sm text-white/80 max-w-[240px] leading-snug drop-shadow">
                              {slide.text}
                            </p>
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
      <motion.div className="relative w-full py-4 bg-black -mt-20">
        <MiniMovingSlider isVisible={showMiniSlider} data={miniSliderData1} />
        <div className="h-5"></div>
        <MiniMovingSlider
          isVisible={showMiniSlider}
          data={miniSliderData2}
          baseSpeed={6000}
        />
      </motion.div>
    </>
  );
};

export default ImageZoomSliderSection;
