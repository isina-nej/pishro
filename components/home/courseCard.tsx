"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Users, Video } from "lucide-react"; // ✅ icons
import Price from "../utils/price";
import { FormatTime } from "../utils/FormatTime";
import RatingStars from "../utils/RatingStars";

interface CourseCardProps {
  data: {
    subject: string;
    price: number;
    img: string;
    rating: number;
    description: string;
    discountPercent: number;
    time: string;
    students: number;
    videosCount: number;
  };
  link: string;
}

const CourseCard = ({ data, link }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={link}
      className="block w-full shadow-md hover:shadow-lg transition-shadow rounded-xl p-3"
    >
      {/* image */}
      <div className="relative w-full min-h-[220px] overflow-hidden rounded-xl">
        {imageError ? (
          <div className="w-full min-h-[220px] aspect-square bg-[#e5e5e5] flex items-center justify-center">
            <span className="text-gray-400">تصویر در دسترس نیست</span>
          </div>
        ) : (
          <Image
            src={data.img}
            alt={data.subject}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* subject, price and etc */}
      <div className="mt-4">
        {/* top */}
        <div className="border-b border-dashed border-[#acacac] pb-2">
          <div className="flex justify-between items-start">
            <h4 className="text-sm text-[#ACACAC] font-bold">{data.subject}</h4>
            {/* rating stars */}
            <div>
              <RatingStars rating={data.rating} />
            </div>
          </div>
          <p className="font-bold">{data.description}</p>
          <div className="flex justify-end">
            <Price price={data.price} discount={data.discountPercent} />
          </div>
        </div>

        {/* bottom */}
        <div className="py-6">
          <div className="flex justify-between text-[#ACACAC] font-bold">
            {/* students */}
            <span className="flex items-center gap-1">
              <Users size={20} className="text-gray-900 mb-1" />
              {data.students} دانشجو
            </span>

            {/* videos */}
            <span className="flex items-center gap-1">
              <Video size={20} className="text-gray-900 mb-1" />
              {data.videosCount} ویدئو
            </span>

            {/* time */}
            <FormatTime time={data.time} />
          </div>
        </div>
      </div>
      <div className="relative flex justify-center">
        <button className="bg-mySecondary text-white absolute -bottom-9 rounded-full px-12 py-2 font-bold text-lg shadow-md transition-transform hover:scale-105">
          خرید دوره
        </button>
      </div>
    </Link>
  );
};

export default CourseCard;
