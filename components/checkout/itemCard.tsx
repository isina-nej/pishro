"use client";

import { useState } from "react";
import Image from "next/image";
import { Course } from "@prisma/client";

interface ItemCardProps {
  data: Course;
}

const ItemCard = ({ data }: ItemCardProps) => {
  const [imageError, setImageError] = useState(false);
  return (
    <div className="w-full h-fit max-w-[410px] bg-[#fafafa]">
      {/* header */}
      <div className="p-4 border-b">
        <h6>{data.subject}</h6>
      </div>
      {/* image */}
      <div className="w-full aspect-[16/9] p-4 border-b">
        <div className="relative size-full rounded-lg overflow-hidden">
          {imageError ? (
            <div className="size-full bg-[#e5e5e5] flex items-center justify-center">
              <span className="text-gray-400">تصویر در دسترس نیست</span>
            </div>
          ) : (
            <Image
              src={data.img || ""}
              alt="product-image"
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>
      {/* price */}
      <div className="p-4 flex items-center justify-between">
        <p className="text-xs text-[#546f7d] font-medium">قیمت کل: </p>
        <p>{data.price.toLocaleString("fa-IR")} تومان</p>
      </div>
    </div>
  );
};

export default ItemCard;
