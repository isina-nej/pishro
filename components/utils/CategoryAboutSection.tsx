"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CategoryAboutSectionProps {
  // Main content
  title1?: string;
  title2?: string;
  description?: string;
  image?: string;

  // Call to actions
  cta1Text?: string;
  cta1Link?: string;
  cta2Text?: string;
  cta2Link?: string;

  // Optional video
  videoUrl?: string;
}

const CategoryAboutSection = ({
  title1 = "مسیر",
  title2 = "پیشرو",
  description = "در مسیر پیشرو، هدف ما فقط سرمایه‌گذاری نیست؛ بلکه ساختن آینده‌ای مطمئن و پویاست...",
  image = "/images/utiles/font-iran-section.svg",
  cta1Text = "شروع مسیر",
  cta1Link = "#",
  cta2Text = "بیشتر بدانید",
  cta2Link,
  videoUrl = "/videos/landing-vid.webm",
}: CategoryAboutSectionProps) => {
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(image);
  const defaultImage = "/images/utiles/font-iran-section.svg";

  return (
    <div className="min-h-[400px] sm:min-h-[500px] md:min-h-[650px] lg:min-h-[800px] relative mt-8 sm:mt-12 md:mt-16 lg:mt-20 overflow-hidden">
      {/* پس‌زمینه */}
      <div className="absolute bottom-0 left-0 w-full aspect-[1440/1000] pointer-events-none !-z-10">
        <div className="size-full relative">
          <Image
            src={imageSrc}
            alt="Background Image"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            onError={() => setImageSrc(defaultImage)}
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 size-full pointer-events-none !-z-20 bg-[#F4F0EA]" />

      {/* متن اصلی */}
      <div className="container-xl flex pt-16 sm:pt-24 md:pt-32 lg:pt-40 justify-end h-full z-[999] px-4 sm:px-6 md:px-8">
        <div className="max-w-full sm:max-w-[550px] md:max-w-[650px] lg:max-w-[750px] text-right space-y-4 sm:space-y-5 md:space-y-6">
          {/* عنوان */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[120px] leading-[1.1] font-extrabold">
            <span className="text-[#214254]">{title1}</span>{" "}
            <span className="text-[#FFA135] ml-1 sm:ml-2">{title2}</span>
          </h2>

          {/* توضیحات */}
          <p className="text-[#8E8E8E] leading-6 sm:leading-7 md:leading-8 text-sm sm:text-base md:text-lg font-medium max-w-full sm:max-w-[500px] md:max-w-[650px]">
            {description}
          </p>

          {/* دکمه‌های CTA */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Link
              href={cta1Link}
              className="px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-1/2 flex justify-center items-center rounded-full text-sm sm:text-base md:text-lg font-bold bg-[#214254] text-white hover:bg-[#214254]/5 hover:text-[#214254] hover:border-[#214254] border transition-all"
              aria-label={cta1Text}
            >
              {cta1Text}
            </Link>

            {/* دکمه‌ای که مدال یا لینک را باز می‌کند */}
            {cta2Link ? (
              <Link
                href={cta2Link}
                className="px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-1/2 flex justify-center items-center rounded-full text-sm sm:text-base md:text-lg font-bold border-2 border-[#FFA135] bg-[#FFA135] text-white hover:text-[#FFA135] hover:bg-transparent transition-all"
                aria-label={cta2Text}
              >
                {cta2Text}
              </Link>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button
                    className="px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-1/2 flex justify-center items-center rounded-full text-sm sm:text-base md:text-lg font-bold border-2 border-[#FFA135] bg-[#FFA135] text-white hover:text-[#FFA135] hover:bg-transparent transition-all"
                    aria-label={cta2Text}
                  >
                    {cta2Text}
                  </button>
                </DialogTrigger>

                {/* محتوای مدال - ویدیو */}
                <DialogContent className="max-w-[90vw] md:max-w-3xl bg-transparent border-none shadow-none p-0">
                  <div className="sr-only">
                    <DialogTitle>فیلم توضیحات</DialogTitle>
                  </div>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAboutSection;
