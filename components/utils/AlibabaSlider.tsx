"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

interface AlibabaSliderProps {
  topImages: string[];
  middleImages: string[];
  bottomImages: string[];
}

const AlibabaSlider: React.FC<AlibabaSliderProps> = ({
  topImages,
  middleImages,
  bottomImages,
}) => {
  const renderRow = (images: string[], reverse: boolean = false) => (
    <Swiper
      modules={[Autoplay]}
      slidesPerView={"auto"} // نمایش چندین اسلاید کنار هم
      spaceBetween={16} // فاصله بین تصاویر
      loop={true} // حلقه بی‌نهایت
      speed={5000} // سرعت انیمیشن
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: reverse,
      }}
      allowTouchMove={false} // جلوگیری از درگ دستی
      className="w-full"
    >
      {images.map((src, idx) => (
        <SwiperSlide key={idx} className="!w-64 !h-36 flex-shrink-0 relative">
          <ImageWithFallback src={src} />
        </SwiperSlide>
      ))}
    </Swiper>
  );

  return (
    <div className="w-full overflow-hidden space-y-6">
      {/* Top Slider */}
      {renderRow(topImages)}

      {/* Middle Slider (reverse direction) */}
      {renderRow(middleImages, true)}

      {/* Bottom Slider */}
      {renderRow(bottomImages)}
    </div>
  );
};

export default AlibabaSlider;

interface ImageWithFallbackProps {
  src: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src }) => {
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!error ? (
        <Image
          src={src}
          alt="slide"
          fill
          className="object-cover rounded-3xl shadow-md"
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-600 rounded-3xl shadow-inner text-xs">
          <ImageOff className="h-6 w-6 mb-1" />
          تصویر لود نشد
        </div>
      )}
    </div>
  );
};
