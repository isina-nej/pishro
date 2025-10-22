import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Swiper as SwiperType } from "swiper/types";

import "swiper/css";
import "swiper/css/navigation";
import clsx from "clsx";

const IMAGES = [
  "/images/home/c/metaverse.webp",
  "/images/home/c/airdrop.jpg",
  "/images/home/c/nft.jpg",
];

const ImageZoomSliderSection = ({
  parentRef,
}: {
  parentRef: React.RefObject<HTMLElement | null>;
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 👇 اسکرول سکشن پدر (برای تشخیص خروج متن‌ها)
  const { scrollYProgress: parentScroll } = useScroll({
    target: parentRef,
    offset: ["end end", "end start"],
  });

  // 👇 اسکرول خود سکشن اسلایدر (برای دیدن در صفحه)
  const { scrollYProgress: sectionScroll } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // 🔹 انیمیشن‌ها
  const bgScale = useTransform(parentScroll, [0, 0.99, 1], [1.8, 1.7, 1]);
  const bgOpacity = useTransform(parentScroll, [0, 0.99, 1], [1, 1, 0]);
  const secOpacity = useTransform(parentScroll, [0, 0.01], [0, 1]);
  const btnOpacity = useTransform(parentScroll, [0, 0.98, 1], [0, 0, 1]);
  const revealSlides = useTransform(parentScroll, [0, 0.05, 0.1], [0, 0, 1]);
  const slides = [...IMAGES, ...IMAGES];

  // 👇 کنترل autoplay
  useMotionValueEvent(sectionScroll, "change", (latestSection) => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const latestParent = parentScroll.get();
    const textsAreGone = latestParent > 0.98;
    const sliderInView = latestSection > 0 && latestSection < 1;

    if (textsAreGone && sliderInView) swiper.autoplay.start();
    else swiper.autoplay.stop();
  });

  return (
    <motion.div
      ref={sectionRef}
      style={{ opacity: secOpacity }}
      className="relative h-[205vh] -mt-[100vh]"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* اسلایدر */}
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
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              autoplay={{
                delay: 10000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="w-full flex items-center justify-center !overflow-visible"
            >
              {/* سایر اسلایدها */}
              {slides.map((src, index) => (
                <SwiperSlide
                  key={index}
                  className={clsx(
                    "relative",
                    activeIndex === index ? "z-20" : "z-0"
                  )}
                >
                  {/* تصویر اصلی */}
                  <motion.div
                    animate={{ opacity: activeIndex === index ? 1 : 0.6 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl z-0"
                  >
                    <Image
                      src={src}
                      alt={`slide-${index}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                  {/* تصویر زوم */}
                  <motion.div
                    style={{
                      scale: bgScale,
                      opacity: bgOpacity,
                      display: activeIndex === index ? "block" : "none",
                    }}
                    className="absolute inset-0 z-10 rounded-3xl overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt="Zoom Background"
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* دکمه‌های ناوبری */}
            <motion.div
              style={{ opacity: btnOpacity }}
              className={clsx(
                "absolute inset-0 items-center flex justify-between px-[5vw]"
              )}
            >
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="text-white/80 hover:text-white transition-colors z-50"
              >
                <HiChevronRight size={60} />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="text-white/80 hover:text-white transition-colors z-50"
              >
                <HiChevronLeft size={60} />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ImageZoomSliderSection;
