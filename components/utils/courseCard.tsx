"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Video } from "lucide-react";
import Price from "./price";
import { FormatTime } from "./FormatTime";
import RatingStars from "./RatingStars";

interface CourseCardProps {
  data: {
    subject: string;
    price: number;
    img?: string | null;
    rating?: number | null;
    description?: string | null;
    discountPercent?: number | null;
    time?: string | null;
    students?: number | null;
    videosCount?: number | null;
  };
  link: string;
}

const CourseCard = ({ data, link }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={link}
      className="
        group w-full 
        shadow-md transition-shadow rounded-xl
        p-3 pb-8 bg-white flex flex-col relative
        hover:shadow-lg
      "
    >
      {/* Image section */}
      <motion.div
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full aspect-[464/238] overflow-hidden rounded-lg"
      >
        {imageError ? (
          <div className="w-full h-full bg-[#e5e5e5] flex items-center justify-center">
            <span className="text-gray-400 text-sm">تصویر در دسترس نیست</span>
          </div>
        ) : (
          <Image
            src={data.img || "/images/default-course.jpg"}
            alt={data.subject}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex-1 flex flex-col justify-between mt-2"
      >
        <div className="flex justify-between items-center">
          <h4 className="text-xs sm:text-sm text-[#ACACAC] font-bold">
            {data.subject}
          </h4>
          <RatingStars rating={data.rating || 2.5} />
        </div>

        <div className="mt-1 flex flex-col">
          <p className="font-bold text-sm sm:text-sm text-gray-800 line-clamp-2">
            {data.description || "بدون توضیح"}
          </p>

          <div className="flex justify-end">
            <Price price={data.price} discount={data.discountPercent || 0} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 1 }}
          className="mt-1 pt-1.5 flex justify-between text-[#ACACAC] font-bold text-xs sm:text-sm border-t border-dashed border-[#acacac]"
        >
          <span className="flex items-center gap-1">
            <Users size={16} className="text-gray-900" />
            {data.students ?? 1} دوره آموز
          </span>
          <span className="flex items-center gap-1">
            <Video size={16} className="text-gray-900" />
            {data.videosCount ?? 1} ویدئو تخصصی
          </span>
          <FormatTime time={data.time || "0:00"} />
        </motion.div>
      </motion.div>

      {/* به جای دکمه absolute پایین کارت */}
      <div className="absolute -bottom-5 w-full flex justify-center pl-6">
        <button
          className="
            w-48 bg-mySecondary text-white font-bold text-sm sm:text-base
            py-2 rounded-full shadow-md hover:opacity-90 transition
          "
        >
          افزودن به سبد خرید
        </button>
      </div>
    </Link>
  );
};

export default CourseCard;
