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
  const scale = useTransform(parentScroll, [0, 1], [1.2, 1]);
  const bgScale = useTransform(parentScroll, [0, 1], [1.2, 0.66]);
  const opacity = useTransform(parentScroll, [0, 0.01], [0, 1]);
  const revealSlides = useTransform(parentScroll, [0, 0.4, 1], [0, 0, 1]);
  const slides = [...IMAGES, ...IMAGES];

  // 👇 همین کار برای اسکرول خود سکشن هم (درصورتی که فقط بالا/پایین بری)
  useMotionValueEvent(sectionScroll, "change", (latestSection) => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const latestParent = parentScroll.get();
    const textsAreGone = latestParent > 0.98;
    const sliderInView = latestSection > 0 && latestSection < 1;

    if (textsAreGone && sliderInView) {
      swiper.autoplay.start();
      // console.log("▶️ autoplay started (section) ", latestSection);
    } else {
      swiper.autoplay.stop();
      // console.log("⏸ autoplay stopped (section) ", latestSection);
    }
  });

  return (
    <motion.div
      ref={sectionRef}
      style={{ opacity }}
      className="relative h-[205vh] -mt-[100vh]"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* اسلایدر */}
        <motion.div
          style={{ scale, opacity }}
          className="relative w-full flex items-center justify-center"
        >
          <motion.div style={{ opacity: revealSlides }} className="w-full">
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
              className="w-full flex items-center justify-center"
            >
              {slides.map((src, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    animate={{ opacity: activeIndex === index ? 1 : 0.6 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl"
                  >
                    <Image
                      src={src}
                      alt={`slide-${index}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* دکمه‌های ناوبری */}
            <div className="absolute inset-0 flex items-center justify-between px-[5vw]">
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
            </div>
          </motion.div>

          {/* تصویر پس‌زمینه قبل از ورود اسلایدر */}
          <motion.img
            src={IMAGES[activeIndex]}
            alt="Zoom Background"
            style={{
              scale: bgScale,
              opacity: useTransform(parentScroll, [0, 0.99, 1], [1, 1, 0]),
              position: "absolute",
            }}
            className="w-full aspect-[16/9] object-cover rounded-3xl"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ImageZoomSliderSection;
