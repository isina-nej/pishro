"use client";

import Image from "next/image";
import Link from "next/link";

interface AboutOtherPagesProps {
  data: {
    title1: string; // بخش اول تیتر (مثلاً مسیر)
    title2: string; // بخش دوم تیتر (مثلاً پیشرو)
    description: string;
    button1: string;
    button2: string;
    image?: string; // تصویر پس‌زمینه سفارشی (اختیاری)
  };
}

const AboutOtherPages = ({ data }: AboutOtherPagesProps) => {
  const {
    title1 = "مسیر",
    title2 = "پیشرو",
    description = "در مسیر پیشرو، هدف ما فقط سرمایه‌گذاری نیست؛ بلکه ساختن آینده‌ای مطمئن و پویاست...",
    button1 = "شروع مسیر",
    button2 = "بیشتر بدانید",
    image = "/images/utiles/font-iran-section.svg",
  } = data;

  return (
    <div className="h-[1010px] relative mt-20">
      {/* 🌄 پس‌زمینه */}
      <div className="absolute bottom-0 left-0 w-full aspect-[1440/847] pointer-events-none !-z-10">
        <div className="size-full relative">
          <Image
            src={image}
            alt="Background Image"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 size-full pointer-events-none !-z-20 bg-[#F4F0EA]" />

      {/* ✍️ متن اصلی */}
      <div className="container-xl flex pt-40 justify-end h-full z-[999]">
        <div className="max-w-[750px] text-right space-y-6">
          {/* 🔹 تیتر اصلی با دو رنگ */}
          <h2 className="text-[120px] leading-[1.1] font-extrabold">
            <span className="text-[#214254]">{title1}</span>{" "}
            <span className="text-[#FFA135] ml-2">{title2}</span>
          </h2>

          {/* 🔸 متن توضیحی */}
          <p className="text-[#8E8E8E] leading-8 text-lg font-medium !z-[10000] max-w-[650px]">
            {description}
          </p>

          {/* 🔘 دکمه‌ها */}
          <div className="flex gap-4 pt-4">
            <Link
              href="#"
              className="px-8 py-3 w-1/2 flex justify-center items-center rounded-full text-lg font-bold bg-[#214254] text-white hover:bg-[#214254]/5 hover:text-[#214254] hover:border-[#214254] border transition-all"
            >
              {button1}
            </Link>
            <Link
              href="#"
              className="px-8 py-3 w-1/2 flex justify-center items-center rounded-full text-lg font-bold border-2 border-[#FFA135] hover:text-[#FFA135] hover:bg-transparent bg-[#FFA135] text-white transition-all"
            >
              {button2}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOtherPages;
