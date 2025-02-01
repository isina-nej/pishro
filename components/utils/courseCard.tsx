"use client";

import Image from "next/image";
import Link from "next/link"; // برای لینک کردن کامپوننت
import { useState } from "react";

interface CourseCardProps {
  title: string;
  description: string;
  img: string;
  link: string; // لینک به صفحه مربوطه
}

const CourseCard = ({ title, description, img, link }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false); // مدیریت خطای تصویر

  return (
    <Link
      href={link}
      className="w-full flex border rounded-[10px] overflow-hidden hover:shadow-lg transition-all"
    >
      <div>
        {imageError ? (
          // نمایش کنتینر جایگزین در صورت بروز خطا
          <div className="w-[254px] h-full min-h-[208px] bg-[#e5e5e5] flex items-center justify-center">
            <span className="text-gray-400">تصویر در دسترس نیست</span>
          </div>
        ) : (
          // تصویر اصلی
          <Image
            src={img}
            alt={title}
            width={254}
            height={148}
            onError={() => setImageError(true)} // تنظیم خطای تصویر
          />
        )}
      </div>
      <div className="mt-6 py-3 px-2 bg-white">
        <h4 className="text-sm leading-7 text-[#131B22] font-bold mb-3">
          {title}
        </h4>
        <p className="text-xs leading-6 text-[#666666] max-w-[640px]">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
