"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Date from "@/components/utils/date";

interface BlogCardProps {
  img: string;
  date: string;
  title: string;
  description: string;
  link: string;
}

const BlogCard = ({ title, date, description, img, link }: BlogCardProps) => {
  const [imageError, setImageError] = useState(false); // مدیریت خطای تصویر

  return (
    <Link
      href={link}
      className="block w-full sm:w-[48%] lg:w-[31%] rounded-sm border-2 border-[#f5f5f5] overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative w-full h-[168px] bg-[#e5e5e5] ">
        {imageError ? (
          // نمایش کنتینر جایگزین در صورت بروز خطا
          <div className="size-full flex items-center justify-center">
            <span className="text-gray-400">تصویر در دسترس نیست</span>
          </div>
        ) : (
          // تصویر اصلی
          <Image
            src={img}
            alt={title}
            layout="fill"
            className="object-cover object-center transition-transform transform hover:scale-105"
            onError={() => setImageError(true)} // تنظیم خطای تصویر
          />
        )}
        <div className="absolute top-3 right-3">
          <Date date={date} />
        </div>
      </div>
      <div className="p-4 bg-white">
        <h4 className="text-lg font-bold text-center mb-3">{title}</h4>
        <p className="text-[#4d4d4d] font-medium text-sm">{description}</p>
      </div>
    </Link>
  );
};

export default BlogCard;
